import { useSelectedRecordIdOrThrow } from '@/action-menu/actions/record-actions/single-record/hooks/useSelectedRecordIdOrThrow';
import { ActionHookWithoutObjectMetadataItem } from '@/action-menu/actions/types/ActionHook';
import { CoreObjectNamePlural } from '@/object-metadata/types/CoreObjectNamePlural';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { AppPath } from '@/types/AppPath';
import { ViewFilterOperand } from '@/views/types/ViewFilterOperand';
import { useWorkflowWithCurrentVersion } from '@/workflow/hooks/useWorkflowWithCurrentVersion';
import { useRecoilValue } from 'recoil';
import { isDefined } from 'twenty-shared';
import { useNavigateApp } from '~/hooks/useNavigateApp';

export const useSeeVersionsWorkflowVersionSingleRecordAction: ActionHookWithoutObjectMetadataItem =
  () => {
    const recordId = useSelectedRecordIdOrThrow();

    const workflowVersion = useRecoilValue(recordStoreFamilyState(recordId));

    const workflowWithCurrentVersion = useWorkflowWithCurrentVersion(
      workflowVersion?.workflowId,
    );

    const navigateApp = useNavigateApp();

    const shouldBeRegistered = isDefined(workflowWithCurrentVersion);

    const onClick = () => {
      if (!shouldBeRegistered) return;

      navigateApp(
        AppPath.RecordIndexPage,
        {
          objectNamePlural: CoreObjectNamePlural.WorkflowVersion,
        },
        {
          filter: {
            workflow: {
              [ViewFilterOperand.Is]: {
                selectedRecordIds: [workflowWithCurrentVersion.id],
              },
            },
          },
        },
      );
    };

    return {
      shouldBeRegistered,
      onClick,
    };
  };
