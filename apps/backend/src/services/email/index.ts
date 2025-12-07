export interface EmailService {
  sendInviteEmail(options: {
    to: string
    poolTitle: string
    inviteUrl: string
  }): Promise<void>
}
