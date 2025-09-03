import { Router } from 'express'
import * as categoryController from './category.controller'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.get('/', categoryController.getCategories)
router.get('/:slug', categoryController.getCategoryBySlug)

// Admin Only
router.post('/', authGuard({ roles: ['ADMIN'] }), categoryController.createCategory)
router.put('/:id', authGuard({ roles: ['ADMIN'] }), categoryController.updateCategory)
router.delete('/:id', authGuard({ roles: ['ADMIN'] }), categoryController.deleteCategory)

export default router
