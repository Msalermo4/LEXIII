import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''
  const status = searchParams.get('status') ?? ''
  const where:any = {}
  if(q){
    where.OR = [
      { fullName: { contains: q, mode: 'insensitive' } },
      { barNumber: { contains: q, mode: 'insensitive' } },
    ]
  }
  if(status) where.status = status
  const rows = await prisma.attorney.findMany({ where, orderBy:{ fullName:'asc' }, take: 100 })
  return Response.json(rows)
}