import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Next.js usa .env.local — dotenv/config solo lee .env, así que lo cargamos manualmente
config({ path: '.env.local' })
config({ path: '.env' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
