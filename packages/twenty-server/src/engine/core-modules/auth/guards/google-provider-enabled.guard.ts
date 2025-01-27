import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import {
  AuthException,
  AuthExceptionCode,
} from 'src/engine/core-modules/auth/auth.exception';
import { GoogleStrategy } from 'src/engine/core-modules/auth/strategies/google.auth.strategy';
import { EnvironmentService } from 'src/engine/core-modules/environment/environment.service';
import { GuardRedirectService } from 'src/engine/core-modules/guard-redirect/services/guard-redirect.service';

@Injectable()
export class GoogleProviderEnabledGuard implements CanActivate {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly guardRedirectService: GuardRedirectService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      if (!this.environmentService.get('AUTH_GOOGLE_ENABLED')) {
        throw new AuthException(
          'Google auth is not enabled',
          AuthExceptionCode.GOOGLE_API_AUTH_DISABLED,
        );
      }

      new GoogleStrategy(this.environmentService);

      return true;
    } catch (err) {
      this.guardRedirectService.dispatchErrorFromGuard(
        context,
        err,
        this.guardRedirectService.getSubdomainFromContext(context),
      );

      return false;
    }
  }
}
