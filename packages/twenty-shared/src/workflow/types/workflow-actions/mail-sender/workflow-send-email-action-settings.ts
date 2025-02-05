import { WorkflowSendEmailActionInput } from 'src/workflow/types/workflow-actions/mail-sender/workflow-send-email-action-input';
import { BaseWorkflowActionSettings } from 'src/workflow/types/workflow-actions/workflow-action-settings';

export type WorkflowSendEmailActionSettings = BaseWorkflowActionSettings & {
  input: WorkflowSendEmailActionInput;
};
