export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE'

export interface CreateTaskDTO {
  title: string
  description?: string
  status?: TaskStatus
}

export interface UpdateTaskDTO {
  title?: string
  description?: string
  status?: TaskStatus
}
