import request from 'supertest'
import createServer from '../../../app'
import { prisma } from '../../../config/database'

const app = createServer()

describe('Auth - Register', () => {
  beforeAll(async () => {
    // bersihkan user dengan email test agar tidak bentrok
    await prisma.user.deleteMany({
      where: { email: { in: ['jane@test.com', 'duplicate@test.com'] } }
    })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('✅ should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@test.com',
      password: 'password123'
    })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data.email).toBe('jane@test.com')

    // cek password di database sudah di-hash
    const user = await prisma.user.findUnique({
      where: { email: 'jane@test.com' }
    })
    expect(user?.password).not.toBe('password123')
  })

  it('❌ should fail if email already exists', async () => {
    // insert dulu user
    await prisma.user.create({
      data: {
        name: 'Duplicate',
        email: 'duplicate@test.com',
        password: 'hashedpass',
        role: 'USER'
      }
    })

    const res = await request(app).post('/api/auth/register').send({
      name: 'Duplicate',
      email: 'duplicate@test.com',
      password: 'password123'
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
