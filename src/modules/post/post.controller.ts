import { Request, Response, NextFunction } from 'express'
import * as postService from './post.service'
import { ApiResponse } from '../../interfaces/apiResponse'
import { createPostSchema, updatePostSchema, queryPostsSchema } from './post.validation'

// Create post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = createPostSchema.validate(req.body, { abortEarly: false })
    if (error) {
      throw { status: 400, message: 'Validation error', errors: error.details.map((d) => d.message) }
    }

    const userId = (req as any).user.id
    const { title, content, featuredImage, categories } = req.body

    const post = await postService.createPost(userId, title, content, featuredImage, categories)

    const response: ApiResponse = { success: true, message: 'Post created', data: post }
    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

// Get all posts
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = queryPostsSchema.validate(req.query, { abortEarly: false })
    if (error) {
      throw { status: 400, message: 'Validation error', errors: error.details.map((d) => d.message) }
    }

    const { page, limit, search } = value
    const posts = await postService.getPosts(page, limit, search)

    const response: ApiResponse = { success: true, message: 'Posts fetched', data: posts }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

// Get post by slug
export const getPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const post = await postService.getPostBySlug(slug)
    if (!post) throw { status: 404, message: 'Post not found' }

    const response: ApiResponse = { success: true, message: 'Post fetched', data: post }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

// Update post
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = updatePostSchema.validate(req.body, { abortEarly: false })
    if (error) {
      throw { status: 400, message: 'Validation error', errors: error.details.map((d) => d.message) }
    }

    const userId = (req as any).user.id
    const { id } = req.params
    const { title, content, featuredImage, categories } = req.body

    const post = await postService.updatePost(id, userId, { title, content, featuredImage, categories })

    const response: ApiResponse = { success: true, message: 'Post updated', data: post }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

// Delete post
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    await postService.deletePost(id, userId)

    const response: ApiResponse = { success: true, message: 'Post deleted' }
    res.json(response)
  } catch (err) {
    next(err)
  }
}
