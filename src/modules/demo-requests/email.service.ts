import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendDemoRequestNotification(demoRequest: any) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@arwapark.com'

      const mailOptions = {
        from: process.env.SMTP_FROM || '"ArwaPark" <no-reply@arwapark.com>',
        to: adminEmail,
        subject: `🎯 New Demo Request – ArwaPark`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">New Demo Request</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">ArwaPark SaaS Platform</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <h2 style="color: #374151; margin-top: 0;">Company Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Company:</td>
                  <td style="padding: 10px 0; color: #111827;">${demoRequest.companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Contact:</td>
                  <td style="padding: 10px 0; color: #111827;">${demoRequest.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; color: #111827;"><a href="mailto:${demoRequest.email}">${demoRequest.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Phone:</td>
                  <td style="padding: 10px 0; color: #111827;"><a href="tel:${demoRequest.phone}">${demoRequest.phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Fleet Size:</td>
                  <td style="padding: 10px 0; color: #111827;">${demoRequest.fleetSize}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Interested Plan:</td>
                  <td style="padding: 10px 0;">
                    <span style="background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold;">
                      ${demoRequest.interestedPlan}
                    </span>
                  </td>
                </tr>
                ${demoRequest.message ? `
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold; vertical-align: top;">Message:</td>
                  <td style="padding: 10px 0; color: #111827;">${demoRequest.message}</td>
                </tr>
                ` : ''}
              </table>
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}/super-admin/demo-requests" 
                   style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  View in Dashboard
                </a>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
              <p>This is an automated notification from ArwaPark SaaS Platform</p>
            </div>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      this.logger.log(`Demo request notification sent to ${adminEmail}`)
    } catch (error) {
      this.logger.error('Failed to send demo request notification email', error)
      // Don't throw - email failure shouldn't block the request
    }
  }
}
