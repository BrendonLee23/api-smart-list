import { Request, Response, NextFunction } from 'express'
import { tasksService } from './tasks.service'
import { httpResponse } from '../../utils/httpResponse'

type ReqWithId = Request<{ id: string }>

export const tasksController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await tasksService.findAll()
      httpResponse.send(res, 200, tasks)
    } catch (err) {
      next(err)
    }
  },

  async findById(req: ReqWithId, res: Response, next: NextFunction) {
    try {
      const task = await tasksService.findById(req.params.id)
      httpResponse.send(res, 200, task)
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await tasksService.create(req.body)
      httpResponse.send(res, 201, task)
    } catch (err) {
      next(err)
    }
  },

  async update(req: ReqWithId, res: Response, next: NextFunction) {
    try {
      const task = await tasksService.update(req.params.id, req.body)
      httpResponse.send(res, 200, task)
    } catch (err) {
      next(err)
    }
  },

  async delete(req: ReqWithId, res: Response, next: NextFunction) {
    try {
      await tasksService.delete(req.params.id)
      httpResponse.send(res, 200, null)
    } catch (err) {
      next(err)
    }
  },
}
