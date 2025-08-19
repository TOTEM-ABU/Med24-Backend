import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"From Med24 App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
      });
      console.log(`Email sent: ${info.messageId}`);
      return 'Success!';
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${(error as Error).message}`);
    }
  }
}
