// tests/integration/auth.spec.ts
import request from 'supertest'
import createServer from '../../../app'
import { prisma } from '../../../config/database'

const app = createServer()

describe('Auth Module', () => {
  const registerEmail = 'jane@test.com'
  const duplicateEmail = 'duplicate@test.com'
  const meEmail = 'test-me@test.com'
  const refreshEmail = 'test-refresh@test.com'
  const password = 'password123'

  let accessToken: string
  let refreshToken: string

  beforeAll(async () => {
    // bersihkan semua user test
    await prisma.user.deleteMany({
      where: { email: { in: [registerEmail, duplicateEmail, meEmail, refreshEmail] } }
    })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  // ============================================================
  // REGISTER
  // ============================================================
  describe('POST /api/auth/register', () => {
    it('✅ should register a new user successfully', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Jane Doe',
        email: registerEmail,
        password
      })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('id')
      expect(res.body.data.email).toBe(registerEmail)

      const user = await prisma.user.findUnique({ where: { email: registerEmail } })
      expect(user?.password).not.toBe(password) // harus sudah di-hash
    })

    it('❌ should fail if email already exists', async () => {
      await prisma.user.create({
        data: {
          name: 'Duplicate',
          email: duplicateEmail,
          password: 'hashedpass',
          role: 'USER'
        }
      })

      const res = await request(app).post('/api/auth/register').send({
        name: 'Duplicate',
        email: duplicateEmail,
        password
      })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('❌ should fail with invalid input (missing fields)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: '',
        password: ''
      })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.errors).toEqual(
        expect.arrayContaining(['Name is required', 'Email is required', 'Password is required'])
      )
    })

    it('❌ should fail if password is too short', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Short Pass',
        email: 'shortpass@test.com',
        password: '123'
      })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.errors).toContain('Password must be at least 6 characters')
    })
  })

  // ============================================================
  // LOGIN
  // ============================================================
  describe('POST /api/auth/login', () => {
    it('✅ should login successfully and return tokens', async () => {
      // pastikan user ada
      await request(app).post('/api/auth/register').send({
        name: 'Login User',
        email: 'login@test.com',
        password
      })

      const res = await request(app).post('/api/auth/login').send({
        email: 'login@test.com',
        password
      })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('token')
      expect(res.body.data).toHaveProperty('refreshToken')
    })

    it('❌ should fail with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@test.com',
        password: 'wrongpass'
      })

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('❌ should fail with unregistered email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'notexist@test.com',
        password
      })

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
    })
  })

  // ============================================================
  // ME
  // ============================================================
  describe('GET /api/auth/me', () => {
    beforeAll(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Me User',
        email: meEmail,
        password
      })

      const loginRes = await request(app).post('/api/auth/login').send({
        email: meEmail,
        password
      })

      accessToken = loginRes.body.data.token
    })

    it('✅ should return current user with valid token', async () => {
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('id')
      expect(res.body.data.email).toBe(meEmail)
    })

    it('❌ should fail without token', async () => {
      const res = await request(app).get('/api/auth/me')
      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toMatch(/Unauthorized|No token/i)
    })
  })

  // ============================================================
  // REFRESH TOKEN
  // ============================================================
  describe('POST /api/auth/refresh', () => {
    beforeAll(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Refresh User',
        email: refreshEmail,
        password
      })

      const loginRes = await request(app).post('/api/auth/login').send({
        email: refreshEmail,
        password
      })

      refreshToken = loginRes.body.data.refreshToken
    })

    it('✅ should return new access token with valid refresh token', async () => {
      const res = await request(app).post('/api/auth/refresh').send({ refreshToken })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('token')
    })

    it('❌ should fail without refresh token', async () => {
      const res = await request(app).post('/api/auth/refresh').send({})
      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toMatch(/required/i)
    })

    it('❌ should fail with invalid refresh token', async () => {
      const res = await request(app).post('/api/auth/refresh').send({ refreshToken: 'invalid.token.value' })

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
    })
  })
})
