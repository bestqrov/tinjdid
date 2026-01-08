import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name)

  async sendDemoAlert(demoRequest: any) {
    try {
      // Mock WhatsApp notification - ready for Twilio or Meta API integration
      const message = this.formatDemoMessage(demoRequest)
      
      this.logger.log('WhatsApp Demo Alert (Mock)')
      this.logger.log(`To: ${process.env.ADMIN_WHATSAPP || '+212XXXXXXXXX'}`)
      this.logger.log(`Message: ${message}`)
      
      // TODO: Implement real WhatsApp API when ready
      // Example with Twilio:
      // await this.twilioClient.messages.create({
      //   body: message,
      //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      //   to: `whatsapp:${process.env.ADMIN_WHATSAPP}`
      // })
      
      return { success: true, mock: true }
    } catch (error) {
      this.logger.error('Failed to send WhatsApp alert', error)
      // Don't throw - WhatsApp failure shouldn't block the request
      return { success: false, error: error.message }
    }
  }

  private formatDemoMessage(demoRequest: any): string {
    return `
🎯 *Nouvelle Demande de Démo - ArwaPark*

🏢 *Entreprise:* ${demoRequest.companyName}
👤 *Contact:* ${demoRequest.fullName}
📧 *Email:* ${demoRequest.email}
📱 *Téléphone:* ${demoRequest.phone}
🚗 *Taille de flotte:* ${demoRequest.fleetSize}
💎 *Plan intéressé:* ${demoRequest.interestedPlan}
${demoRequest.message ? `\n💬 *Message:*\n${demoRequest.message}` : ''}

🔗 Voir dans le dashboard
    `.trim()
  }
}
