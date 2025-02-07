import { useFilterableFieldMetadataItems } from '@/object-record/record-filter/hooks/useFilterableFieldMetadataItems';
import { RecordFilter } from '@/object-record/record-filter/types/RecordFilter';
import { RecordFilterOperand } from '@/object-record/record-filter/types/RecordFilterOperand';
import { isSoftDeleteFilterActiveComponentState } from '@/object-record/record-table/states/isSoftDeleteFilterActiveComponentState';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { isDefined } from 'twenty-shared';

export const useCheckIsSoftDeleteFilter = () => {
  const { filterableFieldMetadataItems } = useFilterableFieldMetadataItems();

  const isSoftDeleteFilterActive = useRecoilComponentValueV2(
    isSoftDeleteFilterActiveComponentState,
  );

  const checkIsSoftDeleteFilter = (recordFilter: RecordFilter) => {
    const foundFieldMetadataItem = filterableFieldMetadataItems.find(
      (fieldMetadataItem) =>
        fieldMetadataItem.id === recordFilter.fieldMetadataId,
    );

    if (!isDefined(foundFieldMetadataItem)) {
      throw new Error(
        `Field metadata item not found for field metadata id: ${recordFilter.fieldMetadataId}`,
      );
    }

    return (
      foundFieldMetadataItem.name === 'deletedAt' &&
      isSoftDeleteFilterActive &&
      recordFilter.operand === RecordFilterOperand.IsNotEmpty
    );
  };

  return { checkIsSoftDeleteFilter };
};
