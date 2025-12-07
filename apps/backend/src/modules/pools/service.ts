import { PoolStatus, PoolVisibility } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { CreatePoolInput, UpdatePoolInput } from './types'
import { calculatePercentages } from '../../services/utils/visibility'

export class PoolService {
  async createPool(ownerId: string, input: CreatePoolInput) {
    const deadlineDate = new Date(input.deadline)
    if (deadlineDate <= new Date()) {
      throw new Error('Deadline must be in the future')
    }
    return prisma.pool.create({
      data: {
        title: input.title,
        description: input.description,
        ownerId,
        isPublic: input.isPublic,
        contributionsVisibility: input.contributionsVisibility,
        targetAmount: input.targetAmount ? input.targetAmount : null,
        currency: input.currency || 'ARS',
        deadline: deadlineDate
      }
    })
  }

  async updatePool(poolId: string, ownerId: string, input: UpdatePoolInput) {
    const pool = await prisma.pool.findUnique({ where: { id: poolId } })
    if (!pool) throw new Error('Pool not found')
    if (pool.ownerId !== ownerId) throw new Error('Forbidden')
    if (pool.status === PoolStatus.CLOSED && input.status === PoolStatus.OPEN) {
      throw new Error('Cannot reopen a closed pool')
    }
    return prisma.pool.update({
      where: { id: poolId },
      data: {
        title: input.title ?? pool.title,
        description: input.description ?? pool.description,
        isPublic: input.isPublic ?? pool.isPublic,
        contributionsVisibility: input.contributionsVisibility ?? pool.contributionsVisibility,
        targetAmount: input.targetAmount ?? pool.targetAmount,
        currency: input.currency ?? pool.currency,
        deadline: input.deadline ? new Date(input.deadline) : pool.deadline,
        status: input.status ?? pool.status
      }
    })
  }

  async closePool(poolId: string, ownerId?: string) {
    const pool = await prisma.pool.findUnique({ where: { id: poolId } })
    if (!pool) throw new Error('Pool not found')
    if (ownerId && pool.ownerId !== ownerId) throw new Error('Forbidden')
    const contributions = await prisma.contribution.findMany({ where: { poolId } })
    const { total, percentages } = calculatePercentages(contributions)
    await prisma.pool.update({ where: { id: poolId }, data: { status: PoolStatus.CLOSED } })
    return { total, percentages }
  }

  async autoCloseExpiredPools() {
    const now = new Date()
    const pools = await prisma.pool.findMany({ where: { status: PoolStatus.OPEN, deadline: { lte: now } } })
    for (const pool of pools) {
      await this.closePool(pool.id)
    }
    return pools.length
  }

  async getPool(id: string) {
    return prisma.pool.findUnique({ where: { id }, include: { owner: true } })
  }

  async listPoolsByUser(userId: string) {
    return prisma.pool.findMany({ where: { ownerId: userId } })
  }

  async listPublicPools() {
    return prisma.pool.findMany({ where: { isPublic: true, status: PoolStatus.OPEN } })
  }

  async listAll() {
    return prisma.pool.findMany()
  }
}
