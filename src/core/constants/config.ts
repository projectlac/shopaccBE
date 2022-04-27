import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const NAME_APP_COMPANY = 'Shopp Acc';

export const MAILER_CONFIG = {
  HOST: 'smtp.gmail.com',
  PORT: 587,
  SECURE: false,
  USER: 'shoppacc.9999@gmail.com',
  PASS: 'Gunny2.0',
  TEMPLATE_DIR: './templates/',
  FROM: `"Shopp Acc" <shoppacc.9999@gmail.com>`,
};

export const DRIVE_CONFIG = {
  CLIENT_ID:
    '242171222705-t3pqc4rs675vo1e375k7rtc3c0iv4lkj.apps.googleusercontent.com',
  CLIENT_SECRET: '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',
  REFRESH_TOKEN:
    '1//04-WTim0QPr2fCgYIARAAGAQSNwF-L9Ir5GDh8YExXsoDsrej7rF1GUVSxpiVz6gjYcBf2leheELgIjUMxr6R_8ndvGaeqcTrlc0',
  REDIREC_URI: 'https://developers.google.com/oauthplayground',
  ROLE: {
    READER: 'reader',
  },
  TYPE: {
    ANYONE: 'anyone',
  },
  FIELDS: 'webViewLink, webContentLink',
};
export const MULTER_CONFIG = {
  DESTINATION: './uploads',
  CONFIG: {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = uuid();
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  },
};

export const JWT_CONFIG = {
  SECRET: 'secretKey',
  EXPIRES_IN: '30d',
};

export const JWT_EMAIL_CONFIG = {
  secret: 'secretKeyMail',
  // expiresIn: '24h',
  expiresIn: '300s',
};
