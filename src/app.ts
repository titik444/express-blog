import express, { Application } from 'express'
import cors from 'cors'

import routes from './routes'
import { errorHandler } from './middleware/errorHandler'

const createServer = () => {
  const app: Application = express()

  // Middleware deserialized token
  // app.use(deserializedToken)

  // parse body request (gunakan middleware bawaan express)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // cors access handler
  app.use(cors())
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
  })

  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Server is running'
    })
  })

  // Routes utama
  app.use('/api', routes)

  // Middleware API key, kecualikan /auth/generate-api-key
  // app.use(apiKeyAuth(['/images', '/health', '/generate-api-key']) as any)

  // Middleware untuk melayani file statis dari folder 'public'
  app.use(express.static('public'))

  // Error handler
  app.use(errorHandler)

  return app
}

export default createServer
