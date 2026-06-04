// TODO: Agregar autenticación NextAuth antes de producción
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/app/generated/client'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { nombre, descripcion, stack, estado, progreso, repoUrl, rutaLocal, ultimaNota, proximoPaso } = body
    const proyecto = await prisma.project.update({
      where: { id },
      data: { nombre, descripcion, stack, estado, progreso, repoUrl, rutaLocal, ultimaNota, proximoPaso },
    })
    return NextResponse.json(proyecto)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    console.error('[api/projects PATCH]', error)
    return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 })
  }
}
