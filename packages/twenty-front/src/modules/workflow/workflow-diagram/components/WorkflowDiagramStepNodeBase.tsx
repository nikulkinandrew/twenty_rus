import { assertUnreachable } from '@/workflow/utils/assertUnreachable';
import { WorkflowDiagramBaseStepNode } from '@/workflow/workflow-diagram/components/WorkflowDiagramBaseStepNode';
import { WorkflowDiagramStepNodeData } from '@/workflow/workflow-diagram/types/WorkflowDiagram';
import { getWorkflowNodeIcon } from '@/workflow/workflow-diagram/utils/getWorkflowNodeIcon';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

const StyledStepNodeLabelIconContainer = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.transparent.light};
  border-radius: ${({ theme }) => theme.spacing(1)};
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(1)};
`;

export const WorkflowDiagramStepNodeBase = ({
  data,
  RightFloatingElement,
}: {
  data: WorkflowDiagramStepNodeData;
  RightFloatingElement?: React.ReactNode;
}) => {
  const theme = useTheme();

  const Icon = getWorkflowNodeIcon(data);

  const renderStepIcon = () => {
    switch (data.nodeType) {
      case 'trigger': {
        switch (data.triggerType) {
          case 'DATABASE_EVENT': {
            return (
              <StyledStepNodeLabelIconContainer>
                <Icon
                  size={theme.icon.size.lg}
                  color={theme.font.color.tertiary}
                />
              </StyledStepNodeLabelIconContainer>
            );
          }
          case 'MANUAL': {
            return (
              <StyledStepNodeLabelIconContainer>
                <Icon
                  size={theme.icon.size.lg}
                  color={theme.font.color.tertiary}
                />
              </StyledStepNodeLabelIconContainer>
            );
          }
        }

        return assertUnreachable(data.triggerType);
      }
      case 'action': {
        switch (data.actionType) {
          case 'CODE': {
            return (
              <StyledStepNodeLabelIconContainer>
                <Icon size={theme.icon.size.lg} color={theme.color.orange} />
              </StyledStepNodeLabelIconContainer>
            );
          }
          case 'SEND_EMAIL': {
            return (
              <StyledStepNodeLabelIconContainer>
                <Icon size={theme.icon.size.lg} color={theme.color.blue} />
              </StyledStepNodeLabelIconContainer>
            );
          }
          case 'CREATE_RECORD':
          case 'UPDATE_RECORD':
          case 'DELETE_RECORD': {
            return (
              <StyledStepNodeLabelIconContainer>
                <Icon
                  size={theme.icon.size.lg}
                  color={theme.font.color.tertiary}
                  stroke={theme.icon.stroke.sm}
                />
              </StyledStepNodeLabelIconContainer>
            );
          }
        }
      }
    }

    return assertUnreachable(data);
  };

  return (
    <WorkflowDiagramBaseStepNode
      name={data.name}
      nodeType={data.nodeType}
      Icon={renderStepIcon()}
      RightFloatingElement={RightFloatingElement}
    />
  );
};
