import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Response } from 'express';

import { AuthExceptionHandlerService } from 'src/engine/core-modules/auth/auth-exception-handler.service';
import {
  AuthException,
  AuthExceptionCode,
} from 'src/engine/core-modules/auth/auth.exception';

@Catch(AuthException)
export class AuthRestApiExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly authExceptionHandlerService: AuthExceptionHandlerService,
  ) {}

  catch(exception: AuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case AuthExceptionCode.USER_NOT_FOUND:
      case AuthExceptionCode.CLIENT_NOT_FOUND:
        return this.authExceptionHandlerService.handleError(
          exception,
          response,
          404,
        );
      case AuthExceptionCode.INVALID_INPUT:
      case AuthExceptionCode.INVALID_DATA:
      case AuthExceptionCode.MISSING_ENVIRONMENT_VARIABLE:
        return this.authExceptionHandlerService.handleError(
          exception,
          response,
          400,
        );
      case AuthExceptionCode.FORBIDDEN_EXCEPTION:
        return this.authExceptionHandlerService.handleError(
          exception,
          response,
          401,
        );
      case AuthExceptionCode.GOOGLE_API_AUTH_DISABLED:
      case AuthExceptionCode.MICROSOFT_API_AUTH_DISABLED:
      case AuthExceptionCode.SIGNUP_DISABLED:
        return this.authExceptionHandlerService.handleError(
          exception,
          response,
          403,
        );
      case AuthExceptionCode.INTERNAL_SERVER_ERROR:
      default:
        return this.authExceptionHandlerService.handleError(
          exception,
          response,
          500,
        );
    }
  }
}
