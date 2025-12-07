import { EmailService } from './index'

export class ConsoleEmailService implements EmailService {
  async sendInviteEmail(options: { to: string; poolTitle: string; inviteUrl: string }): Promise<void> {
    console.log('Mock email sent', options)
  }
}
