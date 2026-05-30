// TODO: Agregar autenticación NextAuth antes de producción
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clasificarCaptura } from '@/lib/groq'
import type { TipoCaptura } from '@/lib/groq'

// Mapeo tipo captura → etiqueta Idea (todo pasa por el widget Capturado)
const TIPO_A_ETIQUETA = {
  IDEA:    'IDEA',
  MEJORA:  'MEJORA',
  TAREA:   'TAREA',
  CLIENTE: 'OPORTUNIDAD',
} as const

export async function POST(req: Request) {
  try {
    const { texto, tipoForzado }: { texto: string; tipoForzado?: TipoCaptura } = await req.json()

    if (!texto || typeof texto !== 'string') {
      return NextResponse.json({ error: 'texto es requerido' }, { status: 400 })
    }

    const tipo = tipoForzado ?? (await clasificarCaptura(texto))
    const etiqueta = TIPO_A_ETIQUETA[tipo] ?? 'IDEA'

    // Siempre se guarda en Ideas → aparece en "Capturado"
    const idea = await prisma.idea.create({ data: { texto, etiqueta, fuente: 'panel' } })

    // Además, rutar al modelo correspondiente según tipo
    if (tipo === 'TAREA') {
      await prisma.pending.create({ data: { texto, fuente: 'panel' } })
    }

    if (tipo === 'CLIENTE') {
      await prisma.proposal.create({ data: { nombreCliente: texto, estado: 'LEAD' } })
    }

    return NextResponse.json({ tipo, resultado: idea })
  } catch (error) {
    console.error('[api/capture] POST error:', error)
    return NextResponse.json({ error: 'Error al capturar' }, { status: 500 })
  }
}
