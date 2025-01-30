import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { useBuildWorkspaceUrl } from '@/domain-manager/hooks/useBuildWorkspaceUrl';
import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { useRecoilValue } from 'recoil';

export const useRedirectToWorkspaceDomain = () => {
  const isMultiWorkspaceEnabled = useRecoilValue(isMultiWorkspaceEnabledState);
  const { buildWorkspaceUrl } = useBuildWorkspaceUrl();
  const { redirect } = useRedirect();

  const redirectToWorkspaceDomain = (
    endpoint: string,
    pathname?: string,
    searchParams?: Record<string, string | boolean>,
  ) => {
    if (!isMultiWorkspaceEnabled) return;
    redirect(buildWorkspaceUrl(endpoint, pathname, searchParams));
  };

  return {
    redirectToWorkspaceDomain,
  };
};
