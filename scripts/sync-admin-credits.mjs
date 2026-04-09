import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'gunasekharpaidi@gmail.com'
  console.log(`🚀 Starting credit sync for ${adminEmail}...`)

  try {
    const user = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        credits: 500,
        totalCredits: 500,
        plan: 'PRO'
      }
    })

    console.log(`✅ Success! User ${adminEmail} updated.`)
    console.log(`📊 New Balance: ${user.credits}/${user.totalCredits} (${user.plan})`)
  } catch (error) {
    console.error(`❌ Error updating user:`, error.message)
    console.log(`💡 Note: If you haven't signed up yet, the webhook will handle it automatically when you do.`)
  } finally {
    await prisma.$disconnect()
  }
}

main()
