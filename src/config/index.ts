import dotenv from 'dotenv'
import path from 'path'

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

/**
 * Config global project
 * Semua value env dikumpulkan di sini agar tidak diakses langsung dari process.env
 */
export const config = {
  app: {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000
  },

  db: {
    url: process.env.DATABASE_URL || ''
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'supersecret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '86400'
  },

  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
}
