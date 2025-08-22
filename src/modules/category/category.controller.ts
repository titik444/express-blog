import { Request, Response, NextFunction } from 'express'
import * as categoryService from './category.service'
import { ApiResponse } from '../../interfaces/apiResponse'
import { createCategorySchema, updateCategorySchema, queryCategoriesSchema } from './category.validation'

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = createCategorySchema.validate(req.body, { abortEarly: false })
    if (error) throw { status: 400, message: 'Validation error', errors: error.details.map((d) => d.message) }

    const { name } = req.body
    const category = await categoryService.createCategory(name)

    const response: ApiResponse = { success: true, message: 'Category created', data: category }
    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = queryCategoriesSchema.validate(req.query, { abortEarly: false })
    if (error) throw { status: 400, message: 'Validation error', errors: error.details.map((d) => d.message) }

    const { page, limit, search } = value
    const categories = await categoryService.getCategories(page, limit, search)

    const response: ApiResponse = { success: true, message: 'Categories fetched', data: categories }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const category = await categoryService.getCategoryBySlug(slug)
    if (!category) throw { status: 404, message: 'Category not found' }

    const response: ApiResponse = { success: true, message: 'Category fetched', data: category }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = updateCategorySchema.validate(req.body, { abortEarly: false })
    if (error) throw { status: 400, message: 'Validation error', errors: error.details.map((d) => d.message) }

    const { id } = req.params
    const { name } = req.body
    const category = await categoryService.updateCategory(id, { name })

    const response: ApiResponse = { success: true, message: 'Category updated', data: category }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await categoryService.deleteCategory(id)

    const response: ApiResponse = { success: true, message: 'Category deleted' }
    res.json(response)
  } catch (err) {
    next(err)
  }
}
