import { AuditInformationDto } from '@/audit';
import { MAILER_CONFIG, NAME_APP_COMPANY } from '@/core';
import { Audit, AuditInformation } from '@/entity';
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { MAILER_TEMPLATE_ENUM } from '../interface';
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
    const mailOptions = getMailOptions(to, MAILER_TEMPLATE_ENUM.WELCOME, {
      username,
      company: NAME_APP_COMPANY,
    });
    return this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordMail(to: string, token: string, username: string) {
    const mailOptions = getMailOptions(
      to,
      MAILER_TEMPLATE_ENUM.RESET_PASSWORD,
      { username, token, company: NAME_APP_COMPANY },
    );
    return this.transporter.sendMail(mailOptions);
  }

  async sendSubmitMail(to: string, username: string, token: string) {
    const mailOptions = getMailOptions(to, MAILER_TEMPLATE_ENUM.SUBMIT_USER, {
      username,
      token,
      company: NAME_APP_COMPANY,
    });
    return this.transporter.sendMail(mailOptions);
  }

  async sendAuditStoneMail(to:string,username:string,gameUsername:string,password:string,server:string,UID:string, auditInformation: AuditInformation[],total:number,note=''){
    const mailOptions = getMailOptions(to,MAILER_TEMPLATE_ENUM.AUDIT_STONE,{
      username,
      gameUsername,
      password,
      auditInformation,
      server,
      UID,
      note,
      total
    })
    return this.transporter.sendMail(mailOptions);
  }
}
