import { WorkflowSendEmailActionInput } from '@/workflow/types/workflow-actions/mail-sender/workflow-send-email-action-input';
import { BaseWorkflowActionSettings } from '@/workflow/types/workflow-actions/workflow-action-settings';

export type WorkflowSendEmailActionSettings = BaseWorkflowActionSettings & {
  input: WorkflowSendEmailActionInput;
};
