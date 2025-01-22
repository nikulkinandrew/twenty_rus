import { useRightDrawer } from '@/ui/layout/right-drawer/hooks/useRightDrawer';
import { RightDrawerPages } from '@/ui/layout/right-drawer/types/RightDrawerPages';
import { useGetUpdatableWorkflowVersion } from '@/workflow/hooks/useGetUpdatableWorkflowVersion';
import { workflowLastCreatedStepIdState } from '@/workflow/states/workflowLastCreatedStepIdState';
import {
  WorkflowStepType,
  WorkflowWithCurrentVersion,
} from '@/workflow/types/Workflow';
import { workflowSelectedNodeState } from '@/workflow/workflow-diagram/states/workflowSelectedNodeState';
import { getWorkflowStepTypeIcon } from '@/workflow/workflow-diagram/utils/getWorkflowStepTypeIcon';
import { useCreateWorkflowVersionStep } from '@/workflow/workflow-steps/hooks/useCreateWorkflowVersionStep';
import { workflowCreateStepFromParentStepIdState } from '@/workflow/workflow-steps/states/workflowCreateStepFromParentStepIdState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isDefined } from 'twenty-ui';

export const useCreateStep = ({
  workflow,
}: {
  workflow: WorkflowWithCurrentVersion;
}) => {
  const { createWorkflowVersionStep } = useCreateWorkflowVersionStep();
  const setWorkflowSelectedNode = useSetRecoilState(workflowSelectedNodeState);
  const setWorkflowLastCreatedStepId = useSetRecoilState(
    workflowLastCreatedStepIdState,
  );

  const workflowCreateStepFromParentStepId = useRecoilValue(
    workflowCreateStepFromParentStepIdState,
  );

  const { getUpdatableWorkflowVersion } = useGetUpdatableWorkflowVersion();

  const { openRightDrawer } = useRightDrawer();

  const createStep = async (newStepType: WorkflowStepType) => {
    if (!isDefined(workflowCreateStepFromParentStepId)) {
      throw new Error('Select a step to create a new step from first.');
    }

    const workflowVersionId = await getUpdatableWorkflowVersion(workflow);

    const createdStep = (
      await createWorkflowVersionStep({
        workflowVersionId,
        stepType: newStepType,
      })
    )?.data?.createWorkflowVersionStep;

    if (!createdStep) {
      return;
    }

    setWorkflowSelectedNode(createdStep.id);
    setWorkflowLastCreatedStepId(createdStep.id);

    openRightDrawer(RightDrawerPages.WorkflowStepEdit, {
      title: createdStep.name,
      Icon: getWorkflowStepTypeIcon(createdStep.type as WorkflowStepType),
    });
  };

  return {
    createStep,
  };
};
