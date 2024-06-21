import { useEffect } from 'react';
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

import { objectRecordsIdsMultiSelectState } from '@/activities/states/objectRecordsIdsMultiSelectState';
import { objectRecordMultiSelectCheckedRecordsIdsState } from '@/object-record/record-field/states/objectRecordMultiSelectCheckedRecordsIdsState';
import { objectRecordMultiSelectFamilyState } from '@/object-record/record-field/states/objectRecordMultiSelectFamilyState';
import { recordMultiSelectIsLoadingState } from '@/object-record/record-field/states/recordMultiSelectIsLoadingState';
import { useRelationPickerScopedStates } from '@/object-record/relation-picker/hooks/internal/useRelationPickerScopedStates';
import {
  ObjectRecordForSelect,
  SelectedObjectRecordId,
  useMultiObjectSearch,
} from '@/object-record/relation-picker/hooks/useMultiObjectSearch';
import { RelationPickerScopeInternalContext } from '@/object-record/relation-picker/scopes/scope-internal-context/RelationPickerScopeInternalContext';
import { useAvailableScopeIdOrThrow } from '@/ui/utilities/recoil-scope/scopes-internal/hooks/useAvailableScopeId';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';

export const MultiRecordsEffect = ({
  selectedObjectRecordIds,
}: {
  selectedObjectRecordIds: SelectedObjectRecordId[];
}) => {
  const [objectRecordsIdsMultiSelect, setObjectRecordsIdsMultiSelect] =
    useRecoilState(objectRecordsIdsMultiSelectState);

  const setRecordMultiSelectIsLoading = useSetRecoilState(
    recordMultiSelectIsLoadingState,
  );

  const relationPickerScopedId = useAvailableScopeIdOrThrow(
    RelationPickerScopeInternalContext,
  );

  const { relationPickerSearchFilterState } = useRelationPickerScopedStates({
    relationPickerScopedId,
  });
  const relationPickerSearchFilter = useRecoilValue(
    relationPickerSearchFilterState,
  );
  const { filteredSelectedObjectRecords, loading, objectRecordsToSelect } =
    useMultiObjectSearch({
      searchFilterValue: relationPickerSearchFilter,
      selectedObjectRecordIds,
      excludedObjectRecordIds: [],
      limit: 10,
    });

  const [
    objectRecordMultiSelectCheckedRecordsIds,
    setObjectRecordMultiSelectCheckedRecordsIds,
  ] = useRecoilState(objectRecordMultiSelectCheckedRecordsIdsState);

  const updateRecords = useRecoilCallback(
    ({ snapshot, set }) =>
      (newRecords: ObjectRecordForSelect[]) => {
        for (const newRecord of newRecords) {
          const currentRecord = snapshot
            .getLoadable(
              objectRecordMultiSelectFamilyState(newRecord.record.id),
            )
            .getValue();

          const newRecordWithSelected = {
            ...newRecord,
            selected: objectRecordMultiSelectCheckedRecordsIds.some(
              (checkedRecordId) => checkedRecordId === newRecord.record.id,
            ),
          };

          if (
            !isDeeplyEqual(
              newRecordWithSelected.selected,
              currentRecord?.selected,
            )
          ) {
            set(
              objectRecordMultiSelectFamilyState(
                newRecordWithSelected.record.id,
              ),
              newRecordWithSelected,
            );
          }
        }
      },
    [objectRecordMultiSelectCheckedRecordsIds],
  );

  useEffect(() => {
    const allRecords = [
      ...(filteredSelectedObjectRecords ?? []),
      ...(objectRecordsToSelect ?? []),
    ];
    updateRecords(allRecords);
    const allRecordsIds = allRecords.map((record) => record.record.id);
    if (!isDeeplyEqual(allRecordsIds, objectRecordsIdsMultiSelect)) {
      setObjectRecordsIdsMultiSelect(allRecordsIds);
    }
  }, [
    filteredSelectedObjectRecords,
    objectRecordsIdsMultiSelect,
    objectRecordsToSelect,
    setObjectRecordsIdsMultiSelect,
    updateRecords,
  ]);

  useEffect(() => {
    setObjectRecordMultiSelectCheckedRecordsIds(
      selectedObjectRecordIds.map((rec) => rec.id),
    );
  }, [selectedObjectRecordIds, setObjectRecordMultiSelectCheckedRecordsIds]);

  useEffect(() => {
    setRecordMultiSelectIsLoading(loading);
  }, [loading, setRecordMultiSelectIsLoading]);

  return <></>;
};
