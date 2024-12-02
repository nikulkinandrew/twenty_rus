import { CustomException } from 'src/utils/custom-exception';

export class AuthException extends CustomException {
  code: AuthExceptionCode;
  constructor(message: string, code: AuthExceptionCode) {
    super(message, code);
  }
}

export enum AuthExceptionCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  CLIENT_NOT_FOUND = 'CLIENT_NOT_FOUND',
  WORKSPACE_NOT_FOUND = 'WORKSPACE_NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  FORBIDDEN_EXCEPTION = 'FORBIDDEN_EXCEPTION',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  INVALID_DATA = 'INVALID_DATA',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  OAUTH_ACCESS_DENIED = 'OAUTH_ACCESS_DENIED',
  SSO_AUTH_FAILED = 'SSO_AUTH_FAILED',
  USE_SSO_AUTH = 'USE_SSO_AUTH',
  ENVIRONMENT_VARIABLES_NOT_FOUND = 'ENVIRONMENT_VARIABLES_NOT_FOUND',
}
