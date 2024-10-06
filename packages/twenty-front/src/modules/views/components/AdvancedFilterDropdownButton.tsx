import { useCallback } from 'react';

import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';

import { AdvancedFilterDropdownContent } from '@/object-record/advanced-filter/components/AdvancedFilterDropdownContent';
import { isDraftingAdvancedFilterComponentState } from '@/object-record/object-filter-dropdown/states/isDraftingAdvancedFilterComponentState';
import { useSetRecoilComponentStateV2 } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentStateV2';
import { AdvancedFilterChip } from '@/views/components/AdvancedFilterChip';
import { ADVANCED_FILTER_DROPDOWN_ID } from '@/views/constants/AdvancedFilterDropdownId';

export const AdvancedFilterDropdownButton = () => {
  const handleDropdownClickOutside = useCallback(() => {}, []);

  const setIsDraftingAdvancedFilter = useSetRecoilComponentStateV2(
    isDraftingAdvancedFilterComponentState,
  );

  const handleDropdownClose = () => {
    setIsDraftingAdvancedFilter(false);
  };

  const removeAdvancedFilter = useCallback(() => {}, []);

  return (
    <Dropdown
      dropdownId={ADVANCED_FILTER_DROPDOWN_ID}
      clickableComponent={
        <AdvancedFilterChip onRemove={removeAdvancedFilter} />
      }
      dropdownComponents={<AdvancedFilterDropdownContent />}
      dropdownHotkeyScope={{ scope: ADVANCED_FILTER_DROPDOWN_ID }}
      dropdownOffset={{ y: 8, x: 0 }}
      dropdownPlacement="bottom-start"
      onClickOutside={handleDropdownClickOutside}
      onClose={handleDropdownClose}
    />
  );
};
