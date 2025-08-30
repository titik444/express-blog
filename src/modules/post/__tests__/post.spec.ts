import request from 'supertest'
import createServer from '../../../app'
import { prisma } from '../../../config/database'

const app = createServer()

describe('Post Module', () => {
  let userToken: string
  let postId: string
  let postSlug: string

  beforeAll(async () => {
    await prisma.post.deleteMany({ where: { title: { in: ['Test Post', 'Updated Post'] } } })
    await prisma.user.deleteMany({ where: { email: { in: ['postuser@test.com'] } } })

    await request(app).post('/api/auth/register').send({
      name: 'Post User',
      email: 'postuser@test.com',
      password: 'password123'
    })

    const login = await request(app).post('/api/auth/login').send({
      email: 'postuser@test.com',
      password: 'password123'
    })

    userToken = login.body.data.token
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/post (Create)', () => {
    it('✅ should create a post', async () => {
      const res = await request(app).post('/api/post').set('Authorization', `Bearer ${userToken}`).send({
        title: 'Test Post',
        content: 'This is the content of the test post.',
        featuredImage: 'https://example.com/image.jpg'
      })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('id')
      expect(res.body.data).toHaveProperty('slug')
      postId = res.body.data.id
      postSlug = res.body.data.slug
    })

    it('❌ should fail with invalid input', async () => {
      const res = await request(app)
        .post('/api/post')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: '', content: '' })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.errors).toContain('Title is required')
      expect(res.body.errors).toContain('Content is required')
    })

    it('❌ should fail to create post with duplicate title', async () => {
      const res = await request(app).post('/api/post').set('Authorization', `Bearer ${userToken}`).send({
        title: 'Test Post',
        content: 'Duplicate content'
      })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toMatch(/already exists/i)
    })
  })

  describe('GET /api/post (List)', () => {
    it('✅ should list posts', async () => {
      const res = await request(app).get('/api/post')
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data.items)).toBe(true)
    })

    it('✅ should search posts', async () => {
      const res = await request(app).get('/api/post?search=Test')
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })

  describe('GET /api/post/:slug', () => {
    it('✅ should get post by slug', async () => {
      const res = await request(app).get(`/api/post/${postSlug}`)
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.slug).toBe(postSlug)
    })

    it('❌ should return 404 for non-existent post', async () => {
      const res = await request(app).get('/api/post/non-existent-slug')
      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe('PUT /api/post/:id (Update)', () => {
    it('✅ should update post', async () => {
      const res = await request(app).put(`/api/post/${postId}`).set('Authorization', `Bearer ${userToken}`).send({
        title: 'Updated Post',
        content: 'Updated content of the post.'
      })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.title).toBe('Updated Post')
    })

    it('❌ should fail update with invalid data', async () => {
      const res = await request(app)
        .put(`/api/post/${postId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: '' })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })
  })

  describe('DELETE /api/post/:id', () => {
    it('✅ should delete post', async () => {
      const res = await request(app).delete(`/api/post/${postId}`).set('Authorization', `Bearer ${userToken}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })

    it('❌ should return 404 when deleting already deleted post', async () => {
      const res = await request(app).delete(`/api/post/${postId}`).set('Authorization', `Bearer ${userToken}`)

      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })
})
