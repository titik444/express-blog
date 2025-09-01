// comment.spec.ts
import request from 'supertest'
import createServer from '../../../app'
import { prisma } from '../../../config/database'

const app = createServer()

describe('Comment Module', () => {
  let userToken: string
  let postId: string
  let commentId: string

  beforeAll(async () => {
    // Bersihkan data user, post, dan comment sebelumnya
    await prisma.comment.deleteMany({})
    await prisma.post.deleteMany({ where: { title: 'Post for Comment' } })
    await prisma.user.deleteMany({ where: { email: 'commentuser@test.com' } })

    // Buat user
    await request(app).post('/api/auth/register').send({
      name: 'Comment User',
      email: 'commentuser@test.com',
      password: 'password123'
    })

    // Login user
    const login = await request(app).post('/api/auth/login').send({
      email: 'commentuser@test.com',
      password: 'password123'
    })

    userToken = login.body.data.token

    // Buat post
    const postRes = await request(app).post('/api/post').set('Authorization', `Bearer ${userToken}`).send({
      title: 'Post for Comment',
      content: 'This post is for testing comments.',
      featuredImage: 'https://example.com/image.jpg'
    })

    postId = postRes.body.data.id
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/comment (Create)', () => {
    it('✅ should create a comment', async () => {
      const res = await request(app).post('/api/comment').set('Authorization', `Bearer ${userToken}`).send({
        postId,
        content: 'This is a test comment.'
      })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('id')
      commentId = res.body.data.id
    })

    it('❌ should fail with invalid input', async () => {
      const res = await request(app).post('/api/comment').set('Authorization', `Bearer ${userToken}`).send({
        postId: '',
        content: ''
      })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.errors).toContain('Post ID is required')
      expect(res.body.errors).toContain('Content is required')
    })
  })

  describe('GET /api/comment/:id', () => {
    it('✅ should get comment by id', async () => {
      const res = await request(app).get(`/api/comment/${commentId}`)
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('id', commentId)
    })

    it('❌ should return 404 for non-existent comment', async () => {
      const res = await request(app).get('/api/comment/non-existent-id')
      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe('PUT /api/comment/:id (Update)', () => {
    it('✅ should update comment', async () => {
      const res = await request(app)
        .put(`/api/comment/${commentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ content: 'Updated test comment.' })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.content).toBe('Updated test comment.')
    })

    it('❌ should fail with invalid input', async () => {
      const res = await request(app)
        .put(`/api/comment/${commentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ content: '' })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.errors).toContain('Content is required')
    })
  })

  describe('DELETE /api/comment/:id', () => {
    it('✅ should delete comment', async () => {
      const res = await request(app).delete(`/api/comment/${commentId}`).set('Authorization', `Bearer ${userToken}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })

    it('❌ should return 404 when deleting already deleted comment', async () => {
      const res = await request(app).delete(`/api/comment/${commentId}`).set('Authorization', `Bearer ${userToken}`)

      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })
})
