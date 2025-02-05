import { WorkflowCodeActionInput } from '@/workflow/types/workflow-actions/code/workflow-code-action-input';
import { BaseWorkflowActionSettings } from '@/workflow/types/workflow-actions/workflow-action-settings';

export type WorkflowCodeActionSettings = BaseWorkflowActionSettings & {
  input: WorkflowCodeActionInput;
};
