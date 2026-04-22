import { prisma } from '../../prisma/client'
import { CreateTaskDTO, UpdateTaskDTO } from './tasks.types'

export const tasksRepository = {
  async findAll() {
    return prisma.task.findMany({ orderBy: { createdAt: 'desc' } })
  },

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id } })
  },

  async create(data: CreateTaskDTO) {
    return prisma.task.create({ data })
  },

  async update(id: string, data: UpdateTaskDTO) {
    return prisma.task.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.task.delete({ where: { id } })
  },
}
