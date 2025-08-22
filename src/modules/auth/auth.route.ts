import { Router } from 'express'
import * as authController from './auth.controller'
import { authGuard } from '../../middleware/authGuard'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', authGuard(), authController.me)
router.post('/refresh', authController.refresh)

export default router
