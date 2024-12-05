import { WorkflowStepType } from '@/workflow/types/Workflow';
import {
  IconAddressBook,
  IconComponent,
  IconSettingsAutomation,
} from 'twenty-ui';

export const ACTIONS: Array<{
  label: string;
  type: WorkflowStepType;
  icon: IconComponent;
}> = [
  {
    label: 'Serverless Function',
    type: 'CODE',
    icon: IconSettingsAutomation,
  },
  {
    label: 'Send Email',
    type: 'SEND_EMAIL',
    icon: IconSettingsAutomation,
  },
  {
    label: 'Create Record',
    type: 'RECORD_CRUD.CREATE',
    icon: IconAddressBook,
  },
  {
    label: 'Update Record',
    type: 'RECORD_CRUD.UPDATE',
    icon: IconAddressBook,
  },
  {
    label: 'Delete Record',
    type: 'RECORD_CRUD.DELETE',
    icon: IconAddressBook,
  },
];
