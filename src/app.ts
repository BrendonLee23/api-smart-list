import express from 'express'
import cors from 'cors'
import { tasksRouter } from './modules/tasks/tasks.routes'
import { errorHandler } from './middleware/errorHandler'

export const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 200, success: true, data: { uptime: process.uptime() } })
})

app.use('/tasks', tasksRouter)

app.use(errorHandler)
