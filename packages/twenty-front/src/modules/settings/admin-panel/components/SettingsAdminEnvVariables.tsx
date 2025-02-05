import { SettingsAdminEnvVariablesTable } from '@/settings/admin-panel/components/SettingsAdminEnvVariablesTable';
import styled from '@emotion/styled';
import { H1Title, H1TitleFontColor, Section } from 'twenty-ui';
import { useGetEnvironmentVariablesGroupedQuery } from '~/generated/graphql';

const StyledGroupContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const StyledSubGroupContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  padding: ${({ theme }) => theme.spacing(4)};
`;

const StyledGroupVariablesContainer = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-left: ${({ theme }) => theme.spacing(4)};
  padding-right: ${({ theme }) => theme.spacing(4)};
`;

const StyledSubGroupTitle = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledSubGroupDescription = styled.div``;

const StyledGroupDescription = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const SettingsAdminEnvVariables = () => {
  const { data: environmentVariables } = useGetEnvironmentVariablesGroupedQuery(
    {
      fetchPolicy: 'network-only',
    },
  );

  return (
    <Section>
      {environmentVariables?.getEnvironmentVariablesGrouped.groups.map(
        (group) => (
          <StyledGroupContainer key={group.name}>
            <H1Title title={group.name} fontColor={H1TitleFontColor.Primary} />
            {group.description !== '' && (
              <StyledGroupDescription>
                {group.description}
              </StyledGroupDescription>
            )}
            {group.variables.length > 0 && (
              <StyledGroupVariablesContainer>
                <SettingsAdminEnvVariablesTable variables={group.variables} />
              </StyledGroupVariablesContainer>
            )}
            {group.subgroups.map((subgroup) => (
              <StyledSubGroupContainer key={subgroup.name}>
                <StyledSubGroupTitle>{subgroup.name}</StyledSubGroupTitle>
                {subgroup.description !== '' && (
                  <StyledSubGroupDescription>
                    {subgroup.description}
                  </StyledSubGroupDescription>
                )}
                <SettingsAdminEnvVariablesTable
                  variables={subgroup.variables}
                />
              </StyledSubGroupContainer>
            ))}
          </StyledGroupContainer>
        ),
      )}
    </Section>
  );
};
