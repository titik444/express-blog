import { Router } from 'express'
import * as postController from './post.controller'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.get('/', authGuard({ optional: true }), postController.getPosts)
router.get('/:slug', authGuard({ optional: true }), postController.getPostBySlug)

router.post('/', authGuard(), postController.createPost)
router.patch('/:id', authGuard(), postController.updatePost)
router.delete('/:id', authGuard(), postController.deletePost)

router.post('/:id/like', authGuard(), postController.likePost)
router.delete('/:id/unlike', authGuard(), postController.unlikePost)

export default router
