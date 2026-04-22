import 'dotenv/config'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

export const env = {
  PORT,
  DATABASE_URL,
}
