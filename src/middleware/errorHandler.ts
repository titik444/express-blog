import { Request, Response } from 'express'

export const errorHandler = (err: any, req: Request, res: Response) => {
  console.error('Error:', err)

  const statusCode = err.status || 500
  const message = err.message || 'Internal Server Error'

  const errors = err.errors || (Array.isArray(err.details) ? err.details.map((d: any) => d.message) : undefined)

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  })
}
