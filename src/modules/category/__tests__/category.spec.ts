import request from 'supertest'
import createServer from '../../../app'
import { prisma } from '../../../config/database'

const app = createServer()

describe('Category Module', () => {
  let adminToken: string
  let userToken: string
  let categoryId: string
  let categorySlug: string

  beforeAll(async () => {
    // bersihkan kategori test
    await prisma.category.deleteMany({
      where: { name: { in: ['Test Category', 'Updated Category'] } }
    })

    // pastikan admin & user ada
    await prisma.user.deleteMany({ where: { email: { in: ['catadmin@test.com', 'catuser@test.com'] } } })

    await request(app).post('/api/auth/register').send({
      name: 'Cat Admin',
      email: 'catadmin@test.com',
      password: 'password123'
    })

    await prisma.user.update({
      where: { email: 'catadmin@test.com' },
      data: { role: 'ADMIN' }
    })

    await request(app).post('/api/auth/register').send({
      name: 'Cat User',
      email: 'catuser@test.com',
      password: 'password123'
    })

    // login admin
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'catadmin@test.com',
      password: 'password123'
    })
    adminToken = adminLogin.body.data.token

    // login user biasa
    const userLogin = await request(app).post('/api/auth/login').send({
      email: 'catuser@test.com',
      password: 'password123'
    })
    userToken = userLogin.body.data.token
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/category (Create)', () => {
    it('✅ should create category with ADMIN role', async () => {
      const res = await request(app)
        .post('/api/category')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test Category' })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('id')
      expect(res.body.data).toHaveProperty('slug')
      categoryId = res.body.data.id
      categorySlug = res.body.data.slug
    })

    it('❌ should fail to create category if not ADMIN', async () => {
      const res = await request(app)
        .post('/api/category')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Should Fail' })

      expect(res.status).toBe(403)
      expect(res.body.success).toBe(false)
    })

    it('❌ should fail with invalid input', async () => {
      const res = await request(app).post('/api/category').set('Authorization', `Bearer ${adminToken}`).send({})

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.errors).toContain('Category name is required')
    })
  })

  describe('GET /api/category (List)', () => {
    it('✅ should get all categories', async () => {
      const res = await request(app).get('/api/category')
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data.items)).toBe(true)
    })

    it('✅ should search categories with query', async () => {
      const res = await request(app).get('/api/category?search=Test')
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })

  describe('GET /api/category/:slug', () => {
    it('✅ should get category by slug', async () => {
      const res = await request(app).get(`/api/category/${categorySlug}`)
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.slug).toBe(categorySlug)
    })

    it('❌ should return 404 for non-existent slug', async () => {
      const res = await request(app).get('/api/category/not-found-slug')
      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe('PUT /api/category/:id (Update)', () => {
    it('✅ should update category with ADMIN role', async () => {
      const res = await request(app)
        .put(`/api/category/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Category' })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.name).toBe('Updated Category')
    })

    it('❌ should fail update if not ADMIN', async () => {
      const res = await request(app)
        .put(`/api/category/${categoryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Should Not Update' })

      expect(res.status).toBe(403)
      expect(res.body.success).toBe(false)
    })
  })

  describe('DELETE /api/category/:id', () => {
    it('✅ should delete category with ADMIN role', async () => {
      const res = await request(app).delete(`/api/category/${categoryId}`).set('Authorization', `Bearer ${adminToken}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toMatch(/deleted/i)
    })

    it('❌ should fail delete if not ADMIN', async () => {
      const res = await request(app).delete(`/api/category/${categoryId}`).set('Authorization', `Bearer ${userToken}`)

      expect(res.status).toBe(403)
      expect(res.body.success).toBe(false)
    })
  })
})
