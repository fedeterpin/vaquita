import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { PoolService } from './service'
import { PoolVisibility } from '@prisma/client'
import { filterContributions } from '../../services/utils/visibility'

const createPoolSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  isPublic: z.boolean(),
  contributionsVisibility: z.nativeEnum(PoolVisibility),
  targetAmount: z.number().optional(),
  currency: z.string().optional(),
  deadline: z.string()
})

const updatePoolSchema = createPoolSchema.partial()

export async function poolRoutes(fastify: FastifyInstance) {
  const service = new PoolService()

  fastify.post('/api/pools', { preHandler: fastify.authenticate }, async (request, reply) => {
    const body = createPoolSchema.parse(request.body)
    const userId = (request as any).user.userId
    const pool = await service.createPool(userId, body)
    reply.code(201).send(pool)
  })

  fastify.get('/api/pools', { preHandler: fastify.authenticate }, async (request) => {
    const userId = (request as any).user.userId
    return service.listPoolsByUser(userId)
  })

  fastify.get('/api/pools/public', async () => {
    return service.listPublicPools()
  })

  fastify.get('/api/pools/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const pool = await service.getPool(id)
    if (!pool) return reply.code(404).send({ message: 'Not found' })
    return pool
  })

  fastify.patch('/api/pools/:id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = updatePoolSchema.parse(request.body)
    const userId = (request as any).user.userId
    try {
      const updated = await service.updatePool(id, userId, body)
      return updated
    } catch (err: any) {
      return reply.code(400).send({ message: err.message })
    }
  })

  fastify.post('/api/pools/:id/close', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = (request as any).user.userId
    try {
      const summary = await service.closePool(id, userId)
      return summary
    } catch (err: any) {
      return reply.code(400).send({ message: err.message })
    }
  })
}
