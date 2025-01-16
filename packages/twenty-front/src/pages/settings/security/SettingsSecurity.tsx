import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { H2Title, IconLock, Section, Tag } from 'twenty-ui';

import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsReadDocumentationButton } from '@/settings/developers/components/SettingsReadDocumentationButton';
import { SettingsSSOIdentitiesProvidersListCard } from '@/settings/security/components/SettingsSSOIdentitiesProvidersListCard';
import { SettingsSecurityOptionsList } from '@/settings/security/components/SettingsSecurityOptionsList';
import { getSettingsPagePath } from '@/settings/utils/getSettingsPagePath';
import { SettingsPath } from '@/types/SettingsPath';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(10)};
  min-height: 200px;
`;

const StyledSSOSection = styled(Section)`
  flex-shrink: 0;
`;

export const SettingsSecurity = () => {
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={t`Security`}
      actionButton={<SettingsReadDocumentationButton />}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPagePath(SettingsPath.Workspace),
        },
        { children: t`Security` },
      ]}
    >
      <SettingsPageContainer>
        <StyledMainContent>
          <StyledSSOSection>
            <H2Title
              title={t`SSO`}
              description={t`Configure an SSO connection`}
              adornment={
                <Tag
                  text={t`Enterprise`}
                  color={'transparent'}
                  Icon={IconLock}
                  variant={'border'}
                />
              }
            />
            <SettingsSSOIdentitiesProvidersListCard />
          </StyledSSOSection>
          <Section>
            <StyledContainer>
              <H2Title
                title={t`Authentication`}
                description={t`Customize your workspace security`}
              />
              <SettingsSecurityOptionsList />
            </StyledContainer>
          </Section>
        </StyledMainContent>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
