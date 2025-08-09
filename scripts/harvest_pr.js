import { prisma } from '../lib/prisma'
import { normalizeStatus } from '../lib/normalize'

const BASE = 'https://poderjudicial.pr/tribunal-supremo/decisiones-del-tribunal-supremo/'
const yurl = (y)=> `${BASE}decisiones-del-tribunal-supremo-${y}/`

function strip(html){
  return html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()
}

async function harvestYear(y){
  const res = await fetch(yurl(y), { headers:{ 'user-agent':'LEXIII/1.0 (+contact)' } })
  if(!res.ok) throw new Error('Fetch '+y+' '+res.status)
  const html = await res.text()
  const anchors = Array.from(html.matchAll(/<a [^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi))
  let inserted = 0
  for(const m of anchors){
    const href = m[1]||''
    const inner = m[2]||''
    if(!href) continue
    if(!/dts\.poderjudicial\.pr/i.test(href) && !/tspr/i.test(inner+href)) continue
    const block = strip(inner)
    const low = block.toLowerCase()
    if(!(low.includes('in re') || low.includes('conducta profesional'))) continue
    const citation = (block.match(/\b20\d{2}\s*TSPR\s*\d+\b/i)||[''])[0]
    const partes = (block.match(/Partes\s+(.+?)(?:Ponente|Fecha|Materia|$)/i)||[])[1]||block
    const fecha = (block.match(/Fecha\s+([0-9]{1,2}\s+de\s+\w+\s+de\s+20\d{2})/i)||[])[1]||null
    const materia = (block.match(/Materia\s+(.+)$/i)||[])[1]||''
    const name = partes.replace(/(?i)^in\s*re\s*:?\s*/,'').trim()
    const a = await prisma.attorney.upsert({
      where:{ fullName: name },
      update:{},
      create:{ fullName: name, status: normalizeStatus(materia) }
    })
    await prisma.disciplinaryAction.create({
      data:{
        attorneyId: a.id,
        actionType: 'Conducta Profesional',
        decisionDate: fecha ? new Date(fecha) : null,
        citation: citation || null,
        summary: materia || null,
        sourceUrl: yurl(y),
        pdfUrl: href.startsWith('http')? href : yurl(y)
      }
    })
    inserted++
  }
  return inserted
}

async function main(){
  const start = Number(process.argv[2]||'2017')
  const end = Number(process.argv[3]||new Date().getFullYear())
  let total=0
  for(let y=start; y<=end; y++){
    const n = await harvestYear(y)
    total += n
    await new Promise(r=>setTimeout(r, 500))
  }
  console.log('Inserted', total)
  process.exit(0)
}

main().catch(e=>{ console.error(e); process.exit(1) })