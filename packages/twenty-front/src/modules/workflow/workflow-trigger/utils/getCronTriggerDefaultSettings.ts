import { CronTriggerInterval } from '@/workflow/workflow-trigger/constants/CronTriggerIntervalOptions';
import { WorkflowCronTrigger } from '@/workflow/types/Workflow';

const DEFAULT_CRON_PATTERN = '0 0 */1 * * *'; // Every hour

export const getCronTriggerDefaultSettings = (
  cronTriggerInterval: CronTriggerInterval,
): WorkflowCronTrigger['settings'] => {
  switch (cronTriggerInterval) {
    case 'HOURS':
      return {
        schedule: {
          hour: 1,
          minute: 0,
        },
        type: cronTriggerInterval,
        outputSchema: {},
      };
    case 'MINUTES':
      return {
        schedule: {
          minute: 1,
        },
        type: cronTriggerInterval,
        outputSchema: {},
      };
    case 'SECONDS':
      return {
        schedule: {
          second: 30,
        },
        type: cronTriggerInterval,
        outputSchema: {},
      };
    case 'CUSTOM':
      return {
        pattern: DEFAULT_CRON_PATTERN,
        type: cronTriggerInterval,
        outputSchema: {},
      };
    default:
      throw new Error('Invalid cron trigger interval');
  }
};
