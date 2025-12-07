import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: { userId: string }
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

export const authPlugin = fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: 'supersecret'
  })

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.code(401).send({ message: 'Unauthorized' })
    }
  })
})

export const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const decoded = await request.jwtVerify<{ userId: string }>()
    request.user = { userId: decoded.userId }
  } catch (err) {
    reply.code(401).send({ message: 'Unauthorized' })
  }
}
