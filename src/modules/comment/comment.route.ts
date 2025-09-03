import { Router } from 'express'
import * as commentController from './comment.controller'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.post('/', authGuard(), commentController.createComment)
router.get('/:id', authGuard({ optional: true }), commentController.getComment)
router.put('/:id', authGuard(), commentController.updateComment)
router.delete('/:id', authGuard(), commentController.deleteComment)

router.post('/:id/like', authGuard(), commentController.likeComment)
router.delete('/:id/unlike', authGuard(), commentController.unlikeComment)

export default router
