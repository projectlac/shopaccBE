import { MAILER_CONFIG } from '@/core';
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { MAIL_SUBJECT, MAIL_TEMPLATE } from '../interface';
import { getMailOptions } from '../util';

export const handlerbarOptions: hbs.NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    partialsDir: MAILER_CONFIG.TEMPLATE_DIR,
    defaultLayout: false,
  },
  viewPath: MAILER_CONFIG.TEMPLATE_DIR,
};

@Injectable()
export class MailerService {
  private transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: MAILER_CONFIG.HOST,
      port: MAILER_CONFIG.PORT,
      secure: MAILER_CONFIG.SECURE,
      auth: {
        user: MAILER_CONFIG.USER,
        pass: MAILER_CONFIG.PASS,
      },
    });
    this.transporter.use('compile', hbs(handlerbarOptions));
  }

  async sendWelcomeMail(to: string, username: string) {
    const mailOptions = getMailOptions(
      to,
      MAIL_SUBJECT.WELCOME,
      MAIL_TEMPLATE.WELCOME,
      { name: username, company: 'Shopp Acc ' },
    );
    return this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordMail(to: string, token: string, username: string) {
    const mailOptions = getMailOptions(
      to,
      MAIL_SUBJECT.RESET_PASSWORD,
      MAIL_TEMPLATE.RESET_PASSWORD,
      { name: username, token },
    );
    return this.transporter.sendMail(mailOptions);
  }
}
