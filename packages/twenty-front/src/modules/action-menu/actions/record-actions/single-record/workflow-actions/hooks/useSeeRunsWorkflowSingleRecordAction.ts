import { SingleRecordActionHookWithoutObjectMetadataItem } from '@/action-menu/actions/types/SingleRecordActionHook';
import { CoreObjectNamePlural } from '@/object-metadata/types/CoreObjectNamePlural';
import { ViewFilterOperand } from '@/views/types/ViewFilterOperand';
import { useWorkflowWithCurrentVersion } from '@/workflow/hooks/useWorkflowWithCurrentVersion';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { isDefined } from 'twenty-ui';

export const useSeeRunsWorkflowSingleRecordAction: SingleRecordActionHookWithoutObjectMetadataItem =
  ({ recordId }) => {
    const workflowWithCurrentVersion = useWorkflowWithCurrentVersion(recordId);

    const navigate = useNavigate();

    const shouldBeRegistered = isDefined(workflowWithCurrentVersion);

    const onClick = () => {
      if (!shouldBeRegistered) {
        return;
      }

      const filterQueryParams = {
        filter: {
          workflow: {
            [ViewFilterOperand.Is]: {
              selectedRecordIds: [workflowWithCurrentVersion.id],
            },
          },
        },
      };
      const filterLinkHref = `/objects/${CoreObjectNamePlural.WorkflowRun}?${qs.stringify(
        filterQueryParams,
      )}`;

      navigate(filterLinkHref);
    };

    return {
      shouldBeRegistered,
      onClick,
    };
  };
