import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'] // opsional: logging query untuk debugging
})

// Handle disconnect gracefully
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
