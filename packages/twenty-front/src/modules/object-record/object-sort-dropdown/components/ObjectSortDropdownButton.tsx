import { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  Dropdown,
  DropdownMenuHeader,
  DropdownMenuItemsContainer,
  DropdownMenuSeparator,
  IconChevronDown,
  LightButton,
  MenuItem,
  useDropdown,
  useIcons,
} from 'twenty-ui';

import { OBJECT_SORT_DROPDOWN_ID } from '@/object-record/object-sort-dropdown/constants/ObjectSortDropdownId';
import { useSortDropdown } from '@/object-record/object-sort-dropdown/hooks/useSortDropdown';
import { ObjectSortDropdownScope } from '@/object-record/object-sort-dropdown/scopes/ObjectSortDropdownScope';
import { HotkeyScope } from '@/ui/utilities/hotkey/types/HotkeyScope';

import { SortDefinition } from '../types/SortDefinition';
import { SORT_DIRECTIONS, SortDirection } from '../types/SortDirection';

export type ObjectSortDropdownButtonProps = {
  sortDropdownId: string;
  hotkeyScope: HotkeyScope;
};

export const ObjectSortDropdownButton = ({
  sortDropdownId,
  hotkeyScope,
}: ObjectSortDropdownButtonProps) => {
  const [isSortDirectionMenuUnfolded, setIsSortDirectionMenuUnfolded] =
    useState(false);

  const [selectedSortDirection, setSelectedSortDirection] =
    useState<SortDirection>('asc');

  const resetState = useCallback(() => {
    setIsSortDirectionMenuUnfolded(false);
    setSelectedSortDirection('asc');
  }, []);

  const { isSortSelectedState } = useSortDropdown({
    sortDropdownId: sortDropdownId,
  });

  const { toggleDropdown } = useDropdown(OBJECT_SORT_DROPDOWN_ID);

  const handleButtonClick = () => {
    toggleDropdown();
    resetState();
  };

  const { availableSortDefinitionsState, onSortSelectState } = useSortDropdown({
    sortDropdownId: sortDropdownId,
  });

  const isSortSelected = useRecoilValue(isSortSelectedState);
  const availableSortDefinitions = useRecoilValue(
    availableSortDefinitionsState,
  );
  const onSortSelect = useRecoilValue(onSortSelectState);

  const handleAddSort = (selectedSortDefinition: SortDefinition) => {
    toggleDropdown();
    onSortSelect?.({
      fieldMetadataId: selectedSortDefinition.fieldMetadataId,
      direction: selectedSortDirection,
      definition: selectedSortDefinition,
    });
  };

  const handleDropdownButtonClose = () => {
    resetState();
  };

  const { getIcon } = useIcons();

  return (
    <ObjectSortDropdownScope sortScopeId={sortDropdownId}>
      <Dropdown
        dropdownId={OBJECT_SORT_DROPDOWN_ID}
        dropdownHotkeyScope={hotkeyScope}
        dropdownOffset={{ y: 8 }}
        clickableComponent={
          <LightButton
            title="Sort"
            active={isSortSelected}
            onClick={handleButtonClick}
          />
        }
        dropdownComponents={
          <>
            {isSortDirectionMenuUnfolded ? (
              <DropdownMenuItemsContainer>
                {SORT_DIRECTIONS.map((sortOrder, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      setSelectedSortDirection(sortOrder);
                      setIsSortDirectionMenuUnfolded(false);
                    }}
                    text={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  />
                ))}
              </DropdownMenuItemsContainer>
            ) : (
              <>
                <DropdownMenuHeader
                  EndIcon={IconChevronDown}
                  onClick={() => setIsSortDirectionMenuUnfolded(true)}
                >
                  {selectedSortDirection === 'asc' ? 'Ascending' : 'Descending'}
                </DropdownMenuHeader>
                <DropdownMenuSeparator />
                <DropdownMenuItemsContainer>
                  {[...availableSortDefinitions]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((availableSortDefinition, index) => (
                      <MenuItem
                        testId={`select-sort-${index}`}
                        key={index}
                        onClick={() => handleAddSort(availableSortDefinition)}
                        LeftIcon={getIcon(availableSortDefinition.iconName)}
                        text={availableSortDefinition.label}
                      />
                    ))}
                </DropdownMenuItemsContainer>
              </>
            )}
          </>
        }
        onClose={handleDropdownButtonClose}
      />
    </ObjectSortDropdownScope>
  );
};
