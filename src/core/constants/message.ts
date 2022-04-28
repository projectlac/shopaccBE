export const DRIVER_MESSAGE = {
  REMOVE: {
    SUCCESS: 'Remove image successfully',
  },
};

export const AUTH_MESSAGE = {
  USER: {
    NOT_FOUND: 'User not found!',
    EXIST: 'Username or email already in use!',
    CONFIRM_PASSWORD: 'Password are not same!',
    WRONG_PASSWORD: 'Password was wrong!',
    SUBMITTED: 'User submitted!',
    ROLE: 'User cannot use this api!',
  },
  TOKEN: {
    EXPIRED: 'Token expired!',
  },
};

export const POST_MESSAGE = {
  DELETE: 'Delete post success!',
  NOT_FOUND: 'Post not found!',
};

export const TAG_MESSAGE = {
  CONFLICT: 'This tag title existed!',
};

export const ACCOUNT_MESSAGE = {
  NOT_FOUND: 'Account not found!',
};

export enum EXPIRES_IN_MINUTE {
  FIVE_MINUTE = 5,
}
