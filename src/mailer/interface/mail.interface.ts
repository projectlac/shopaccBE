import { AuditInformationDto } from '@/audit';
import { Audit, AuditInformation } from '@/entity';
import { TemplateOptions } from 'nodemailer-express-handlebars';

export enum MAILER_TEMPLATE_ENUM {
  WELCOME = 'WELCOME',
  RESET_PASSWORD = 'RESET_PASSWORD',
  SUBMIT_USER = 'SUBMIT_USER',
  AUDIT_STONE='AUDIT_STONE'
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
  AUDIT_STONE:{
    TEMPLATE:'request-stone-mail',
    SUBJECT:'Request Stone'
  }
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

export interface RequestStoneMailContext{
  username:string
  gameUsername:string
  password:string
  server:string
  UID:string
  note:string
  total:number
  auditInformation: AuditInformation[]
}

export type MailContext =
  | WelcomeMailContext
  | ResetPasswordMailContext
  | SubmitUserMailContext
  |RequestStoneMailContext

export interface MailerOptions extends TemplateOptions {
  from: string;
  to: string;
  subject: string;
}
