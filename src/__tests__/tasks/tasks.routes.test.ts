import request from 'supertest'
import { app } from '../../app'
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

describe('Tasks Routes', () => {
  describe('GET /tasks', () => {
    it('should return 200 with list of tasks', async () => {
      mockRepo.findAll.mockResolvedValue([mockTask])

      const res = await request(app).get('/tasks')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  describe('GET /tasks/:id', () => {
    it('should return 200 with the task', async () => {
      mockRepo.findById.mockResolvedValue(mockTask)

      const res = await request(app).get('/tasks/uuid-1')

      expect(res.status).toBe(200)
      expect(res.body.data.id).toBe('uuid-1')
    })

    it('should return 404 when task not found', async () => {
      mockRepo.findById.mockResolvedValue(null)

      const res = await request(app).get('/tasks/nao-existe')

      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe('POST /tasks', () => {
    it('should return 201 with the created task', async () => {
      mockRepo.create.mockResolvedValue(mockTask)

      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Tarefa teste', description: 'Descrição' })

      expect(res.status).toBe(201)
      expect(res.body.data.title).toBe('Tarefa teste')
    })

    it('should return 400 when title is missing', async () => {
      const res = await request(app).post('/tasks').send({})

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('should return 400 when title has less than 3 characters', async () => {
      const res = await request(app).post('/tasks').send({ title: 'ab' })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })
  })

  describe('PUT /tasks/:id', () => {
    it('should return 200 with the updated task', async () => {
      const updated = { ...mockTask, title: 'Atualizada' }
      mockRepo.findById.mockResolvedValue(mockTask)
      mockRepo.update.mockResolvedValue(updated)

      const res = await request(app).put('/tasks/uuid-1').send({ title: 'Atualizada' })

      expect(res.status).toBe(200)
      expect(res.body.data.title).toBe('Atualizada')
    })
  })

  describe('DELETE /tasks/:id', () => {
    it('should return 200 on successful deletion', async () => {
      mockRepo.findById.mockResolvedValue(mockTask)
      mockRepo.delete.mockResolvedValue(mockTask)

      const res = await request(app).delete('/tasks/uuid-1')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })
})
