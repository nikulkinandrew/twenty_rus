/* @license Enterprise */

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  AuthException,
  AuthExceptionCode,
} from 'src/engine/core-modules/auth/auth.exception';
import { SamlAuthStrategy } from 'src/engine/core-modules/auth/strategies/saml.auth.strategy';
import { SSOService } from 'src/engine/core-modules/sso/services/sso.service';
import { GuardRedirectService } from 'src/engine/core-modules/guard-redirect/services/guard-redirect.service';
import { EnvironmentService } from 'src/engine/core-modules/environment/environment.service';
import { SSOConfiguration } from 'src/engine/core-modules/sso/types/SSOConfigurations.type';
import { WorkspaceSSOIdentityProvider } from 'src/engine/core-modules/sso/workspace-sso-identity-provider.entity';

@Injectable()
export class SAMLAuthGuard extends AuthGuard('saml') {
  constructor(
    private readonly sSOService: SSOService,
    private readonly guardRedirectService: GuardRedirectService,
    private readonly environmentService: EnvironmentService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    let identityProvider:
      | (SSOConfiguration & WorkspaceSSOIdentityProvider)
      | null = null;

    try {
      identityProvider = await this.sSOService.findSSOIdentityProviderById(
        request.params.identityProviderId,
      );

      if (!identityProvider) {
        throw new AuthException(
          'Identity provider not found',
          AuthExceptionCode.INVALID_DATA,
        );
      }
      new SamlAuthStrategy(this.sSOService);

      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      this.guardRedirectService.dispatchErrorFromGuard(
        context,
        err,
        identityProvider?.workspace.subdomain ??
          this.environmentService.get('DEFAULT_SUBDOMAIN'),
      );

      return false;
    }
  }
}
