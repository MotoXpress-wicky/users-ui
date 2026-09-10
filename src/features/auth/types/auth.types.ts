export type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
}


export type LoginCredentials = {
  email: string;
  password: string;
}

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  captchaToken: string;
}

export const AuthErrorCode = {
  ACCESS_TOKEN_MISSING: 'ACCESS_TOKEN_MISSING',
  ACCESS_TOKEN_EXPIRED: 'ACCESS_TOKEN_EXPIRED',
  ACCESS_TOKEN_INVALID: 'ACCESS_TOKEN_INVALID',

  REFRESH_TOKEN_MISSING: 'REFRESH_TOKEN_MISSING',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',
  REFRESH_TOKEN_INVALID: 'REFRESH_TOKEN_INVALID',
  REFRESH_TOKEN_REUSED: 'REFRESH_TOKEN_REUSED',

  UNAUTHENTICATED: 'UNAUTHENTICATED',
} as const;


/**
 * Below line produce
 * 
 * type AuthErrorCode =
  | "ACCESS_TOKEN_MISSING"
  | "ACCESS_TOKEN_EXPIRED"
  | "ACCESS_TOKEN_INVALID"
  | "REFRESH_TOKEN_MISSING"
  | "REFRESH_TOKEN_EXPIRED"
  | "REFRESH_TOKEN_INVALID"
  | "REFRESH_TOKEN_REUSED"
  | "UNAUTHENTICATED";

  this type.
 */

export type AuthErrorCode = typeof AuthErrorCode[keyof typeof AuthErrorCode];

export type AuthErrorBody = {
  status: number;
  code: AuthErrorCode;
  message: string;
  refreshable: boolean;
  timestamp: string;
};

export type ForgotPasswordData =  {
  email:string;
  
}

export type ResetPasswordData = {
  token:string,
  newPassword:string,
}

