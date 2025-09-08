// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Global o'zgaruvchi Prisma clientni saqlash uchun
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// Mavjud Prisma clientni olish yoki yangisini yaratish
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Development rejimida global Prisma clientni saqlash
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma