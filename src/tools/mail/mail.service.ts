import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      pass: 'rgqh wpaa xgwg kwna',
      user: 'bozorboyevazizjon56@gmail.com',
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    try {
      let a = await this.transporter.sendMail({
        to,
        subject,
        text,
      });
      return 'Success!';
    } catch (error) {
      return (error as Error).message;
    }
  }
}
