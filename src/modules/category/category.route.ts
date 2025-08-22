import { Router } from 'express'
import * as categoryController from './category.controller'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.get('/', categoryController.getCategories)
router.get('/:slug', categoryController.getCategoryBySlug)

// Admin Only
router.post('/', authGuard(['ADMIN']), categoryController.createCategory)
router.put('/:id', authGuard(['ADMIN']), categoryController.updateCategory)
router.delete('/:id', authGuard(['ADMIN']), categoryController.deleteCategory)

export default router
