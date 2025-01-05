import { AGGREGATE_OPERATIONS } from '@/object-record/record-table/constants/AggregateOperations';

export const getAggregateOperationLabel = (operation: AGGREGATE_OPERATIONS) => {
  switch (operation) {
    case AGGREGATE_OPERATIONS.min:
      return 'Min';
    case AGGREGATE_OPERATIONS.max:
      return 'Max';
    case AGGREGATE_OPERATIONS.avg:
      return 'Average';
    case AGGREGATE_OPERATIONS.sum:
      return 'Sum';
    case AGGREGATE_OPERATIONS.count:
      return 'Count all';
    case AGGREGATE_OPERATIONS.countEmpty:
      return 'Count empty';
    case AGGREGATE_OPERATIONS.countNotEmpty:
      return 'Count not empty';
    case AGGREGATE_OPERATIONS.countUniqueValues:
      return 'Count unique values';
    case AGGREGATE_OPERATIONS.percentageEmpty:
      return 'Percent empty';
    case AGGREGATE_OPERATIONS.percentageNotEmpty:
      return 'Percent not empty';
    default:
      throw new Error(`Unknown aggregate operation: ${operation}`);
  }
};
