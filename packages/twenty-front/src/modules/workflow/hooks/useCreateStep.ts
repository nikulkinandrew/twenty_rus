import { useRightDrawer } from '@/ui/layout/right-drawer/hooks/useRightDrawer';
import { RightDrawerPages } from '@/ui/layout/right-drawer/types/RightDrawerPages';
import { useCreateWorkflowVersionStep } from '@/workflow/hooks/useCreateWorkflowVersionStep';
import { useGetUpdatableWorkflowVersion } from '@/workflow/hooks/useGetUpdatableWorkflowVersion';
import { workflowCreateStepFromParentStepIdState } from '@/workflow/states/workflowCreateStepFromParentStepIdState';
import { workflowLastCreatedStepIdState } from '@/workflow/states/workflowLastCreatedStepIdState';
import { workflowSelectedNodeState } from '@/workflow/states/workflowSelectedNodeState';
import {
  WorkflowStepType,
  WorkflowWithCurrentVersion,
} from '@/workflow/types/Workflow';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isDefined } from 'twenty-ui';

export const useCreateStep = ({
  workflow,
}: {
  workflow: WorkflowWithCurrentVersion;
}) => {
  const { openRightDrawer } = useRightDrawer();
  const { createWorkflowVersionStep } = useCreateWorkflowVersionStep();
  const setWorkflowSelectedNode = useSetRecoilState(workflowSelectedNodeState);
  const setWorkflowLastCreatedStepId = useSetRecoilState(
    workflowLastCreatedStepIdState,
  );

  const workflowCreateStepFromParentStepId = useRecoilValue(
    workflowCreateStepFromParentStepIdState,
  );

  const { getUpdatableWorkflowVersion } = useGetUpdatableWorkflowVersion();

  const createStep = async (newStepType: WorkflowStepType) => {
    if (!isDefined(workflowCreateStepFromParentStepId)) {
      throw new Error('Select a step to create a new step from first.');
    }

    const workflowVersion = await getUpdatableWorkflowVersion(workflow);

    const createdStep = (
      await createWorkflowVersionStep({
        workflowVersionId: workflowVersion.id,
        stepType: newStepType,
      })
    )?.data?.createWorkflowVersionStep;

    if (!createdStep) {
      return;
    }

    setWorkflowSelectedNode(createdStep.id);
    setWorkflowLastCreatedStepId(createdStep.id);
    openRightDrawer(RightDrawerPages.WorkflowStepEdit);
  };

  return {
    createStep,
  };
};
