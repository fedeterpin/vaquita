import { PoolVisibility } from '@prisma/client'

export interface CreatePoolInput {
  title: string
  description?: string
  isPublic: boolean
  contributionsVisibility: PoolVisibility
  targetAmount?: number
  currency?: string
  deadline: string
}

export interface UpdatePoolInput extends Partial<CreatePoolInput> {}
