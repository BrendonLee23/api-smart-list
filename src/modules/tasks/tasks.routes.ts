import { Router } from 'express'
import { tasksController } from './tasks.controller'
import { validateRequest } from '../../middleware/validateRequest'
import { createTaskSchema, updateTaskSchema } from './tasks.schema'

export const tasksRouter = Router()

tasksRouter.get('/', tasksController.findAll)
tasksRouter.get('/:id', tasksController.findById)
tasksRouter.post('/', validateRequest(createTaskSchema), tasksController.create)
tasksRouter.put('/:id', validateRequest(updateTaskSchema), tasksController.update)
tasksRouter.delete('/:id', tasksController.delete)
