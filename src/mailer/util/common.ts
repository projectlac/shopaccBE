import { MAILER_CONFIG } from '@/core';
import {
  MAIL_TEMPLATE,
  MailContext,
  MailerOptions,
  MAIL_SUBJECT,
} from '../interface';

export const getMailOptions = (
  to: string,
  subject: MAIL_SUBJECT,
  template: MAIL_TEMPLATE,
  context: MailContext,
): MailerOptions => {
  return {
    from: MAILER_CONFIG.FROM,
    to,
    subject,
    template,
    context,
  };
};

export const getExpiredTime = (expiresIn: number): Date => {
  const date = new Date();
  return new Date(date.getTime() + expiresIn * 60000);
};
