import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeStatus } from '@/lib/normalize'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function fetchText(url: string) {
  const r = await fetch(url, { next: { revalidate: 0 } })
  if (!r.ok) throw new Error(`Fetch failed ${r.status}`)
  return r.text()
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || ''
  if (!process.env.TASK_TOKEN || token !== process.env.TASK_TOKEN) {
    return new Response('forbidden', { status: 403 })
  }

  const start = Number(req.nextUrl.searchParams.get('start') || '2017')
  const end = Number(req.nextUrl.searchParams.get('end') || new Date().getFullYear().toString())

  const BASE = 'https://poderjudicial.pr/tribunal-supremo/decisiones-del-tribunal-supremo/'
  const YEAR_URL = (y: number) => `${BASE}decisiones-del-tribunal-supremo-${y}/`

  let count = 0

  for (let y = start; y <= end; y++) {
    const html = await fetchText(YEAR_URL(y))
    const anchors = Array.from(
      html.matchAll(/<a [^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)
    )

    for (const m of anchors) {
      const href = (m[1] || '').trim()
      const inner = (m[2] || '').trim()
      if (!href) continue

      // keep only links likely related to TSPR decisions
      if (!/dts\.poderjudicial\.pr/i.test(href) && !/tspr/i.test(inner + href)) continue

      // strip HTML, normalize whitespace
      const block = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      const low = block.toLowerCase()

      // must look like an In re / Conducta Profesional item
      if (!(low.includes('in re') || low.includes('conducta profesional'))) continue

      const citation = (block.match(/\b20\d{2}\s*TSPR\s*\d+\b/i) || [''])[0] || null
      const partes = (block.match(/Partes\s+(.+?)(?:Ponente|Fecha|Materia|$)/i) || [])[1] || block
      const fechaTxt =
        (block.match(/Fecha\s+([0-9]{1,2}\s+de\s+\w+\s+de\s+20\d{2})/i) || [])[1] || null
      const materia = (block.match(/Materia\s+(.+)$/i) || [])[1] || ''

      // remove leading "In re:"
      const name = partes.replace(/^in\s*re\s*:?\s*/i, '').trim()

      // naive date parse fallback
      let decisionDate: Date | null = null
      if (fechaTxt) {
        const tryDate = new Date(fechaTxt)
        decisionDate = isNaN(tryDate.getTime()) ? null : tryDate
      }

      const a = await prisma.attorney.upsert({
        where: { fullName: name },
        update: {},
        create: { fullName: name, status: normalizeStatus(materia) }
      })

      await prisma.disciplinaryAction.create({
        data: {
          attorneyId: a.id,
          actionType: 'Conducta Profesional',
          decisionDate,
          citation,
          summary: materia || null,
          sourceUrl: YEAR_URL(y),
          pdfUrl: href.startsWith('http') ? href : YEAR_URL(y)
        }
      })

      count++
    }
  }

  return Response.json({ inserted: count })
}


  return Response.json({ inserted: count });
}
