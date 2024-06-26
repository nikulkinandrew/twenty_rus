import { useOnboardingStatus } from '@/auth/hooks/useOnboardingStatus';
import { AppPath } from '@/types/AppPath';
import { SettingsPath } from '@/types/SettingsPath';
import { OnboardingStatus } from '~/generated/graphql';
import { useDefaultHomePagePath } from '~/hooks/useDefaultHomePagePath';
import { useIsMatchingLocation } from '~/hooks/useIsMatchingLocation';

export const usePageChangeEffectNavigateLocation = () => {
  const isMatchingLocation = useIsMatchingLocation();
  const onboardingStatus = useOnboardingStatus();
  const { defaultHomePagePath } = useDefaultHomePagePath();

  const isMatchingOpenRoute =
    isMatchingLocation(AppPath.Invite) ||
    isMatchingLocation(AppPath.ResetPassword);

  const isMatchingOngoingUserCreationRoute =
    isMatchingOpenRoute ||
    isMatchingLocation(AppPath.SignInUp) ||
    isMatchingLocation(AppPath.Verify);

  const isMatchingOnboardingRoute =
    isMatchingOngoingUserCreationRoute ||
    isMatchingLocation(AppPath.CreateWorkspace) ||
    isMatchingLocation(AppPath.CreateProfile) ||
    isMatchingLocation(AppPath.SyncEmails) ||
    isMatchingLocation(AppPath.InviteTeam) ||
    isMatchingLocation(AppPath.PlanRequired) ||
    isMatchingLocation(AppPath.PlanRequiredSuccess);

  if (isMatchingOpenRoute) {
    return;
  }

  if (!onboardingStatus && !isMatchingOngoingUserCreationRoute) {
    return AppPath.SignInUp;
  }

  if (
    onboardingStatus === OnboardingStatus.PlanRequired &&
    !isMatchingLocation(AppPath.PlanRequired)
  ) {
    return AppPath.PlanRequired;
  }

  if (
    onboardingStatus === OnboardingStatus.SubscriptionUnpaid &&
    !isMatchingLocation(AppPath.SettingsCatchAll)
  ) {
    return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
      SettingsPath.Billing
    }`;
  }

  if (
    (onboardingStatus === OnboardingStatus.SubscriptionUnpaid ||
      onboardingStatus === OnboardingStatus.SubscriptionCanceled) &&
    !(
      isMatchingLocation(AppPath.SettingsCatchAll) ||
      isMatchingLocation(AppPath.PlanRequired)
    )
  ) {
    return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
      SettingsPath.Billing
    }`;
  }

  if (
    onboardingStatus === OnboardingStatus.WorkspaceActivation &&
    !isMatchingLocation(AppPath.CreateWorkspace) &&
    !isMatchingLocation(AppPath.PlanRequiredSuccess)
  ) {
    return AppPath.CreateWorkspace;
  }

  if (
    onboardingStatus === OnboardingStatus.ProfileCreation &&
    !isMatchingLocation(AppPath.CreateProfile)
  ) {
    return AppPath.CreateProfile;
  }

  if (
    onboardingStatus === OnboardingStatus.SyncEmail &&
    !isMatchingLocation(AppPath.SyncEmails)
  ) {
    return AppPath.SyncEmails;
  }

  if (
    onboardingStatus === OnboardingStatus.InviteTeam &&
    !isMatchingLocation(AppPath.InviteTeam)
  ) {
    return AppPath.InviteTeam;
  }

  if (
    (onboardingStatus === OnboardingStatus.Completed ||
      onboardingStatus === OnboardingStatus.SubscriptionPastDue) &&
    isMatchingOnboardingRoute
  ) {
    return defaultHomePagePath;
  }

  if (
    onboardingStatus === OnboardingStatus.CompletedWithoutSubscription &&
    isMatchingOnboardingRoute &&
    !isMatchingLocation(AppPath.PlanRequired)
  ) {
    return defaultHomePagePath;
  }

  if (isMatchingLocation(AppPath.Index)) {
    return defaultHomePagePath;
  }

  return;
};
