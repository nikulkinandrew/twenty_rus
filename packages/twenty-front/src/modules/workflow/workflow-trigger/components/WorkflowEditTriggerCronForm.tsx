import { WorkflowCronTrigger } from '@/workflow/types/Workflow';
import { useIcons } from 'twenty-ui';
import { useTheme } from '@emotion/react';
import { Select } from '@/ui/input/components/Select';
import { WorkflowStepHeader } from '@/workflow/workflow-steps/components/WorkflowStepHeader';
import { WorkflowStepBody } from '@/workflow/workflow-steps/components/WorkflowStepBody';
import { getTriggerIcon } from '@/workflow/workflow-trigger/utils/getTriggerIcon';
import { isDefined } from 'twenty-shared';
import { getTriggerDefaultLabel } from '@/workflow/workflow-trigger/utils/getTriggerLabel';
import { CRON_TRIGGER_INTERVAL_OPTIONS } from '@/workflow/workflow-trigger/constants/CronTriggerIntervalOptions';
import cron from 'cron-validate';
import { useState } from 'react';
import { FormTextFieldInput } from '@/object-record/record-field/form-types/components/FormTextFieldInput';
import { FormNumberFieldInput } from '@/object-record/record-field/form-types/components/FormNumberFieldInput';
import { isNumber } from '@sniptt/guards';
import { getCronTriggerDefaultSettings } from '@/workflow/workflow-trigger/utils/getCronTriggerDefaultSettings';

type WorkflowEditTriggerCronFormProps = {
  trigger: WorkflowCronTrigger;
  triggerOptions:
    | {
        readonly: true;
        onTriggerUpdate?: undefined;
      }
    | {
        readonly?: false;
        onTriggerUpdate: (trigger: WorkflowCronTrigger) => void;
      };
};

