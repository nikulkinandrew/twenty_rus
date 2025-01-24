import { WorkflowTriggerType } from '@/workflow/types/Workflow';

export const OTHER_TRIGGER_TYPES: Array<{
  defaultLabel: string;
  type: WorkflowTriggerType;
  icon: string;
}> = [
  {
    defaultLabel: 'Launch manually',
    type: 'MANUAL',
    icon: 'IconHandMove',
  },
];
