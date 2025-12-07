import { MockPaymentProvider } from '../src/services/payment/mock'

describe('mock payment provider', () => {
  it('returns paid status', async () => {
    const provider = new MockPaymentProvider()
    const result = await provider.processPayment({ userId: 'u', poolId: 'p', amount: 10 })
    expect(result.status).toBe('PAID')
    expect(result.referenceId).toBeTruthy()
  })
})