export const WorkflowEditTriggerCronForm = ({
  trigger,
  triggerOptions,
}: WorkflowEditTriggerCronFormProps) => {
  const theme = useTheme();
  const [errorMessages, setErrorMessages] = useState<{
    [key: number]: string | undefined;
  }>({});

  const { getIcon } = useIcons();

  const headerIcon = getTriggerIcon({
    type: 'CRON',
  });

  const defaultLabel =
    getTriggerDefaultLabel({
      type: 'CRON',
    }) ?? '';

  const headerTitle = isDefined(trigger.name) ? trigger.name : defaultLabel;

  const headerType = 'Trigger';

  return (
    <>
      <WorkflowStepHeader
        onTitleChange={(newName: string) => {
          if (triggerOptions.readonly === true) {
            return;
          }

          triggerOptions.onTriggerUpdate({
            ...trigger,
            name: newName,
          });
        }}
        Icon={getIcon(headerIcon)}
        iconColor={theme.font.color.tertiary}
        initialTitle={headerTitle}
        headerType={headerType}
      />
      <WorkflowStepBody>
        <Select
          dropdownId="workflow-edit-cron-trigger-interval"
          label="Trigger interval"
          fullWidth
          disabled={triggerOptions.readonly}
          value={trigger.settings.type}
          options={CRON_TRIGGER_INTERVAL_OPTIONS}
          onChange={(newTriggerType) => {
            if (triggerOptions.readonly === true) {
              return;
            }

            triggerOptions.onTriggerUpdate({
              ...trigger,
              settings: getCronTriggerDefaultSettings(newTriggerType),
            });
          }}
          withSearchInput
        />
        {trigger.settings.type === 'CUSTOM' && (
          <FormTextFieldInput
            label="Expression"
            placeholder="0 0 */1 * * *"
            error={errorMessages[0]}
            hint="Format: [Second] [Minute] [Hour] [Day of Month] [Month] [Day of Week]"
            readonly={triggerOptions.readonly}
            defaultValue={trigger.settings.pattern}
            onPersist={(newPattern: string) => {
              if (triggerOptions.readonly === true) {
                return;
              }

              const cronValidator = cron(newPattern, {
                override: {
                  useSeconds: true,
                },
              });

              if (cronValidator.isError()) {
                setErrorMessages({
                  0: `Invalid cron pattern, ${cronValidator
                    .getError()[0]
                    .replace(/\. \(Input cron:.*$/, '')}`,
                });
                return;
              }

              setErrorMessages({});

              triggerOptions.onTriggerUpdate({
                ...trigger,
                settings: {
                  ...trigger.settings,
                  type: 'CUSTOM',
                  pattern: newPattern,
                },
              });
            }}
          />
        )}
        {trigger.settings.type === 'HOURS' && (
          <>
            <FormNumberFieldInput
              label="Hours Between Triggers"
              error={errorMessages[0]}
              defaultValue={trigger.settings.schedule.hour}
              onPersist={(newHour) => {
                if (triggerOptions.readonly === true) {
                  return;
                }

                if (!isNumber(newHour)) {
                  return;
                }

                if (newHour <= 0) {
                  setErrorMessages((prev) => ({
                    ...prev,
                    0: `Invalid hour value '${newHour}'. Should be integer greater than 1`,
                  }));
                  return;
                }

                setErrorMessages((prev) => {
                  delete prev[0];
                  return prev;
                });

                triggerOptions.onTriggerUpdate({
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    type: 'HOURS',
                    schedule: {
                      hour: newHour,
                      minute:
                        trigger.settings.type === 'HOURS'
                          ? trigger.settings.schedule.minute
                          : 0,
                    },
                  },
                });
              }}
              placeholder="Enter number greater that 1"
              readonly={triggerOptions.readonly}
            />
            <FormNumberFieldInput
              label="Trigger at Minute"
              error={errorMessages[1]}
              defaultValue={trigger.settings.schedule.minute}
              onPersist={(newMinute) => {
                if (triggerOptions.readonly === true) {
                  return;
                }

                if (!isNumber(newMinute)) {
                  return;
                }

                if (newMinute < 0 || newMinute > 59) {
                  setErrorMessages((prev) => ({
                    ...prev,
                    1: `Invalid minute value '${newMinute}'. Should be integer between 0 and 59`,
                  }));
                  return;
                }

                setErrorMessages((prev) => {
                  delete prev[1];
                  return prev;
                });

                triggerOptions.onTriggerUpdate({
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    type: 'HOURS',
                    schedule: {
                      hour:
                        trigger.settings.type === 'HOURS'
                          ? trigger.settings.schedule.hour
                          : 1,
                      minute: newMinute,
                    },
                  },
                });
              }}
              placeholder="Enter number between 0 and 59"
              readonly={triggerOptions.readonly}
            />
          </>
        )}
        {trigger.settings.type === 'MINUTES' && (
          <FormNumberFieldInput
            label="Minutes Between Triggers"
            error={errorMessages[0]}
            defaultValue={trigger.settings.schedule.minute}
            onPersist={(newMinute) => {
              if (triggerOptions.readonly === true) {
                return;
              }

              if (!isNumber(newMinute)) {
                return;
              }

              if (newMinute <= 0) {
                setErrorMessages({
                  0: `Invalid minute value '${newMinute}'. Should be integer greater than 1`,
                });
                return;
              }

              setErrorMessages({});

              triggerOptions.onTriggerUpdate({
                ...trigger,
                settings: {
                  ...trigger.settings,
                  type: 'MINUTES',
                  schedule: {
                    minute: newMinute,
                  },
                },
              });
            }}
            placeholder="Enter number greater that 1"
            readonly={triggerOptions.readonly}
          />
        )}
        {trigger.settings.type === 'SECONDS' && (
          <FormNumberFieldInput
            label="Seconds Between Triggers"
            error={errorMessages[0]}
            defaultValue={trigger.settings.schedule.second}
            onPersist={(newSecond) => {
              if (triggerOptions.readonly === true) {
                return;
              }

              if (!isNumber(newSecond)) {
                return;
              }

              if (newSecond <= 9) {
                setErrorMessages({
                  0: `Invalid second value '${newSecond}'. Should be integer greater than 10`,
                });
                return;
              }

              setErrorMessages({});

              triggerOptions.onTriggerUpdate({
                ...trigger,
                settings: {
                  ...trigger.settings,
                  type: 'SECONDS',
                  schedule: {
                    second: newSecond,
                  },
                },
              });
            }}
            placeholder="Enter number greater that 10"
            readonly={triggerOptions.readonly}
          />
        )}
      </WorkflowStepBody>
    </>
  );
};
