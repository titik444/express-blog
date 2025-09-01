// comment.service.ts
import { prisma } from '../../config/database'

/**
 * Create a comment on a post
 */
export const createComment = async (userId: string, postId: string, content: string) => {
  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId
    },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true }
      }
    }
  })

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author: comment.author
  }
}

/**
 * Get comment by ID
 */
export const getComment = async (id: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true }
      }
    }
  })

  if (!comment) {
    throw { status: 404, message: 'Comment not found' }
  }

  return {
    id: comment?.id,
    content: comment?.content,
    createdAt: comment?.createdAt,
    author: comment?.author
  }
}

/**
 * Update a comment by its author
 */
export const updateComment = async (id: string, userId: string, content: string) => {
  const existingComment = await prisma.comment.findUnique({ where: { id } })
  if (!existingComment) {
    throw { status: 404, message: 'Comment not found' }
  }

  if (existingComment.authorId !== userId) {
    throw { status: 403, message: 'Not allowed to update this comment' }
  }

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: { content },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true }
      }
    }
  })

  return {
    id: updatedComment.id,
    content: updatedComment.content,
    createdAt: updatedComment.createdAt,
    author: updatedComment.author
  }
}

/**
 * Delete a comment by its author
 */
export const deleteComment = async (id: string, userId: string) => {
  const existingComment = await prisma.comment.findUnique({ where: { id } })
  if (!existingComment) {
    throw { status: 404, message: 'Comment not found' }
  }

  if (existingComment.authorId !== userId) {
    throw { status: 403, message: 'Not allowed to delete this comment' }
  }

  await prisma.comment.delete({ where: { id } })

  return { message: 'Comment deleted successfully' }
}
