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
    isLiked: false,
    likeCount: comment.likeCount,
    createdAt: comment.createdAt,
    author: comment.author
  }
}

/**
 * Get comment by ID
 */
export const getComment = async (id: string, userId?: string) => {
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

  let isLiked = false

  if (userId) {
    const like = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId: comment.id } }
    })
    isLiked = !!like
  }

  return {
    id: comment.id,
    content: comment.content,
    isLiked,
    likeCount: comment.likeCount,
    createdAt: comment.createdAt,
    author: comment.author
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

  const liked = await prisma.commentLike.findUnique({
    where: { userId_commentId: { userId, commentId: updatedComment.id } }
  })

  return {
    id: updatedComment.id,
    content: updatedComment.content,
    isLiked: !!liked,
    likeCount: updatedComment.likeCount,
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

// Like a comment
export const likeComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) throw { status: 404, message: 'Comment not found' }

  const alreadyLiked = await prisma.commentLike.findUnique({
    where: { userId_commentId: { userId, commentId } }
  })

  if (alreadyLiked) {
    throw { status: 400, message: 'You already liked this comment' }
  }

  await prisma.$transaction([
    prisma.commentLike.create({
      data: { commentId, userId }
    }),
    prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } }
    })
  ])

  return { message: 'Comment liked' }
}

// Unlike a comment
export const unlikeComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) throw { status: 404, message: 'Comment not found' }

  const like = await prisma.commentLike.findUnique({
    where: { userId_commentId: { userId, commentId } }
  })

  if (!like) {
    throw { status: 400, message: 'You have not liked this comment' }
  }

  await prisma.$transaction([
    prisma.commentLike.delete({
      where: { userId_commentId: { userId, commentId } }
    }),
    prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { decrement: 1 } }
    })
  ])

  return { message: 'Comment unliked' }
}
