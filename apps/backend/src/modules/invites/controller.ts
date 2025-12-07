import { FastifyInstance } from 'fastify'
import { InviteService } from './service'

export async function inviteRoutes(fastify: FastifyInstance) {
  const service = new InviteService()

  fastify.post('/api/pools/:id/invites', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = (request as any).user.userId
    try {
      const invite = await service.generateInvite(id, userId)
      return invite
    } catch (err: any) {
      return reply.code(400).send({ message: err.message })
    }
  })

  fastify.get('/api/invites/:token', async (request, reply) => {
    const { token } = request.params as { token: string }
    try {
      const invite = await service.validateInvite(token)
      return { pool: { id: invite.pool.id, title: invite.pool.title, isPublic: invite.pool.isPublic } }
    } catch (err: any) {
      return reply.code(400).send({ message: err.message })
    }
  })
}
