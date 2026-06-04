import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

function makePrisma() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter } as any)
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? makePrisma()
globalForPrisma.prisma = prisma
