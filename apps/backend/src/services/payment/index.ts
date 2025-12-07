export interface PaymentProvider {
  processPayment(params: {
    userId: string
    poolId: string
    amount: number
  }): Promise<{ status: 'PAID' | 'FAILED'; referenceId: string }>
}
