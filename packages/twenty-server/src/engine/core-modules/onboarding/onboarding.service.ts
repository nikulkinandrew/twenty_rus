/* eslint-disable @nx/workspace-inject-workspace-repository */
import { Injectable } from '@nestjs/common';

import { BillingWorkspaceService } from 'src/engine/core-modules/billing/billing.workspace-service';
import { SubscriptionStatus } from 'src/engine/core-modules/billing/entities/billing-subscription.entity';
import { OnboardingStatus } from 'src/engine/core-modules/onboarding/enums/onboarding-status.enum';
import { UserVarsService } from 'src/engine/core-modules/user/user-vars/services/user-vars.service';
import { User } from 'src/engine/core-modules/user/user.entity';
import {
  Workspace,
  WorkspaceActivationStatus,
} from 'src/engine/core-modules/workspace/workspace.entity';
import { InjectObjectMetadataRepository } from 'src/engine/object-metadata-repository/object-metadata-repository.decorator';
import { ConnectedAccountRepository } from 'src/modules/connected-account/repositories/connected-account.repository';
import { ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';
import { isDefined } from 'src/utils/is-defined';

enum OnboardingStepValues {
  SKIPPED = 'SKIPPED',
}

export enum OnboardingStepBooleanValues {
  TRUE = 'TRUE',
}

export enum OnboardingStepKeys {
  SYNC_EMAIL_ONBOARDING_STEP = 'SYNC_EMAIL_ONBOARDING_STEP',
  DISPLAY_INVITE_TEAM_ONBOARDING_STEP = 'DISPLAY_INVITE_TEAM_ONBOARDING_STEP',
  CREATE_PROFILE_ONBOARDING_STEP = 'CREATE_PROFILE_ONBOARDING_STEP',
}

export type OnboardingKeyValueTypeMap = {
  [OnboardingStepKeys.SYNC_EMAIL_ONBOARDING_STEP]: OnboardingStepValues;
  [OnboardingStepKeys.DISPLAY_INVITE_TEAM_ONBOARDING_STEP]: OnboardingStepBooleanValues;
  [OnboardingStepKeys.CREATE_PROFILE_ONBOARDING_STEP]: OnboardingStepBooleanValues;
};

@Injectable()
export class OnboardingService {
  constructor(
    private readonly billingWorkspaceService: BillingWorkspaceService,
    private readonly userVarsService: UserVarsService<OnboardingKeyValueTypeMap>,
    @InjectObjectMetadataRepository(ConnectedAccountWorkspaceEntity)
    private readonly connectedAccountRepository: ConnectedAccountRepository,
  ) {}

  private async isSubscriptionIncompleteOnboardingStatus(user: User) {
    const isBillingEnabledForWorkspace =
      await this.billingWorkspaceService.isBillingEnabledForWorkspace(
        user.defaultWorkspaceId,
      );

    if (!isBillingEnabledForWorkspace) {
      return false;
    }

    const currentBillingSubscription =
      await this.billingWorkspaceService.getCurrentBillingSubscription({
        workspaceId: user.defaultWorkspaceId,
      });

    return (
      !isDefined(currentBillingSubscription) ||
      currentBillingSubscription?.status === SubscriptionStatus.Incomplete
    );
  }

  private async isWorkspaceActivationOnboardingStatus(user: User) {
    return (
      user.defaultWorkspace.activationStatus ===
      WorkspaceActivationStatus.PENDING_CREATION
    );
  }

  private async isProfileCreationOnboardingStatus(user: User) {
    return (
      (await this.userVarsService.get({
        userId: user.id,
        workspaceId: user.defaultWorkspaceId,
        key: OnboardingStepKeys.CREATE_PROFILE_ONBOARDING_STEP,
      })) === OnboardingStepBooleanValues.TRUE
    );
  }

  private async isSyncEmailOnboardingStatus(user: User) {
    const syncEmailValue = await this.userVarsService.get({
      userId: user.id,
      workspaceId: user.defaultWorkspaceId,
      key: OnboardingStepKeys.SYNC_EMAIL_ONBOARDING_STEP,
    });
    const isSyncEmailSkipped = syncEmailValue === OnboardingStepValues.SKIPPED;
    const connectedAccounts =
      await this.connectedAccountRepository.getAllByUserId(
        user.id,
        user.defaultWorkspaceId,
      );

    return !isSyncEmailSkipped && !connectedAccounts?.length;
  }

  private async isInviteTeamOnboardingStatus(workspace: Workspace) {
    return (
      (await this.userVarsService.get({
        workspaceId: workspace.id,
        key: OnboardingStepKeys.DISPLAY_INVITE_TEAM_ONBOARDING_STEP,
      })) === OnboardingStepBooleanValues.TRUE
    );
  }

  async getOnboardingStatus(user: User) {
    if (await this.isSubscriptionIncompleteOnboardingStatus(user)) {
      return OnboardingStatus.PLAN_REQUIRED;
    }

    if (await this.isWorkspaceActivationOnboardingStatus(user)) {
      return OnboardingStatus.WORKSPACE_ACTIVATION;
    }

    if (await this.isProfileCreationOnboardingStatus(user)) {
      return OnboardingStatus.PROFILE_CREATION;
    }

    if (await this.isSyncEmailOnboardingStatus(user)) {
      return OnboardingStatus.SYNC_EMAIL;
    }

    if (await this.isInviteTeamOnboardingStatus(user.defaultWorkspace)) {
      return OnboardingStatus.INVITE_TEAM;
    }

    return OnboardingStatus.COMPLETED;
  }

  async skipInviteTeamOnboardingStep(workspaceId: string) {
    await this.userVarsService.delete({
      workspaceId,
      key: OnboardingStepKeys.DISPLAY_INVITE_TEAM_ONBOARDING_STEP,
    });
  }

  async skipSyncEmailOnboardingStep(userId: string, workspaceId: string) {
    await this.userVarsService.set({
      userId,
      workspaceId,
      key: OnboardingStepKeys.SYNC_EMAIL_ONBOARDING_STEP,
      value: OnboardingStepValues.SKIPPED,
    });
  }
}
