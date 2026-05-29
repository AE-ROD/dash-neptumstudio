import { NextResponse } from 'next/server'
import { clasificarCaptura } from '@/lib/groq'

export async function POST(req: Request) {
  try {
    const { texto }: { texto: string } = await req.json()
    if (!texto || texto.trim().length < 4) {
      return NextResponse.json({ tipo: null })
    }
    const tipo = await clasificarCaptura(texto)
    return NextResponse.json({ tipo })
  } catch {
    return NextResponse.json({ tipo: null })
  }
}
