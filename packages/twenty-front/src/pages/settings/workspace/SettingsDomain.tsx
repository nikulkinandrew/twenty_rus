import { getSettingsPagePath } from '@/settings/utils/getSettingsPagePath';
import { SettingsPath } from '@/types/SettingsPath';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLingui } from '@lingui/react/macro';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useRecoilState } from 'recoil';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { useNavigate } from 'react-router-dom';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import {
  FeatureFlagKey,
  useUpdateWorkspaceMutation,
} from '~/generated/graphql';
import { useRedirectToWorkspaceDomain } from '@/domain-manager/hooks/useRedirectToWorkspaceDomain';
import { SettingsHostname } from '~/pages/settings/workspace/SettingsHostname';
import { SettingsSubdomain } from '~/pages/settings/workspace/SettingsSubdomain';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';

export const SettingsDomain = () => {
  const navigate = useNavigate();
  const { t } = useLingui();

  const validationSchema = z
    .object({
      subdomain: z
        .string()
        .min(3, { message: t`Subdomain can not be shorter than 3 characters` })
        .max(30, { message: t`Subdomain can not be longer than 30 characters` })
        .regex(/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/, {
          message: t`Use letter, number and dash only. Start and finish with a letter or a number`,
        }),
    })
    .required();

  const { enqueueSnackBar } = useSnackBar();
  const [updateWorkspace] = useUpdateWorkspaceMutation();
  const { redirectToWorkspaceDomain } = useRedirectToWorkspaceDomain();

  const isCustomDomainEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IsCustomDomainEnabled,
  );

  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceState,
  );

  const form = useForm<{
    subdomain: string;
  }>({
    mode: 'onChange',
    delayError: 500,
    defaultValues: {
      subdomain: currentWorkspace?.subdomain ?? '',
    },
    resolver: zodResolver(validationSchema),
  });

  const subdomainValue = form.watch('subdomain');

  const handleSave = async () => {
    try {
      const values = form.getValues();

      if (!values || !form.formState.isValid || !currentWorkspace) {
        throw new Error(t`Invalid form values`);
      }

      await updateWorkspace({
        variables: {
          input: {
            subdomain: values.subdomain,
          },
        },
      });

      setCurrentWorkspace({
        ...currentWorkspace,
        subdomain: values.subdomain,
      });

      redirectToWorkspaceDomain(values.subdomain, currentWorkspace.hostname);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === t`Subdomain already taken` ||
          error.message.endsWith(t`not allowed`))
      ) {
        form.control.setError('subdomain', {
          type: 'manual',
          message: (error as Error).message,
        });
        return;
      }

      enqueueSnackBar((error as Error).message, {
        variant: SnackBarVariant.Error,
      });
    }
  };

  return (
    <SubMenuTopBarContainer
      title={t`General`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPagePath(SettingsPath.Workspace),
        },
        {
          children: t`General`,
          href: getSettingsPagePath(SettingsPath.Workspace),
        },
        { children: t`Domain` },
      ]}
      actionButton={
        <SaveAndCancelButtons
          isSaveDisabled={
            !form.formState.isValid ||
            subdomainValue === currentWorkspace?.subdomain
          }
          onCancel={() => navigate(getSettingsPagePath(SettingsPath.Workspace))}
          onSave={handleSave}
        />
      }
    >
      <SettingsPageContainer>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...form}>
          {isCustomDomainEnabled && <SettingsHostname />}
          {!currentWorkspace?.hostname && <SettingsSubdomain />}
        </FormProvider>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
