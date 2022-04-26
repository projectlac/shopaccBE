import { TemplateOptions } from 'nodemailer-express-handlebars';

export enum MAIL_TEMPLATE {
  WELCOME = 'welcome-mail',
  RESET_PASSWORD = 'reset-password-mail',
}
export enum MAIL_SUBJECT {
  WELCOME = 'Welcome!',
  RESET_PASSWORD = 'Reset password!',
}

export interface WelcomeMailContext {
  name: string;
  company: string;
}

export interface ResetPasswordMailContext {
  name: string;
  token: string;
}

export type MailContext = WelcomeMailContext | ResetPasswordMailContext;

export interface MailerOptions extends TemplateOptions {
  from: string;
  to: string;
  subject: MAIL_SUBJECT;
}
