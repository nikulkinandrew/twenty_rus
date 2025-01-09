import styled from '@emotion/styled';
import { Avatar, OverflowingTextWithTooltip } from 'twenty-ui';

import { WorkspaceMember } from '@/workspace-member/types/WorkspaceMember';

const StyledContainer = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.medium};
  display: flex;
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(0)};
  padding: ${({ theme }) => theme.spacing(3)};

  &:last-child {
    border-bottom: none;
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  margin-left: ${({ theme }) => theme.spacing(3)};
  overflow: auto;
`;

const StyledEmailText = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
`;

type WorkspaceMemberCardProps = {
  workspaceMember: WorkspaceMember;
  accessory?: React.ReactNode;
};

export const WorkspaceMemberCard = ({
  workspaceMember,
  accessory,
}: WorkspaceMemberCardProps) => (
  <StyledContainer>
    <Avatar
      avatarUrl={workspaceMember.avatarUrl}
      placeholderColorSeed={workspaceMember.id}
      placeholder={workspaceMember.name.firstName || ''}
      type="rounded"
      size="lg"
    />
    <StyledContent>
      <OverflowingTextWithTooltip
        text={
          workspaceMember.name.firstName + ' ' + workspaceMember.name.lastName
        }
      />
      <StyledEmailText>{workspaceMember.userEmail}</StyledEmailText>
    </StyledContent>
    {accessory}
  </StyledContainer>
);
