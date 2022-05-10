export const DRIVER_MESSAGE = {
  REMOVE: {
    SUCCESS: 'Remove image successfully',
  },
};

export const AUTH_MESSAGE = {
  USER: {
    NOT_FOUND: 'Tài khoản không tồn tại!',
    EXIST: 'Tài khoản đã tồn tại!',
    CONFIRM_PASSWORD: 'Mật khẩu phải trùng nhau!',
    WRONG_PASSWORD: 'Sai mật khẩu!',
    SUBMITTED: 'Xác thực tài khoản thành công!',
    ROLE: 'Người dùng không đủ quyền hạn!',
    UNAUTHORIZED:'Bạn cần đăng nhập để sử dụng tính năng này!'
  },
  TOKEN: {
    EXPIRED: 'Token đã hết hạn!',
  },
};

export const POST_MESSAGE = {
  DELETE: 'Xoá bài đăng thành công!',
  NOT_FOUND: 'Bài đăng không tồn tại!',
};

export const TAG_MESSAGE = {
  CONFLICT: 'Tag đã tồn tại!',
};

export const ACCOUNT_MESSAGE = {
  NOT_FOUND: 'Tài khoản không tồn tại!',
};

export enum EXPIRES_IN_MINUTE {
  FIVE_MINUTE = 5,
  THIRTY_MINUTE = 30,
}
