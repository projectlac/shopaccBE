import { TemplateOptions } from 'nodemailer-express-handlebars';

export enum MAILER_TEMPLATE_ENUM {
  WELCOME = 'WELCOME',
  RESET_PASSWORD = 'RESET_PASSWORD',
  SUBMIT_USER = 'SUBMIT_USER',
}

export const MAILER_TEMPLATE: MailerTemplateInterface = {
  WELCOME: {
    TEMPLATE: 'welcome-mail',
    SUBJECT: 'Welcome!',
  },
  RESET_PASSWORD: {
    TEMPLATE: 'reset-password-mail',
    SUBJECT: 'Reset password!',
  },
  SUBMIT_USER: {
    TEMPLATE: 'submit-user-mail',
    SUBJECT: 'Submit user!',
  },
};

export interface MailerTemplateInterface {
  [key: string]: {
    TEMPLATE: string;
    SUBJECT: string;
  };
}

export interface WelcomeMailContext {
  username: string;
  company: string;
}

export interface ResetPasswordMailContext {
  username: string;
  token: string;
  company: string;
}

export interface SubmitUserMailContext {
  username: string;
  token: string;
  company: string;
}

export type MailContext =
  | WelcomeMailContext
  | ResetPasswordMailContext
  | SubmitUserMailContext;

export interface MailerOptions extends TemplateOptions {
  from: string;
  to: string;
  subject: string;
}
