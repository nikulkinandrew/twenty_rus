import { Injectable } from '@nestjs/common';

import { SkipSyncEmail } from 'src/engine/core-modules/user-state/dtos/skip-sync-email.entity';
import { InjectObjectMetadataRepository } from 'src/engine/object-metadata-repository/object-metadata-repository.decorator';
import { ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';
import { ConnectedAccountRepository } from 'src/modules/connected-account/repositories/connected-account.repository';
import { User } from 'src/engine/core-modules/user/user.entity';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { UserState } from 'src/engine/core-modules/user-state/dtos/user-state.dto';
import {
  KeyValuePairService,
  KeyValueTypes,
} from 'src/engine/core-modules/key-value-pair/key-value-pair.service';
import { UserStates } from 'src/engine/core-modules/user-state/enums/user-states.enum';
import { UserStateEmailSyncValues } from 'src/engine/core-modules/user-state/enums/user-state-email-sync-values.enum';

@Injectable()
export class UserStateService {
  constructor(
    @InjectObjectMetadataRepository(ConnectedAccountWorkspaceEntity)
    private readonly connectedAccountRepository: ConnectedAccountRepository,
    private readonly keyValuePairService: KeyValuePairService<KeyValueTypes.USER_STATE>,
  ) {}

  async getUserState(user: User, workspace: Workspace): Promise<UserState> {
    const connectedAccounts =
      await this.connectedAccountRepository.getAllByUserId(
        user.id,
        workspace.id,
      );

    if (connectedAccounts?.length) {
      return {
        skipSyncEmail: true,
      };
    }

    const skipSyncEmail = await this.keyValuePairService.get(
      user.id,
      workspace.id,
      UserStates.EMAIL_SYNC,
    );

    return {
      skipSyncEmail:
        !!skipSyncEmail &&
        skipSyncEmail.value === UserStateEmailSyncValues.SKIPPED,
    };
  }

  async skipSyncEmail(
    userId: string,
    workspaceId: string,
  ): Promise<SkipSyncEmail> {
    await this.keyValuePairService.set(
      userId,
      workspaceId,
      UserStates.EMAIL_SYNC,
      UserStateEmailSyncValues.SKIPPED,
    );

    return { success: true };
  }
}
