import Fastify from 'fastify'
import cors from '@fastify/cors'
import { authPlugin } from './middlewares/auth'
import { prismaPlugin } from './lib/prisma-plugin'
import { authRoutes } from './modules/auth/controller'
import { poolRoutes } from './modules/pools/controller'
import { contributionRoutes } from './modules/contributions/controller'
import { inviteRoutes } from './modules/invites/controller'

const fastify = Fastify({ logger: true })

fastify.register(cors, { origin: true })
fastify.register(prismaPlugin)
fastify.register(authPlugin)
fastify.register(authRoutes)
fastify.register(poolRoutes)
fastify.register(contributionRoutes)
fastify.register(inviteRoutes)

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    fastify.log.info('Server running on port 3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
