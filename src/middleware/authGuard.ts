import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config' // sesuaikan path

interface JwtPayload {
  id: string
  role: string
}

interface AuthOptions {
  roles?: string[]
  optional?: boolean
}

export const authGuard = (options: AuthOptions = {}) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (options.optional) return next()
        throw { status: 401, message: 'No token provided' }
      }

      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload

      ;(req as any).user = decoded

      const { roles = [] } = options
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        throw { status: 403, message: 'Forbidden: insufficient role' }
      }

      next()
    } catch (err: any) {
      if (options.optional) return next() // token bisa invalid kalau optional
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        next({ status: 401, message: 'Invalid or expired token' })
      } else {
        next(err)
      }
    }
  }
}
