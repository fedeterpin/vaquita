import { PaymentStatus, PoolStatus } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { PaymentProvider } from '../../services/payment'
import { MockPaymentProvider } from '../../services/payment/mock'

export class ContributionService {
  private payment: PaymentProvider

  constructor(paymentProvider: PaymentProvider = new MockPaymentProvider()) {
    this.payment = paymentProvider
  }

  async createContribution(userId: string, poolId: string, amount: number, isVisibleToOthers: boolean) {
    const pool = await prisma.pool.findUnique({ where: { id: poolId } })
    if (!pool) throw new Error('Pool not found')
    if (pool.status !== PoolStatus.OPEN) throw new Error('Pool is not open')
    const payment = await this.payment.processPayment({ userId, poolId, amount })
    return prisma.contribution.create({
      data: {
        poolId,
        userId,
        amount,
        currency: pool.currency,
        isVisibleToOthers,
        paymentStatus: payment.status === 'PAID' ? PaymentStatus.PAID : PaymentStatus.FAILED,
        paymentProvider: 'MOCK',
        paymentReference: payment.referenceId
      }
    })
  }

  async listContributions(poolId: string) {
    return prisma.contribution.findMany({ where: { poolId } })
  }
}
