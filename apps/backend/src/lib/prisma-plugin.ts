import fp from 'fastify-plugin'
import { prisma } from './prisma'
import { FastifyInstance } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma
    authenticate: any
  }
}

export const prismaPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.decorate('prisma', prisma)
})
