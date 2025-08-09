import { prisma } from '@/lib/prisma'

export async function POST(req:Request){
  const text = await req.text()
  const lines = text.split(/\r?\n/).filter(Boolean)
  const header = lines.shift()
  if(!header) return Response.json({ inserted: 0 })
  const cols = header.split(',').map(s=>s.trim())
  const idx = (n:string)=> cols.indexOf(n)

  let inserted = 0
  for(const line of lines){
    const parts = line.split(',')
    const fullName = parts[idx('full_name')]||''
    if(!fullName) continue
    const bar = parts[idx('bar_number')]||null
    const status = parts[idx('status')]||'Good Standing'
    const statusDate = parts[idx('status_effective_date')]||null

    const a = await prisma.attorney.create({ data:{
      fullName, barNumber: bar, status,
      statusEffectiveDate: statusDate ? new Date(statusDate) : null
    }})
    const actionType = parts[idx('action_type')]||''
    if(actionType){
      await prisma.disciplinaryAction.create({ data:{
        attorneyId: a.id,
        actionType,
        decisionDate: parts[idx('decision_date')] ? new Date(parts[idx('decision_date')]) : null,
        citation: parts[idx('citation')]||null,
        summary: parts[idx('summary')]||null,
        sourceUrl: parts[idx('source_url')]||null,
        pdfUrl: parts[idx('pdf_url')]||null
      }})
    }
    inserted++
  }
  return Response.json({ inserted })
}