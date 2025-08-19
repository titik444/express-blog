import http from 'http'
import createServer from './app'
import { config } from './config'

const PORT = config.app.port || 5000

// Buat server HTTP dari express app
const app = createServer()

// Buat server HTTP
const server = http.createServer(app)

// Event listener untuk server error
server.on('error', (err: NodeJS.ErrnoException) => {
  console.error('Server error:', err.message)
  process.exit(1)
})

// Jalankan server
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
