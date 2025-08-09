'use client'
import { useState } from 'react'

export default function Admin(){
  const [ok,setOk]=useState(false)
  const [msg,setMsg]=useState('')
  const [ins,setIns]=useState(0)

  async function login(e:any){
    e.preventDefault()
    const pwd = (e.target.password.value||'').trim()
    const r = await fetch('/api/admin/login', { method:'POST', body: JSON.stringify({ password: pwd }) })
    setOk(r.ok)
    if(!r.ok) setMsg('Clave incorrecta')
  }

  async function uploadCSV(e:any){
    e.preventDefault()
    const file = e.target.csv.files[0]
    if(!file) return
    const text = await file.text()
    const r = await fetch('/api/import', { method:'POST', headers:{ 'Content-Type':'text/plain' }, body: text })
    const data = await r.json()
    setIns(data.inserted||0)
  }

  return (<div>
    <h1 style={{fontSize:24, fontWeight:700, marginBottom:12}}>Admin</h1>
    {!ok ? <form onSubmit={login} style={{display:'flex', gap:8}}>
      <input name="password" type="password" placeholder="Contraseña admin" style={{padding:'8px 12px', border:'1px solid #d1d5db', borderRadius:6}} />
      <button style={{padding:'8px 12px', background:'#111', color:'#fff', borderRadius:6}}>Entrar</button>
      {msg && <div style={{fontSize:12, color:'#b91c1c'}}>{msg}</div>}
    </form> :
    <form onSubmit={uploadCSV} style={{display:'grid', gap:8}}>
      <input name="csv" type="file" accept=".csv,text/csv" />
      <button style={{padding:'8px 12px', background:'#111', color:'#fff', borderRadius:6}}>Subir CSV</button>
      {ins>0 && <div style={{fontSize:12}}>Insertados: {ins}</div>}
      <div style={{fontSize:12, color:'#6b7280'}}>Formato: full_name,bar_number,status,status_effective_date,action_type,decision_date,citation,summary,source_url,pdf_url</div>
    </form>}
  </div>)
}