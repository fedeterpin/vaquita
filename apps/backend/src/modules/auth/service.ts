import { prisma } from '../../lib/prisma'
import { RegisterInput, LoginInput } from './types'
import bcrypt from 'bcryptjs'
import { FastifyInstance } from 'fastify'

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async register(input: RegisterInput) {
    const hashed = await bcrypt.hash(input.password, 10)
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: hashed
      }
    })
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } })
    if (!user) return null
    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) return null
    const token = this.fastify.jwt.sign({ userId: user.id })
    return { token, user }
  }

  async me(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } })
  }
}
