import { useGetPublicWorkspaceDataBySubdomainQuery } from '~/generated/graphql';
import { isDefined } from '~/utils/isDefined';
import { useDefaultDomain } from '@/domain-manager/hooks/useDefaultDomain';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { authProvidersState } from '@/client-config/states/authProvidersState';
import { workspacePublicDataState } from '@/auth/states/workspacePublicDataState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useDomainBackToDefaultSubdomain } from '@/domain-manager/hooks/useDomainBackToDefaultSubdomain';
import { workspaceDomainState } from '@/auth/states/workspaceDomainState';

export const useGetPublicWorkspaceDataBySubdomain = () => {
  const { isDefaultDomain } = useDefaultDomain();
  const isMultiWorkspaceEnabled = useRecoilValue(isMultiWorkspaceEnabledState);
  const setAuthProviders = useSetRecoilState(authProvidersState);
  const workspacePublicData = useRecoilValue(workspacePublicDataState);
  const backToDefaultSubdomain = useDomainBackToDefaultSubdomain();
  const setWorkspacePublicDataState = useSetRecoilState(
    workspacePublicDataState,
  );
  const setWorkspaceDomain = useSetRecoilState(workspaceDomainState);
  const { loading } = useGetPublicWorkspaceDataBySubdomainQuery({
    skip:
      (isMultiWorkspaceEnabled && isDefaultDomain) ||
      isDefined(workspacePublicData),
    onCompleted: (data) => {
      setAuthProviders(data.getPublicWorkspaceDataBySubdomain.authProviders);
      setWorkspacePublicDataState(data.getPublicWorkspaceDataBySubdomain);
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      setWorkspaceDomain(null);
      backToDefaultSubdomain();
    },
  });

  return {
    loading,
  };
};
