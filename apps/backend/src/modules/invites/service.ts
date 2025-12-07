import { prisma } from '../../lib/prisma'
import { randomUUID } from 'crypto'
import { ConsoleEmailService } from '../../services/email/mock'

export class InviteService {
  private email = new ConsoleEmailService()

  async generateInvite(poolId: string, ownerId: string) {
    const pool = await prisma.pool.findUnique({ where: { id: poolId } })
    if (!pool) throw new Error('Pool not found')
    if (pool.ownerId !== ownerId) throw new Error('Forbidden')
    const token = randomUUID()
    const invite = await prisma.inviteToken.create({ data: { poolId, token } })
    await this.email.sendInviteEmail({ to: pool.ownerId, poolTitle: pool.title, inviteUrl: token })
    return invite
  }

  async validateInvite(token: string) {
    const invite = await prisma.inviteToken.findUnique({ where: { token }, include: { pool: true } })
    if (!invite) throw new Error('Invalid invite')
    if (invite.expiresAt && invite.expiresAt < new Date()) throw new Error('Invite expired')
    return invite
  }
}
