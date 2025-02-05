import {
    WorkflowCreateRecordActionInput,
    WorkflowDeleteRecordActionInput,
    WorkflowFindRecordsActionInput,
    WorkflowUpdateRecordActionInput,
} from '@/workflow/types/workflow-actions/record-crud/workflow-record-crud-action-input';
import { BaseWorkflowActionSettings } from '@/workflow/types/workflow-actions/workflow-action-settings';

export type WorkflowCreateRecordActionSettings = BaseWorkflowActionSettings & {
  input: WorkflowCreateRecordActionInput;
};

export type WorkflowUpdateRecordActionSettings = BaseWorkflowActionSettings & {
  input: WorkflowUpdateRecordActionInput;
};

export type WorkflowDeleteRecordActionSettings = BaseWorkflowActionSettings & {
  input: WorkflowDeleteRecordActionInput;
};

export type WorkflowFindRecordsActionSettings = BaseWorkflowActionSettings & {
  input: WorkflowFindRecordsActionInput;
};
