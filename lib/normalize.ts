export function normalizeStatus(materia:string){
  const m = (materia||'').toLowerCase()
  if(m.includes('reinstal') || m.includes('readmis')) return 'Reinstated'
  if(m.includes('censura')) return 'Censured'
  if(m.includes('suspensión inmediata') || m.includes('suspensi\u00f3n inmediata')) return 'Suspended'
  if(m.includes('suspensión') || m.includes('suspensi\u00f3n')) return 'Suspended'
  if(m.includes('revocación') || m.includes('revocaci\u00f3n')) return 'Revoked'
  if(m.includes('expulsi') || m.includes('disbar')) return 'Disbarred'
  return 'Other'
}