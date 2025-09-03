import { Request, Response, NextFunction } from 'express'
import * as commentService from './comment.service'
import { ApiResponse } from '../../interfaces/apiResponse'
import { createCommentSchema, updateCommentSchema } from './comment.validation'

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = createCommentSchema.validate(req.body, { abortEarly: false })
    if (error) {
      throw { status: 400, message: 'Validation error', errors: error.details.map((d) => d.message) }
    }

    const userId = (req as any).user.id
    const { postId, content } = req.body

    const comment = await commentService.createComment(userId, postId, content)

    const response: ApiResponse = { success: true, message: 'Comment created', data: comment }
    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

export const getComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id
    const { id } = req.params
    const comment = await commentService.getComment(id, userId)

    res.json({ success: true, message: 'Comment fetched', data: comment })
  } catch (err) {
    next(err)
  }
}

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = updateCommentSchema.validate(req.body, { abortEarly: false })
    if (error) {
      throw { status: 400, message: 'Validation error', errors: error.details.map((d) => d.message) }
    }

    const userId = (req as any).user.id
    const { id } = req.params
    const { content } = req.body

    const comment = await commentService.updateComment(id, userId, content)

    res.json({ success: true, message: 'Comment updated', data: comment })
  } catch (err) {
    next(err)
  }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    await commentService.deleteComment(id, userId)

    res.json({ success: true, message: 'Comment deleted' })
  } catch (err) {
    next(err)
  }
}

// Like a comment
export const likeComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params // commentId

    const result = await commentService.likeComment(id, userId)

    const response: ApiResponse = { success: true, message: result.message }
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

// Unlike a comment
export const unlikeComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params // commentId

    const result = await commentService.unlikeComment(id, userId)

    const response: ApiResponse = { success: true, message: result.message }
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
