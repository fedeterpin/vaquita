import { calculatePercentages, filterContributions } from '../src/services/utils/visibility'
import { PoolVisibility, PoolStatus } from '@prisma/client'

describe('calculatePercentages', () => {
  it('computes totals per user', () => {
    const contributions: any = [
      { userId: 'a', amount: 50 },
      { userId: 'b', amount: 50 },
      { userId: 'a', amount: 100 }
    ]
    const { total, percentages } = calculatePercentages(contributions as any)
    expect(total).toBe(200)
    const userA = percentages.find((p) => p.userId === 'a')!
    expect(Math.round(userA.percentage)).toBe(75)
  })
})

describe('visibility rules', () => {
  const basePool: any = {
    id: 'pool',
    ownerId: 'owner',
    status: PoolStatus.OPEN,
    contributionsVisibility: PoolVisibility.PUBLIC,
    isPublic: true
  }
  const contributions: any = [
    { id: '1', userId: 'owner', isVisibleToOthers: false },
    { id: '2', userId: 'user', isVisibleToOthers: false },
    { id: '3', userId: 'another', isVisibleToOthers: true }
  ]

  it('allows owner to see all', () => {
    const filtered = filterContributions({ pool: basePool, contributions, currentUserId: 'owner', isOwner: true })
    expect(filtered).toHaveLength(3)
  })

  it('hides non-visible contributions from others', () => {
    const filtered = filterContributions({ pool: basePool, contributions, currentUserId: 'user', isOwner: false })
    expect(filtered.map((c) => c.id)).toEqual(['2', '3'])
  })

  it('anonymous pools hide others', () => {
    const pool = { ...basePool, contributionsVisibility: PoolVisibility.ANONYMOUS }
    const filtered = filterContributions({ pool, contributions, currentUserId: 'user', isOwner: false })
    expect(filtered.map((c) => c.userId)).toEqual(['user'])
  })
})
