import { Router } from 'express'
import * as postController from './post.controller'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.get('/', postController.getPosts)
router.get('/:slug', postController.getPostBySlug)

router.post('/', authGuard(), postController.createPost)
router.patch('/:id', authGuard(), postController.updatePost)
router.delete('/:id', authGuard(), postController.deletePost)

export default router
