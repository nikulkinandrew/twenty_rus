import { Resolver, Query } from '@nestjs/graphql';

import { EnvironmentService } from 'src/integrations/environment/environment.service';

import { ClientConfig } from './client-config.entity';

@Resolver()
export class ClientConfigResolver {
  constructor(private environmentService: EnvironmentService) {}

  @Query(() => ClientConfig)
  async clientConfig(): Promise<ClientConfig> {
    const clientConfig: ClientConfig = {
      authProviders: {
        google: this.environmentService.isAuthGoogleEnabled(),
        magicLink: false,
        password: true,
      },
      telemetry: {
        enabled: this.environmentService.isTelemetryEnabled(),
        anonymizationEnabled:
          this.environmentService.isTelemetryAnonymizationEnabled(),
      },
      signInPrefilled: this.environmentService.isSignInPrefilled(),
      dataModelSettingsEnabled:
        this.environmentService.isDataModelSettingsEnabled(),
      developersSettingsEnabled:
        this.environmentService.isDevelopersSettingsEnabled(),
      debugMode: this.environmentService.isDebugMode(),
      flexibleBackendEnabled:
        this.environmentService.isFlexibleBackendEnabled(),
      support: {
        supportDriver: this.environmentService.getSupportDriver(),
        supportFrontChatId: this.environmentService.getSupportFrontChatId(),
      },
    };

    return Promise.resolve(clientConfig);
  }
}
