import Joi from 'joi'

// Validasi create post
export const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters',
    'any.required': 'Title is required'
  }),
  content: Joi.string().min(10).required().messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 10 characters',
    'any.required': 'Content is required'
  }),
  featuredImage: Joi.string().uri().optional().messages({
    'string.uri': 'Featured image must be a valid URL'
  }),
  categories: Joi.array().items(Joi.string()).optional().messages({
    'string.guid': 'Each category must be a valid ID'
  })
})

// Validasi update post
export const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  content: Joi.string().min(10).optional(),
  featuredImage: Joi.string().uri().optional(),
  categories: Joi.array().items(Joi.string()).optional()
}).min(1) // harus ada minimal satu field yang diupdate

// Validasi query list post (pagination, search)
export const queryPostsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('', null)
})
