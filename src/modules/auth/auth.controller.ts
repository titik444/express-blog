import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import { ApiResponse } from '../../interfaces/apiResponse'
import { registerSchema, loginSchema } from './auth.validation'

// Register user baru
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false })
    if (error) {
      throw {
        status: 400,
        message: 'Validation error',
        errors: error.details.map((d) => d.message)
      }
    }

    const { name, email, password } = req.body
    const user = await authService.register({ name, email, password })

    const response: ApiResponse = {
      success: true,
      message: 'User registered successfully',
      data: user
    }

    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false })
    if (error) {
      throw {
        status: 400,
        message: 'Validation error',
        errors: error.details.map((d) => d.message)
      }
    }

    const { email, password } = req.body
    const tokenData = await authService.login({ email, password })

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: tokenData
    }

    res.json(response)
  } catch (err) {
    next(err)
  }
}

// Get current user (me)
export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id // dari auth.middleware
    if (!userId) throw { status: 401, message: 'Unauthorized' }

    const user = await authService.getMe(userId)

    const response: ApiResponse = {
      success: true,
      message: 'Current user fetched',
      data: user
    }

    res.json(response)
  } catch (err) {
    next(err)
  }
}

// Refresh token
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw { status: 400, message: 'Refresh token required' }

    const tokenData = await authService.refreshToken(refreshToken)

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed',
      data: tokenData
    }

    res.json(response)
  } catch (err) {
    next(err)
  }
}
