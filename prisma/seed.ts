// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient } from '../src/app/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpiar todo
  await prisma.cotizacion.deleteMany()
  await prisma.revenue.deleteMany()
  await prisma.instagramSnapshot.deleteMany()
  await prisma.pending.deleteMany()
  await prisma.note.deleteMany()
  await prisma.idea.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.client.deleteMany()
  await prisma.project.deleteMany()

  // Instagram real: 3 seguidores, cuenta nueva
  await prisma.instagramSnapshot.create({
    data: { seguidores: 3, publicaciones: 0, alcancePromedio: 0, crecimientoSemanal: 0 },
  })

  // Ingresos en 0 para mayo 2026
  await prisma.revenue.create({
    data: { monto: 0, descripcion: 'Mayo 2026', mes: 5, anio: 2026 },
  })

  console.log('✅ Seed completado — datos reales, todo en cero excepto Instagram (3 seguidores)')
}

main().catch(console.error).finally(() => prisma.$disconnect())
