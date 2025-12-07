import { PaymentProvider } from './index'
import { randomUUID } from 'crypto'

export class MockPaymentProvider implements PaymentProvider {
  async processPayment(): Promise<{ status: 'PAID' | 'FAILED'; referenceId: string }> {
    return { status: 'PAID', referenceId: randomUUID() }
  }
}
