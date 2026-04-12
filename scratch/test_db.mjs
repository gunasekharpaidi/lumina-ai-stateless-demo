import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Testing DB connection...')
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    console.log('DB Connection successful!')
  } catch (err) {
    console.error('DB Connection FAIL:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
