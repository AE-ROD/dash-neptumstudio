// TODO: Agregar autenticación NextAuth antes de producción
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const proyectos = await prisma.project.findMany({
      where: { estado: { not: 'ARCHIVADO' } },
      orderBy: { actualizadoEn: 'desc' },
    })
    return NextResponse.json(proyectos)
  } catch (error) {
    console.error('[api/projects GET]', error)
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, descripcion, stack, estado, progreso, repoUrl, rutaLocal, ultimaNota, proximoPaso } = body
    const proyecto = await prisma.project.create({
      data: { nombre, descripcion, stack, estado, progreso, repoUrl, rutaLocal, ultimaNota, proximoPaso },
    })
    return NextResponse.json(proyecto, { status: 201 })
  } catch (error) {
    console.error('[api/projects POST]', error)
    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 })
  }
}
