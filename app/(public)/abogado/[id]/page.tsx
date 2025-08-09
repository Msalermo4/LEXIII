import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const atty = await prisma.attorney.findUnique({
    where: { id },
    include: { actions: { orderBy: { actionDate: 'desc' } } }
  })
  if (!atty) return <div>No encontrado.</div>
  return (
    <div>
      <a href="/" style={{ fontSize: 12, color: '#6b7280' }}>← Volver</a>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{atty.fullName}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginTop: 8 }}>
        <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
          <div><b>Colegiado #:</b> {atty.barNumber ?? '—'}</div>
          <div><b>Jurisdicción:</b> {atty.jurisdiction}</div>
          <div><b>Estatus actual:</b> {atty.status}</div>
          {atty.statusEffectiveDate ? (
            <div><b>Vigente desde:</b> {new Date(atty.statusEffectiveDate).toLocaleDateString('es-PR')}</div>
          ) : null}
        </div>
        <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Línea de tiempo disciplinaria</h2>
          {atty.actions.length === 0 ? (
            <div style={{ fontSize: 14, color: '#6b7280' }}>Sin acciones registradas.</div>
          ) : (
            <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
              {atty.actions.map(ac => (
                <li key={ac.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    {ac.actionDate ? new Date(ac.actionDate).toLocaleDateString('es-PR') : '—'} • <b>{ac.actionType}</b>
                  </div>
                  {ac.citation ? <div style={{ fontSize: 13 }}>{ac.citation}</div> : null}
                  {ac.summary ? <div style={{ fontSize: 13 }}>{ac.summary}</div> : null}
                  <div style={{ fontSize: 12, display: 'flex', gap: 8 }}>
                    {ac.sourceUrl ? <a href={ac.sourceUrl} target="_blank" style={{ color: '#111' }}>Fuente</a> : null}
                    {ac.pdfUrl ? <a href={ac.pdfUrl} target="_blank" style={{ color: '#111' }}>PDF</a> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
