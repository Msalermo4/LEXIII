export async function POST(req:Request){
  const { password } = await req.json()
  if(password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD){
    return new Response('ok', { status: 200 })
  }
  return new Response('nope', { status: 401 })
}