// prisma/seed.ts
// Carga .env.local explícitamente (dotenv/config solo lee .env por defecto)
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { PrismaClient } from '../src/app/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Limpiando todas las tablas…')

  await prisma.cotizacion.deleteMany()
  await prisma.revenue.deleteMany()
  await prisma.instagramSnapshot.deleteMany()
  await prisma.pending.deleteMany()
  await prisma.note.deleteMany()
  await prisma.idea.deleteMany()
  await prisma.evento.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.client.deleteMany()
  await prisma.project.deleteMany()

  console.log('✅ Tablas vaciadas')

  // Instagram real: 3 seguidores, cuenta nueva, sin actividad aún
  await prisma.instagramSnapshot.create({
    data: { seguidores: 3, publicaciones: 0, alcancePromedio: 0, crecimientoSemanal: 0 },
  })
  console.log('📸 Instagram: 3 seguidores')

  console.log('🎉 Seed completado — base de datos limpia, Instagram con datos reales')
}

main().catch(console.error).finally(() => prisma.$disconnect())
