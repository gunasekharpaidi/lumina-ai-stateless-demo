import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🔒 Starting Database RLS Lockdown...')

  try {
    const sqlPath = path.join(process.cwd(), 'scripts', 'secure-db-rls.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')

    // Split SQL by semicolons, filtering out comments and empty lines
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`)
      await prisma.$executeRawUnsafe(statement)
    }

    console.log('✅ Row-Level Security Policies applied successfully!')
  } catch (error) {
    console.error('❌ Error applying RLS policies:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
