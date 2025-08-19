import { config as dotenvConfig } from 'dotenv'
import path from 'path'

// gunakan file .env.test khusus
dotenvConfig({ path: path.resolve(process.cwd(), '.env.test') })
