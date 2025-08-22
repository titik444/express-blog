import Joi from 'joi'

export const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 3 characters',
    'any.required': 'Category name is required'
  }),
  description: Joi.string().max(255).optional()
})

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().max(255).optional()
})

export const queryCategoriesSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  search: Joi.string().optional()
})
