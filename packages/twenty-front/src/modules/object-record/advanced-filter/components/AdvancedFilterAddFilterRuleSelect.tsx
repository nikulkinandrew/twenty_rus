import { useObjectMetadataItemById } from '@/object-metadata/hooks/useObjectMetadataItemById';
import { availableFieldMetadataItemsForFilterFamilySelector } from '@/object-metadata/states/availableFieldMetadataItemsForFilterFamilySelector';
import { formatFieldMetadataItemAsFilterDefinition } from '@/object-metadata/utils/formatFieldMetadataItemsAsFilterDefinitions';
import { useUpsertCombinedViewFilterGroup } from '@/object-record/advanced-filter/hooks/useUpsertCombinedViewFilterGroup';
import { getRecordFilterOperandsForRecordFilterDefinition } from '@/object-record/record-filter/utils/getRecordFilterOperandsForRecordFilterDefinition';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { ADVANCED_FILTER_DROPDOWN_ID } from '@/views/constants/AdvancedFilterDropdownId';
import { useGetCurrentView } from '@/views/hooks/useGetCurrentView';
import { useUpsertCombinedViewFilters } from '@/views/hooks/useUpsertCombinedViewFilters';
import { ViewFilterGroup } from '@/views/types/ViewFilterGroup';
import { ViewFilterGroupLogicalOperator } from '@/views/types/ViewFilterGroupLogicalOperator';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { isDefined } from 'twenty-shared';
import { IconLibraryPlus, IconPlus, LightButton, MenuItem } from 'twenty-ui';
import { v4 } from 'uuid';

type AdvancedFilterAddFilterRuleSelectProps = {
  viewFilterGroup: ViewFilterGroup;
  lastChildPosition?: number;
};

export const AdvancedFilterAddFilterRuleSelect = ({
  viewFilterGroup,
  lastChildPosition = 0,
}: AdvancedFilterAddFilterRuleSelectProps) => {
  const dropdownId = `advanced-filter-add-filter-rule-${viewFilterGroup.id}`;

  const { currentViewId } = useGetCurrentView();

  const { upsertCombinedViewFilterGroup } = useUpsertCombinedViewFilterGroup();
  const { upsertCombinedViewFilter } = useUpsertCombinedViewFilters();

  const newPositionInViewFilterGroup = lastChildPosition + 1;

  const { closeDropdown } = useDropdown(dropdownId);

  const { currentViewWithCombinedFiltersAndSorts } = useGetCurrentView();

  const objectMetadataId =
    currentViewWithCombinedFiltersAndSorts?.objectMetadataId;

  if (!objectMetadataId) {
    throw new Error('Object metadata id is missing from current view');
  }

  const { objectMetadataItem } = useObjectMetadataItemById({
    objectId: objectMetadataId,
  });

  const availableFieldMetadataItemsForFilter = useRecoilValue(
    availableFieldMetadataItemsForFilterFamilySelector({
      objectMetadataItemId: objectMetadataId,
    }),
  );

  const getDefaultFieldMetadataItem = useCallback(() => {
    const defaultFieldMetadataItem =
      availableFieldMetadataItemsForFilter.find(
        (fieldMetadataItem) =>
          fieldMetadataItem.id ===
          objectMetadataItem?.labelIdentifierFieldMetadataId,
      ) ?? availableFieldMetadataItemsForFilter[0];

    if (!defaultFieldMetadataItem) {
      throw new Error('Missing default filter definition');
    }

    return defaultFieldMetadataItem;
  }, [availableFieldMetadataItemsForFilter, objectMetadataItem]);

  const handleAddFilter = () => {
    closeDropdown();

    const defaultFieldMetadataItem = getDefaultFieldMetadataItem();

    const defaultFilterDefinition = formatFieldMetadataItemAsFilterDefinition({
      field: defaultFieldMetadataItem,
    });

    upsertCombinedViewFilter({
      id: v4(),
      fieldMetadataId: defaultFieldMetadataItem.id,
      operand: getRecordFilterOperandsForRecordFilterDefinition(
        defaultFilterDefinition,
      )[0],
      definition: defaultFilterDefinition,
      value: '',
      displayValue: '',
      viewFilterGroupId: viewFilterGroup.id,
      positionInViewFilterGroup: newPositionInViewFilterGroup,
    });
  };

  const handleAddFilterGroup = () => {
    closeDropdown();

    if (!currentViewId) {
      throw new Error('Missing view id');
    }

    const newViewFilterGroup = {
      id: v4(),
      viewId: currentViewId,
      logicalOperator: ViewFilterGroupLogicalOperator.AND,
      parentViewFilterGroupId: viewFilterGroup.id,
      positionInViewFilterGroup: newPositionInViewFilterGroup,
    };

    upsertCombinedViewFilterGroup(newViewFilterGroup);

    const defaultFieldMetadataItem = getDefaultFieldMetadataItem();

    const defaultFilterDefinition = formatFieldMetadataItemAsFilterDefinition({
      field: defaultFieldMetadataItem,
    });

    upsertCombinedViewFilter({
      id: v4(),
      fieldMetadataId: defaultFieldMetadataItem.id,
      operand: getRecordFilterOperandsForRecordFilterDefinition(
        defaultFilterDefinition,
      )[0],
      definition: defaultFilterDefinition,
      value: '',
      displayValue: '',
      viewFilterGroupId: newViewFilterGroup.id,
      positionInViewFilterGroup: newPositionInViewFilterGroup,
    });
  };

  const isFilterRuleGroupOptionVisible = !isDefined(
    viewFilterGroup.parentViewFilterGroupId,
  );

  if (!isFilterRuleGroupOptionVisible) {
    return (
      <LightButton
        Icon={IconPlus}
        title="Add filter rule"
        onClick={handleAddFilter}
      />
    );
  }

  return (
    <Dropdown
      dropdownId={dropdownId}
      clickableComponent={
        <LightButton Icon={IconPlus} title="Add filter rule" />
      }
      dropdownComponents={
        <DropdownMenuItemsContainer>
          <MenuItem
            LeftIcon={IconPlus}
            text="Add rule"
            onClick={handleAddFilter}
          />
          {isFilterRuleGroupOptionVisible && (
            <MenuItem
              LeftIcon={IconLibraryPlus}
              text="Add rule group"
              onClick={handleAddFilterGroup}
            />
          )}
        </DropdownMenuItemsContainer>
      }
      dropdownHotkeyScope={{ scope: ADVANCED_FILTER_DROPDOWN_ID }}
      dropdownOffset={{ y: 8, x: 0 }}
      dropdownPlacement="bottom-start"
    />
  );
};
