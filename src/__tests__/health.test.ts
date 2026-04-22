import request from 'supertest'
import { app } from '../app'

describe('GET /health', () => {
  it('should return 200 with success true and uptime', async () => {
    const res = await request(app).get('/health')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('uptime')
    expect(typeof res.body.data.uptime).toBe('number')
  })
})
