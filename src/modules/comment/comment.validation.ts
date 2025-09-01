import Joi from 'joi'

// Create comment
export const createCommentSchema = Joi.object({
  postId: Joi.string().required().messages({
    'string.empty': 'Post ID is required',
    'any.required': 'Post ID is required'
  }),
  content: Joi.string().min(1).max(1000).required().messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must not be empty',
    'any.required': 'Content is required'
  })
})

// Update comment
export const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required().messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must not be empty',
    'any.required': 'Content is required'
  })
})
