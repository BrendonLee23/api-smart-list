import { Response } from 'express'

export const httpResponse = {
  send<T>(res: Response, statusCode: number, data: T) {
    return res.status(statusCode).json({
      status: statusCode,
      success: true,
      data,
    })
  },

  error(res: Response, statusCode: number, message: string, details?: string[]) {
    return res.status(statusCode).json({
      status: statusCode,
      success: false,
      error: message,
      ...(details && { details }),
    })
  },
}
