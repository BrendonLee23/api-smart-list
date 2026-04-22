import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { httpResponse } from '../utils/httpResponse'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return httpResponse.error(res, err.statusCode, err.message)
  }

  console.error(err)
  return httpResponse.error(res, 500, 'Erro interno do servidor')
}
