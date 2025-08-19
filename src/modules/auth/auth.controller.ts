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
