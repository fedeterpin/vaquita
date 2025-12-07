import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ContributionService } from './service'
import { filterContributions } from '../../services/utils/visibility'
import { prisma } from '../../lib/prisma'

const contributionSchema = z.object({
  amount: z.number().positive(),
  isVisibleToOthers: z.boolean()
})

export async function contributionRoutes(fastify: FastifyInstance) {
  const service = new ContributionService()

  fastify.post('/api/pools/:id/contributions', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = contributionSchema.parse(request.body)
    const userId = (request as any).user.userId
    try {
      const contribution = await service.createContribution(userId, id, body.amount, body.isVisibleToOthers)
      return reply.code(201).send(contribution)
    } catch (err: any) {
      return reply.code(400).send({ message: err.message })
    }
  })

  fastify.get('/api/pools/:id/contributions', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const invite = (request.query as any).invite as string | undefined
    const userId = (request as any).user.userId
    const pool = await prisma.pool.findUnique({ where: { id } })
    if (!pool) return reply.code(404).send({ message: 'Pool not found' })
    if (!pool.isPublic && pool.ownerId !== userId) {
      if (!invite) return reply.code(403).send({ message: 'Forbidden' })
      const token = await prisma.inviteToken.findUnique({ where: { token: invite } })
      if (!token || token.poolId !== id) return reply.code(403).send({ message: 'Invalid invite' })
    }
    const contributions = await service.listContributions(id)
    const filtered = filterContributions({
      pool,
      contributions,
      currentUserId: userId,
      isOwner: pool.ownerId === userId
    })
    return { contributions: filtered }
  })
}
