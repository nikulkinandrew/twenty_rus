import { ExtendedAggregateOperations } from '@/object-record/record-table/types/ExtendedAggregateOperations';
import { createState } from 'twenty-shared';

export type KanbanAggregateOperation = {
  operation?: ExtendedAggregateOperations | null;
  fieldMetadataId?: string | null;
} | null;

export const recordIndexKanbanAggregateOperationState =
  createState<KanbanAggregateOperation>({
    key: 'recordIndexKanbanAggregateOperationState',
    defaultValue: null,
  });
