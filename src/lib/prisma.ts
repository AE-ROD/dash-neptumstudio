import { PrismaClient } from '@/app/generated/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
globalForPrisma.prisma = prisma
