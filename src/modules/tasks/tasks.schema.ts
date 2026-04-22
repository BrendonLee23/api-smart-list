import Joi from 'joi'

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional().allow(''),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'DONE').optional(),
})

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(1000).optional().allow(''),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'DONE').optional(),
}).min(1)
