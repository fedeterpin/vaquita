import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const passwordHash = await bcrypt.hash('password', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@vaquita.local' },
    update: {},
    create: { name: 'Demo User', email: 'demo@vaquita.local', passwordHash }
  })

  console.log('Seeded user', user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
