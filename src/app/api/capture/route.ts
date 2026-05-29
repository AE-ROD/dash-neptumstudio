import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clasificarCaptura } from '@/lib/groq'
import type { TipoCaptura } from '@/lib/groq'

export async function POST(req: Request) {
  try {
    const { texto, tipoForzado }: { texto: string; tipoForzado?: TipoCaptura } = await req.json()

    const tipo = tipoForzado ?? (await clasificarCaptura(texto))

    if (tipo === 'TAREA') {
      const pendiente = await prisma.pending.create({ data: { texto, fuente: 'panel' } })
      return NextResponse.json({ tipo, resultado: pendiente })
    }

    if (tipo === 'CLIENTE') {
      const propuesta = await prisma.proposal.create({
        data: { nombreCliente: texto, estado: 'LEAD' },
      })
      return NextResponse.json({ tipo, resultado: propuesta })
    }

    // IDEA o MEJORA
    const etiqueta = tipo === 'MEJORA' ? ('MEJORA' as const) : ('IDEA' as const)
    const idea = await prisma.idea.create({ data: { texto, etiqueta, fuente: 'panel' } })
    return NextResponse.json({ tipo, resultado: idea })
  } catch (error) {
    console.error('[api/capture] POST error:', error)
    return NextResponse.json({ error: 'Error al capturar' }, { status: 500 })
  }
}
