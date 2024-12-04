import { useAggregateManyRecords } from '@/object-record/hooks/useAggregateManyRecords';
import { RecordBoardContext } from '@/object-record/record-board/contexts/RecordBoardContext';
import { RecordBoardColumnContext } from '@/object-record/record-board/record-board-column/contexts/RecordBoardColumnContext';
import { buildRecordGqlFieldsAggregate } from '@/object-record/record-board/record-board-column/utils/buildRecordGqlFieldsAggregate';
import { computeAggregateValueAndLabel } from '@/object-record/record-board/record-board-column/utils/computeAggregateValueAndLabel';
import { computeViewRecordGqlOperationFilter } from '@/object-record/record-filter/utils/computeViewRecordGqlOperationFilter';
import { recordIndexFiltersState } from '@/object-record/record-index/states/recordIndexFiltersState';
import { recordIndexKanbanAggregateOperationState } from '@/object-record/record-index/states/recordIndexKanbanAggregateOperationState';
import { recordIndexKanbanFieldMetadataIdState } from '@/object-record/record-index/states/recordIndexKanbanFieldMetadataIdState';
import { recordIndexViewFilterGroupsState } from '@/object-record/record-index/states/recordIndexViewFilterGroupsState';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { isDefined } from '~/utils/isDefined';

export const useAggregateManyRecordsForRecordBoardColumn = () => {
  const isAggregateQueryEnabled = useIsFeatureEnabled(
    'IS_AGGREGATE_QUERY_ENABLED',
  );

  const { columnDefinition, recordCount } = useContext(
    RecordBoardColumnContext,
  );

  const { objectMetadataItem } = useContext(RecordBoardContext);

  const recordIndexKanbanAggregateOperation = useRecoilValue(
    recordIndexKanbanAggregateOperationState,
  );

  const recordIndexKanbanFieldMetadataId = useRecoilValue(
    recordIndexKanbanFieldMetadataIdState,
  );

  const kanbanFieldName = objectMetadataItem.fields?.find(
    (field) => field.id === recordIndexKanbanFieldMetadataId,
  )?.name;

  if (!isDefined(kanbanFieldName)) {
    throw new Error(
      `Field name is not found for field with id ${recordIndexKanbanFieldMetadataId} on object ${objectMetadataItem.nameSingular}`,
    );
  }

  const recordGqlFieldsAggregate = buildRecordGqlFieldsAggregate({
    objectMetadataItem: objectMetadataItem,
    recordIndexKanbanAggregateOperation: recordIndexKanbanAggregateOperation,
    kanbanFieldName: kanbanFieldName,
  });

  const recordIndexViewFilterGroups = useRecoilValue(
    recordIndexViewFilterGroupsState,
  );

  const recordIndexFilters = useRecoilValue(recordIndexFiltersState);
  const requestFilters = computeViewRecordGqlOperationFilter(
    recordIndexFilters,
    objectMetadataItem.fields,
    recordIndexViewFilterGroups,
  );

  const filter = {
    ...requestFilters,
    [kanbanFieldName]:
      columnDefinition.value === null
        ? { is: 'NULL' }
        : { eq: columnDefinition.value },
  };

  const { data } = useAggregateManyRecords({
    objectNameSingular: objectMetadataItem.nameSingular,
    recordGqlFieldsAggregate,
    filter,
    skip: !isAggregateQueryEnabled,
  });

  const { value, label } = computeAggregateValueAndLabel(
    data,
    objectMetadataItem,
    recordIndexKanbanAggregateOperation,
    kanbanFieldName,
  );

  return {
    aggregateValue: value ?? recordCount,
    aggregateLabel: isDefined(value) ? label : undefined,
  };
};
