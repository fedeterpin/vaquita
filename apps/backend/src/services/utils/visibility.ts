import { Contribution, Pool, PoolVisibility } from '@prisma/client'

export interface VisibilityContext {
  pool: Pool
  contributions: (Contribution & { userId: string })[]
  currentUserId?: string
  isOwner: boolean
}

export function filterContributions(context: VisibilityContext) {
  const { pool, contributions, currentUserId, isOwner } = context
  if (isOwner) return contributions
  if (pool.contributionsVisibility === PoolVisibility.ANONYMOUS) {
    return contributions.filter((c) => c.userId === currentUserId)
  }
  return contributions.filter((c) => c.isVisibleToOthers || c.userId === currentUserId)
}

export function calculatePercentages(contributions: Contribution[]) {
  const total = contributions.reduce((sum, c) => sum + Number(c.amount), 0)
  const totalsByUser: Record<string, number> = {}
  contributions.forEach((c) => {
    totalsByUser[c.userId] = (totalsByUser[c.userId] || 0) + Number(c.amount)
  })
  const percentages = Object.entries(totalsByUser).map(([userId, amount]) => ({
    userId,
    percentage: total === 0 ? 0 : (amount / total) * 100
  }))
  return { total, percentages }
}
