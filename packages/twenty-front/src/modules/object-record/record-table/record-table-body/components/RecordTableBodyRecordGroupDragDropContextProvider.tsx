import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { ReactNode, useContext } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';

import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { getDraggedRecordPosition } from '@/object-record/record-board/utils/getDraggedRecordPosition';
import { recordGroupDefinitionFamilyState } from '@/object-record/record-group/states/recordGroupDefinitionFamilyState';
import { recordIndexAllRecordIdsComponentSelector } from '@/object-record/record-index/states/selectors/recordIndexAllRecordIdsComponentSelector';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { RecordTableContext } from '@/object-record/record-table/contexts/RecordTableContext';
import { isRemoveSortingModalOpenState } from '@/object-record/record-table/states/isRemoveSortingModalOpenState';
import { useRecoilComponentCallbackStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentCallbackStateV2';
import { getSnapshotValue } from '@/ui/utilities/state/utils/getSnapshotValue';
import { useGetCurrentView } from '@/views/hooks/useGetCurrentView';
import { isDefined } from '~/utils/isDefined';

export const RecordTableBodyRecordGroupDragDropContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { objectNameSingular, recordTableId, objectMetadataItem } =
    useContext(RecordTableContext);

  const { updateOneRecord: updateOneRow } = useUpdateOneRecord({
    objectNameSingular,
  });

  const { currentViewWithCombinedFiltersAndSorts } =
    useGetCurrentView(recordTableId);

  const viewSorts = currentViewWithCombinedFiltersAndSorts?.viewSorts || [];

  const setIsRemoveSortingModalOpenState = useSetRecoilState(
    isRemoveSortingModalOpenState,
  );

  const recordIndexAllRecordIdsSelector = useRecoilComponentCallbackStateV2(
    recordIndexAllRecordIdsComponentSelector,
  );

  const handleDragEnd = useRecoilCallback(
    ({ snapshot }) =>
      (result: DropResult) => {
        const destinationRecordGroupId = result.destination?.droppableId;

        if (!isDefined(result.destination)) {
          throw new Error('Drop Destination is not defined');
        }

        if (!isDefined(destinationRecordGroupId)) {
          throw new Error('Record group id is not defined');
        }

        const destinationRecordGroup = getSnapshotValue(
          snapshot,
          recordGroupDefinitionFamilyState(destinationRecordGroupId),
        );

        if (!isDefined(destinationRecordGroup)) {
          throw new Error('Record group is not defined');
        }

        const fieldMetadata = objectMetadataItem.fields.find(
          (field) => field.id === destinationRecordGroup.fieldMetadataId,
        );

        if (!isDefined(fieldMetadata)) {
          throw new Error('Field metadata is not defined');
        }

        if (viewSorts.length > 0) {
          setIsRemoveSortingModalOpenState(true);
          return;
        }

        const allRecordIds = getSnapshotValue(
          snapshot,
          recordIndexAllRecordIdsSelector,
        );

        const recordBeforeDestinationId =
          allRecordIds[result.destination.index - 1];

        const recordBeforeDestination = recordBeforeDestinationId
          ? snapshot
              .getLoadable(recordStoreFamilyState(recordBeforeDestinationId))
              .getValue()
          : null;

        const recordAfterDestinationId =
          allRecordIds[result.destination.index + 1];

        const recordAfterDestination = recordAfterDestinationId
          ? snapshot
              .getLoadable(recordStoreFamilyState(recordAfterDestinationId))
              .getValue()
          : null;

        const newPosition = getDraggedRecordPosition(
          recordBeforeDestination?.position,
          recordAfterDestination?.position,
        );

        if (!isDefined(newPosition)) {
          return;
        }

        updateOneRow({
          idToUpdate: result.draggableId,
          updateOneRecordInput: {
            position: newPosition,
            [fieldMetadata.name]: destinationRecordGroup.value,
          },
        });
      },
    [
      objectMetadataItem.fields,
      viewSorts.length,
      recordIndexAllRecordIdsSelector,
      updateOneRow,
      setIsRemoveSortingModalOpenState,
    ],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>
  );
};
