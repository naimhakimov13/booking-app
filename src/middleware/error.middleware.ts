import { Request, Response, NextFunction } from 'express'
import { HttpStatus } from '../types/http-status.enum'

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR
  res.status(status).json({
    error: 'Internal Server Error',
    message: err?.message
  })
}

export default errorHandler
