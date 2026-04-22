import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'
import { httpResponse } from '../utils/httpResponse'

export function validateRequest(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const details = error.details.map((d) => d.message)
      httpResponse.error(res, 400, 'Dados inválidos', details)
      return
    }

    next()
  }
}
