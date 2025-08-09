import './globals.css'
export const metadata = { title: 'LEXIII — Directorio disciplinario PR', description: 'Seguimiento en tiempo real de In re / acciones disciplinarias.' }
export default function RootLayout({ children }:{children: React.ReactNode}){
  return (<html lang="es"><body>
    <nav style={{borderBottom:'1px solid #e5e7eb', background:'#fff'}}>
      <div style={{maxWidth:960, margin:'0 auto', padding:'12px 16px', display:'flex', justifyContent:'space-between'}}>
        <a href="/" style={{fontWeight:700, textDecoration:'none', color:'#111'}}>LEXIII</a>
        <a href="/admin" style={{fontSize:12, color:'#111'}}>Admin</a>
      </div>
    </nav>
    <main style={{maxWidth:960, margin:'0 auto', padding:'16px'}}>{children}</main>
    <footer style={{maxWidth:960, margin:'0 auto', padding:'16px', fontSize:12, color:'#6b7280'}}>© 2025 LEXIII • No es asesoría legal.</footer>
  </body></html>)
}