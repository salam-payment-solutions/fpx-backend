import { $Enums, PrismaClient, Role } from '@prisma/client'
import fs from 'fs'

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

  // create B2C banks
  const banks = await prisma.bank.createMany({
    data: [
      {
        code: "ABB0234",
        name: "Affin Bank Berhad B2C - Test ID",
        displayName: "Affin B2C - Test ID",
        isB2C: true,

      },
      {
        code: "ABB0233",
        name: "Affin Bank Berhad",
        displayName: "Affin Bank",
        isB2C: true,
      },
      {
        code: "ABMB0212",
        name: "Alliance Bank Malaysia Berhad",
        displayName: "Alliance Bank (Personal)",
        isB2C: true,
      },
      {
        code: "AGRO01",
        name: "BANK PERTANIAN MALAYSIA BERHAD (AGROBANK)",
        displayName: "AGRONet",
        isB2C: true,
      },
      {
        code: "AMBB0209",
        name: "AmBank Malaysia Berhad",
        displayName: "AmBank",
        isB2C: true,
      },
      {
        code: "BIMB0340",
        name: "Bank Islam Malaysia Berhad",
        displayName: "Bank Islam",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "BMMB0341",
        name: "Bank Muamalat Malaysia Berhad",
        displayName: "Bank Muamalat",
        isB2C: true,
      },
      {
        code: "BKRM0602",
        name: "Bank Kerjasama Rakyat Malaysia Berhad",
        displayName: "Bank Rakyat",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "BOCM01",
        name: "Bank Of China (M) Berhad",
        displayName: "Bank Of China",
        isB2C: true,
      },
      {
        code: "BSN0601",
        name: "Bank Simpanan Nasional",
        displayName: "BSN",
        isB2C: true,
      },
      {
        code: "BCBB0235",
        name: "CIMB Bank Berhad",
        displayName: "CIMB Clicks",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "CIT0219",
        name: "CITI Bank Berhad",
        displayName: "Citibank",
        isB2C: true,
      },
      {
        code: "HLB0224",
        name: "Hong Leong Bank Berhad",
        displayName: "Hong Leong Bank",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "HSBC0223",
        name: "HSBC Bank Malaysia Berhad",
        displayName: "HSBC Bank",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "KFH0346",
        name: "Kuwait Finance House (Malaysia) Berhad",
        displayName: "KFH",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "MBB0228",
        name: "Malayan Banking Berhad (M2E)",
        displayName: "Maybank2E",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "MB2U0227",
        name: "Malayan Banking Berhad (M2U)",
        displayName: "Maybank2U",
        isB2C: true,
      },
      {
        code: "OCBC0229",
        name: "OCBC Bank Malaysia Berhad",
        displayName: "OCBC Bank",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "PBB0233",
        name: "Public Bank Berhad",
        displayName: "Public Bank",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "RHB0218",
        name: "RHB Bank Berhad",
        displayName: "RHB Bank",
        isB2B: true,
        isB2C: true,
      },
      {
        code: "TESTO021",
        name: "SBI Bank A",
        displayName: "SBI Bank A",
        isB2B: true,
        isB2C: true,
        status: $Enums.DefaultStatus.ACTIVE,
      },
      {
        code: "TEST0022",
        name: "SBI Bank B",
        displayName: "SBI Bank B",
        isB2B: true,
        isB2C: true,
        status: $Enums.DefaultStatus.ACTIVE,
      },
      {
        code: "TESTO023",
        name: "SBI Bank C",
        displayName: "SBI Bank C",
        isB2B: true,
        isB2C: true,
        status: $Enums.DefaultStatus.ACTIVE,
      },
      {
        code: "SCB0216",
        name: "Standard Chartered Bank",
        displayName: "Standard Chartered",
        isB2C: true,
      },
      {
        code: "UOB0226",
        name: "United Overseas Bank",
        displayName: "UOB Bank",
        isB2C: true,
      },
      {
        code: "UOBO229",
        name: "United Overseas Bank - B2C Test",
        displayName: "UOB Bank - Test ID",
        isB2C: true,
      }
    ]
  })

  // create B2B banks
  const b2bBanks = await prisma.bank.createMany({
    data: [
      { code: "ABB0232", name: "Affin Bank Berhad", displayName: "Affin Bank", isB2B: true },
      { code: "ABB0235", name: "Affin Bank Berhad B2B", displayName: "AFFINMAX", isB2B: true },
      { code: "ABMB0213", name: "Alliance Bank Malaysia Berhad", displayName: "Alliance Bank (Business)", isB2B: true },
      { code: "AGRO02", name: "BANK PERTANIAN MALAYSIA BERHAD (AGROBANK)", displayName: "AGRONetBIZ", isB2B: true },
      { code: "AMBB0208", name: "AmBank Malaysia Berhad", displayName: "AmBank", isB2B: true },
      { code: "BMMB0342", name: "Bank Muamalat Malaysia Berhad", displayName: "Bank Muamalat", isB2B: true },
      { code: "BNP003", name: "BNP Paribas Malaysia Berhad", displayName: "BNP Paribas", isB2B: true },
      { code: "CITO218", name: "CITI Bank Berhad", displayName: "Citibank Corporate Banking", isB2B: true },
      { code: "DBB0199", name: "Deutsche Bank Berhad", displayName: "Deutsche Bank", isB2B: true },
      { code: "PBB0234", name: "Public Bank Enterprise", displayName: "Public Bank PB enterprise", isB2B: true },
      { code: "SCB0215", name: "Standard Chartered Bank", displayName: "Standard Chartered", isB2B: true },
      { code: "UOB0228", name: "United Overseas Bank B2B Regional", displayName: "UOB Regional", isB2B: true }
    ]
  })

  // seed seller exchange Id
  const fpxSellerExchange = await prisma.fpxSellerExchange.create({
    data: {
      name: "Affin Bank",
      sellerId: process.env.FPX_SELLER_ID,
      exchangeId: process.env.FPX_EXCHANGE_ID,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user:', adminUser)
  console.log('👤 Regular user:', regularUser)
  console.log('🏦 Banks:', banks)
  console.log('🏦 B2B Banks:', b2bBanks)
  console.log('💳 FPX Seller Exchange:', fpxSellerExchange)
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
