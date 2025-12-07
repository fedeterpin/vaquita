import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { AuthService } from './service'

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export async function authRoutes(fastify: FastifyInstance) {
  const service = new AuthService(fastify)

  fastify.post('/api/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.parse(request.body)
    const exists = await fastify.prisma.user.findUnique({ where: { email: body.email.toLowerCase() } })
    if (exists) {
      return reply.code(400).send({ message: 'Email already registered' })
    }
    const user = await service.register(body)
    return reply.code(201).send({ id: user.id, email: user.email, name: user.name })
  })

  fastify.post('/api/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body)
    const result = await service.login(body)
    if (!result) {
      return reply.code(401).send({ message: 'Invalid credentials' })
    }
    return reply.send({ token: result.token, user: { id: result.user.id, email: result.user.email, name: result.user.name } })
  })

  fastify.get('/api/auth/me', { preHandler: fastify.authenticate }, async (request, reply) => {
    const user = await service.me((request as any).user.userId)
    if (!user) return reply.code(404).send({ message: 'User not found' })
    return reply.send({ id: user.id, email: user.email, name: user.name })
  })
}
