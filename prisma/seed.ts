// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient } from '../src/app/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpiar datos existentes antes de sembrar
  await prisma.revenue.deleteMany()
  await prisma.instagramSnapshot.deleteMany()
  await prisma.pending.deleteMany()
  await prisma.note.deleteMany()
  await prisma.idea.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.client.deleteMany()
  await prisma.project.deleteMany()

  await prisma.project.createMany({
    data: [
      {
        nombre: 'Eli',
        descripcion: 'SaaS de reservas multi-tenant para negocios de salud.',
        stack: ['Next.js 16', 'Prisma', 'PostgreSQL', 'NextAuth.js', 'Tailwind'],
        estado: 'ACTIVO',
        progreso: 65,
        repoUrl: 'https://github.com/AE-ROD/Eli',
        rutaLocal: '/Users/alejandrorodriguez/Desktop/Eli',
        proximoPaso: 'Integración frontend ↔ backend',
        ultimaNota: 'El locking pesimista resolvió el race condition.',
      },
      {
        nombre: 'iPro',
        descripcion: 'Template odontológico SaaS con odontograma interactivo.',
        stack: ['React', 'Vite', 'Bootstrap'],
        estado: 'ACTIVO',
        progreso: 42,
        proximoPaso: 'Módulo de facturación',
      },
      {
        nombre: 'Klin · Anelis',
        descripcion: 'Agente WhatsApp con dashboard para clínica dental.',
        stack: ['Express.js', 'SQLite', 'Baileys', 'Groq'],
        estado: 'ACTIVO',
        progreso: 100,
        proximoPaso: 'Comando /stats semanal',
        ultimaNota: 'Latencia bajó de 4s a 1.8s tras mover el prompt a módulo.',
      },
      {
        nombre: 'M-Fit',
        descripcion: 'App de fitness en vanilla JS puro.',
        stack: ['Vanilla JS'],
        estado: 'PAUSADO',
        progreso: 30,
      },
    ],
  })

  await prisma.proposal.createMany({
    data: [
      { nombreCliente: 'Lucas M.', descripcion: 'Landing page', monto: 800, estado: 'PROPUESTA' },
      { nombreCliente: 'Clínica Norte', descripcion: 'Dashboard admin', monto: 2400, estado: 'LEAD' },
      { nombreCliente: 'Tienda Orgánica', descripcion: 'E-commerce', monto: 1800, estado: 'ACTIVO' },
    ],
  })

  await prisma.pending.createMany({
    data: [
      { texto: 'Enviar propuesta a Lucas M.' },
      { texto: 'Llamar a Clínica Norte' },
      { texto: 'Publicar en Instagram hoy' },
      { texto: 'Review PR Eli — locking', completado: true },
    ],
  })

  await prisma.instagramSnapshot.create({
    data: { seguidores: 847, publicaciones: 12, alcancePromedio: 340, crecimientoSemanal: 23 },
  })

  await prisma.revenue.create({
    data: { monto: 4200, descripcion: 'Mayo 2026', mes: 5, anio: 2026 },
  })

  console.log('✅ Seed completado')
}

main().catch(console.error).finally(() => prisma.$disconnect())
