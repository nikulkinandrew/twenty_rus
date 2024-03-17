import { useRecoilValue } from 'recoil';
import {
  DropdownMenuItemsContainer,
  MenuItem,
  useIcons,
  useSetHotkeyScope,
} from 'twenty-ui';

import { useFilterDropdown } from '@/object-record/object-filter-dropdown/hooks/useFilterDropdown';
import { RelationPickerHotkeyScope } from '@/object-record/relation-picker/types/RelationPickerHotkeyScope';

import { getOperandsForFilterType } from '../utils/getOperandsForFilterType';

export const ObjectFilterDropdownFilterSelect = () => {
  const {
    setFilterDefinitionUsedInDropdown,
    setSelectedOperandInDropdown,
    setObjectFilterDropdownSearchInput,
    availableFilterDefinitionsState,
  } = useFilterDropdown();

  const availableFilterDefinitions = useRecoilValue(
    availableFilterDefinitionsState,
  );

  const { getIcon } = useIcons();

  const setHotkeyScope = useSetHotkeyScope();

  return (
    <DropdownMenuItemsContainer>
      {[...availableFilterDefinitions]
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((availableFilterDefinition, index) => (
          <MenuItem
            key={`select-filter-${index}`}
            testId={`select-filter-${index}`}
            onClick={() => {
              setFilterDefinitionUsedInDropdown(availableFilterDefinition);

              if (availableFilterDefinition.type === 'RELATION') {
                setHotkeyScope(RelationPickerHotkeyScope.RelationPicker);
              }

              setSelectedOperandInDropdown(
                getOperandsForFilterType(availableFilterDefinition.type)?.[0],
              );

              setObjectFilterDropdownSearchInput('');
            }}
            LeftIcon={getIcon(availableFilterDefinition.iconName)}
            text={availableFilterDefinition.label}
          />
        ))}
    </DropdownMenuItemsContainer>
  );
};
