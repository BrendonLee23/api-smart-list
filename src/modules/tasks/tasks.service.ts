import { AppError } from '../../utils/AppError'
import { tasksRepository } from './tasks.repository'
import { CreateTaskDTO, UpdateTaskDTO } from './tasks.types'

export const tasksService = {
  async findAll() {
    return tasksRepository.findAll()
  },

  async findById(id: string) {
    const task = await tasksRepository.findById(id)
    if (!task) {
      throw new AppError('Tarefa não encontrada', 404)
    }
    return task
  },

  async create(data: CreateTaskDTO) {
    return tasksRepository.create(data)
  },

  async update(id: string, data: UpdateTaskDTO) {
    const existing = await tasksRepository.findById(id)
    if (!existing) {
      throw new AppError('Tarefa não encontrada', 404)
    }
    return tasksRepository.update(id, data)
  },

  async delete(id: string) {
    const existing = await tasksRepository.findById(id)
    if (!existing) {
      throw new AppError('Tarefa não encontrada', 404)
    }
    await tasksRepository.delete(id)
  },
}
