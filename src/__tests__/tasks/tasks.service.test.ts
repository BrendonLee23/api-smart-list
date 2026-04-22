import { tasksService } from '../../modules/tasks/tasks.service'
import { tasksRepository } from '../../modules/tasks/tasks.repository'

jest.mock('../../modules/tasks/tasks.repository')

const mockRepo = tasksRepository as jest.Mocked<typeof tasksRepository>

const mockTask = {
  id: 'uuid-1',
  title: 'Tarefa teste',
  description: 'Descrição',
  status: 'PENDING' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('tasksService', () => {
  describe('findAll', () => {
    it('should return all tasks', async () => {
      mockRepo.findAll.mockResolvedValue([mockTask])

      const result = await tasksService.findAll()

      expect(result).toEqual([mockTask])
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('findById', () => {
    it('should return a task when found', async () => {
      mockRepo.findById.mockResolvedValue(mockTask)

      const result = await tasksService.findById('uuid-1')

      expect(result).toEqual(mockTask)
      expect(mockRepo.findById).toHaveBeenCalledWith('uuid-1')
    })

    it('should throw AppError with 404 when task not found', async () => {
      mockRepo.findById.mockResolvedValue(null)

      await expect(tasksService.findById('nao-existe')).rejects.toMatchObject({
        message: 'Tarefa não encontrada',
        statusCode: 404,
      })
    })
  })

  describe('create', () => {
    it('should create and return a task', async () => {
      mockRepo.create.mockResolvedValue(mockTask)

      const result = await tasksService.create({ title: 'Tarefa teste', description: 'Descrição' })

      expect(result).toEqual(mockTask)
      expect(mockRepo.create).toHaveBeenCalledWith({
        title: 'Tarefa teste',
        description: 'Descrição',
      })
    })
  })

  describe('update', () => {
    it('should update and return the task', async () => {
      const updated = { ...mockTask, title: 'Atualizada' }
      mockRepo.findById.mockResolvedValue(mockTask)
      mockRepo.update.mockResolvedValue(updated)

      const result = await tasksService.update('uuid-1', { title: 'Atualizada' })

      expect(result.title).toBe('Atualizada')
    })

    it('should throw AppError when task not found on update', async () => {
      mockRepo.findById.mockResolvedValue(null)

      await expect(tasksService.update('nao-existe', { title: 'X' })).rejects.toMatchObject({
        statusCode: 404,
      })
    })
  })

  describe('delete', () => {
    it('should delete the task', async () => {
      mockRepo.findById.mockResolvedValue(mockTask)
      mockRepo.delete.mockResolvedValue(mockTask)

      await expect(tasksService.delete('uuid-1')).resolves.not.toThrow()
      expect(mockRepo.delete).toHaveBeenCalledWith('uuid-1')
    })

    it('should throw AppError when task not found on delete', async () => {
      mockRepo.findById.mockResolvedValue(null)

      await expect(tasksService.delete('nao-existe')).rejects.toMatchObject({
        statusCode: 404,
      })
    })
  })
})
