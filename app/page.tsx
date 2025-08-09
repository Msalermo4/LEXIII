import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home({ searchParams }:{ searchParams?:{ q?:string, status?:string } }){
  const q = searchParams?.q ?? ''
  const status = searchParams?.status ?? ''
  const where:any = {}
  if(q){
    where.OR = [
      { fullName: { contains: q, mode: 'insensitive' } },
      { barNumber: { contains: q, mode: 'insensitive' } },
    ]
  }
  if(status) where.status = status
  const rows = await prisma.attorney.findMany({ where, orderBy:{ fullName: 'asc' }, take: 100 })
  return (<div>
    <h1 style={{fontSize:24, fontWeight:700, marginBottom:12}}>Directorio</h1>
    <form style={{display:'flex', gap:8, marginBottom:12}}>
      <input name="q" defaultValue={q} placeholder="Busca por nombre o número de colegiado" style={{flex:1, padding:'8px 12px', border:'1px solid #d1d5db', borderRadius:6}} />
      <select name="status" defaultValue={status} style={{padding:'8px 12px', border:'1px solid #d1d5db', borderRadius:6}}>
        <option value="">Todos</option>
        <option>Good Standing</option>
        <option>Suspended</option>
        <option>Revoked</option>
        <option>Disbarred</option>
        <option>Censured</option>
        <option>Reinstated</option>
        <option>Other</option>
      </select>
      <button style={{padding:'8px 12px', background:'#111', color:'#fff', borderRadius:6}}>Buscar</button>
    </form>
    {rows.length===0 ? <div style={{padding:16, border:'1px solid #e5e7eb', borderRadius:8, background:'#fff'}}>Sin resultados.</div> :
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
      {rows.map(a=>(
        <Link key={a.id} href={`/abogado/${a.id}`} style={{display:'block', padding:16, border:'1px solid #e5e7eb', borderRadius:8, background:'#fff', textDecoration:'none', color:'#111'}}>
          <div style={{fontWeight:600}}>{a.fullName}</div>
          <div style={{fontSize:12, color:'#6b7280'}}>Colegiado: {a.barNumber ?? '—'}</div>
          <div style={{marginTop:6, fontSize:12}}>{a.status}</div>
        </Link>
      ))}
    </div>}
  </div>)
}