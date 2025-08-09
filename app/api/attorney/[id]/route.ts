import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET(_:Request,{params}:{params:{id:string}}){
  const id = Number(params.id)
  const atty = await prisma.attorney.findUnique({ where:{ id }, include:{ actions:true } })
  if(!atty) return new Response('Not found', { status:404 })
  return Response.json(atty)
}