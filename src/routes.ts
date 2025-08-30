import { Router } from 'express'

import authRoutes from './modules/auth/auth.route'
import categoryRoutes from './modules/category/category.route'
import postRoutes from './modules/post/post.route'

const router = Router()

router.use('/auth', authRoutes)
router.use('/category', categoryRoutes)
router.use('/post', postRoutes)

export default router
