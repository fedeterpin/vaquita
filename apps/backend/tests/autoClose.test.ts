import { PoolService } from '../src/modules/pools/service'
import { PoolStatus } from '@prisma/client'

jest.mock('../src/lib/prisma', () => {
  return {
    prisma: {
      pool: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn()
      },
      contribution: {
        findMany: jest.fn()
      }
    }
  }
})

const { prisma } = require('../src/lib/prisma')

describe('auto close pools', () => {
  it('closes expired pools', async () => {
    (prisma.pool.findMany as jest.Mock).mockResolvedValue([
      { id: '1', ownerId: 'owner', status: PoolStatus.OPEN, deadline: new Date() }
    ])
    ;(prisma.pool.findUnique as jest.Mock).mockResolvedValue({ id: '1', ownerId: 'owner', status: PoolStatus.OPEN })
    ;(prisma.contribution.findMany as jest.Mock).mockResolvedValue([])
    const service = new PoolService()
    const count = await service.autoCloseExpiredPools()
    expect(count).toBe(1)
  })
})
