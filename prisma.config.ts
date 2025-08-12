import { defineConfig } from 'prisma/config'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export default defineConfig({
  schema: path.join('prisma'),
})

// export default {
//   earlyAccess: true,
//   schema: path.join('prisma'),
// } satisfies PrismaConfig<Env>

