import { DefaultStatus, PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      role: Role.ADMIN,
    },
  })

  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      role: Role.USER,
    },
  })

  // create banks
  const banks = await prisma.bank.createMany({
    data: [
      { "id": 1, "code": "ABB0234", "name": "Affin B2C - Test ID" },
      { "id": 2, "code": "ABB0233", "name": "Affin Bank" },
      { "id": 3, "code": "ABMB0212", "name": "Alliance Bank (Personal)" },
      { "id": 4, "code": "AGRO01", "name": "AGRONet" },
      { "id": 5, "code": "AMBB0209", "name": "AmBank" },
      { "id": 6, "code": "BIMB0340", "name": "Bank Islam" },
      { "id": 7, "code": "BMMB0341", "name": "Bank Muamalat" },
      { "id": 8, "code": "BKRM0602", "name": "Bank Rakyat" },
      { "id": 9, "code": "BOCM01", "name": "Bank Of China" },
      { "id": 10, "code": "BSN0601", "name": "BSN" },
      { "id": 11, "code": "BCBB0235", "name": "CIMB Clicks" },
      { "id": 12, "code": "CITO219", "name": "Citibank" },
      { "id": 13, "code": "HLB0224", "name": "Hong Leong Bank" },
      { "id": 14, "code": "HSBC0223", "name": "HSBC Bank" },
      { "id": 15, "code": "KFH0346", "name": "KFH" },
      { "id": 16, "code": "MBB0228", "name": "Maybank2E" },
      { "id": 17, "code": "MB2U0227", "name": "Maybank2U" },
      { "id": 18, "code": "OCBС0229", "name": "OCBC Bank" },
      { "id": 19, "code": "PBB0233", "name": "Public Bank" },
      { "id": 20, "code": "RHB0218", "name": "RHB Bank" },
      { "id": 21, "code": "TESTO021", "name": "SBI Bank A" },
      { "id": 22, "code": "TESTO022", "name": "SBI Bank B" },
      { "id": 23, "code": "TESTO023", "name": "SBI Bank C" },
      { "id": 24, "code": "SCB0216", "name": "Standard Chartered" },
      { "id": 25, "code": "UOB0226", "name": "UOB Bank" },
      { "id": 26, "code": "UOB0229", "name": "UOB Bank - Test ID" }
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user:', adminUser)
  console.log('👤 Regular user:', regularUser)
  console.log('🏦 Banks:', banks)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
