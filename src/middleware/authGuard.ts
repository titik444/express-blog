import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config' // sesuaikan path

interface JwtPayload {
  id: string
  role: string
}

export const authGuard = (roles: string[] = []) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw { status: 401, message: 'No token provided' }
      }

      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload

      ;(req as any).user = decoded

      console.log({ length: roles.length, decoded: decoded.role, roles: roles, match: roles.includes(decoded.role) })

      if (roles.length && !roles.includes(decoded.role)) {
        console.log('Forbidden: insufficient role')
        throw { status: 403, message: 'Forbidden: insufficient role' }
      }

      next()
    } catch (err: any) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        next({ status: 401, message: 'Invalid or expired token' })
      } else {
        next(err)
      }
    }
  }
}
