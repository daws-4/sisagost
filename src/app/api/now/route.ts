import {NextResponse} from 'next/server'

export async function GET() {
  const now = new Date().toLocaleString("es-ES");
  const title = `Contratos ${now}`;

  return NextResponse.json(now);
}
