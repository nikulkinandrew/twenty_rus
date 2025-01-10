import { hasRecordGroupsComponentSelector } from '@/object-record/record-group/states/selectors/hasRecordGroupsComponentSelector';
import { recordIndexEntityCountByGroupComponentFamilyState } from '@/object-record/record-index/states/recordIndexEntityCountByGroupComponentFamilyState';
import { recordIndexEntityCountNoGroupComponentFamilyState } from '@/object-record/record-index/states/recordIndexEntityCountNoGroupComponentFamilyState';
import { useRecoilComponentCallbackStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentCallbackStateV2';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { useRecoilCallback } from 'recoil';
import { isDefined } from '~/utils/isDefined';

export const useSetRecordIndexEntityCount = (viewBarComponentId?: string) => {
  const hasRecordGroup = useRecoilComponentValueV2(
    hasRecordGroupsComponentSelector,
  );

  const recordIndexEntityCountNoGroupFamilyState =
    useRecoilComponentCallbackStateV2(
      recordIndexEntityCountNoGroupComponentFamilyState,
      viewBarComponentId,
    );

  const recordIndexEntityCountByGroupFamilyState =
    useRecoilComponentCallbackStateV2(
      recordIndexEntityCountByGroupComponentFamilyState,
      viewBarComponentId,
    );

  const setRecordIndexEntityCount = useRecoilCallback(
    ({ set }) =>
      (count: number, recordGroupId?: string) => {
        if (hasRecordGroup) {
          if (!isDefined(recordGroupId)) {
            throw new Error('Record group ID is required');
          }

          set(recordIndexEntityCountByGroupFamilyState(recordGroupId), count);
        } else {
          set(recordIndexEntityCountNoGroupFamilyState, count);
        }
      },
    [
      hasRecordGroup,
      recordIndexEntityCountByGroupFamilyState,
      recordIndexEntityCountNoGroupFamilyState,
    ],
  );

  return {
    setRecordIndexEntityCount,
  };
};
