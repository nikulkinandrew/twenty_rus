import { WorkflowCodeActionInput } from 'src/workflow/types/workflow-actions/code/workflow-code-action-input';
import { BaseWorkflowActionSettings } from 'src/workflow/types/workflow-actions/workflow-action-settings';

export type WorkflowCodeActionSettings = BaseWorkflowActionSettings & {
  input: WorkflowCodeActionInput;
};
