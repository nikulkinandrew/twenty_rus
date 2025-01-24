import { FavoriteFolderNavigationDrawerItemDropdownButton } from '@/favorites/components/FavoriteFolderNavigationDrawerItemDropdownButton';
import { FavoriteFolderHotkeyScope } from '@/favorites/constants/FavoriteFolderRightIconDropdownHotkeyScope';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';

import { IconPencil, IconTrash, MenuItem } from 'twenty-ui';

type FavoriteFolderNavigationDrawerItemDropdownProps = {
  folderId: string;
  onRename: () => void;
  onDelete: () => void;
  closeDropdown: () => void;
  isDropdownOpen: boolean;
};

export const FavoriteFolderNavigationDrawerItemDropdown = ({
  folderId,
  onRename,
  onDelete,
  closeDropdown,
  isDropdownOpen,
}: FavoriteFolderNavigationDrawerItemDropdownProps) => {
  const handleRename = () => {
    onRename();
    closeDropdown();
  };

  const handleDelete = () => {
    onDelete();
    closeDropdown();
  };

  return (
    <Dropdown
      dropdownId={`favorite-folder-edit-${folderId}`}
      dropdownHotkeyScope={{
        scope: FavoriteFolderHotkeyScope.FavoriteFolderRightIconDropdown,
      }}
      data-select-disable
      clickableComponent={
        <FavoriteFolderNavigationDrawerItemDropdownButton
          dropdownId={`favorite-folder-edit-${folderId}`}
          isDropdownOpen={isDropdownOpen}
        />
      }
      dropdownPlacement="bottom-start"
      dropdownComponents={
        <DropdownMenuItemsContainer>
          <MenuItem
            LeftIcon={IconPencil}
            onClick={handleRename}
            accent="default"
            text="Rename"
          />
          <MenuItem
            LeftIcon={IconTrash}
            onClick={handleDelete}
            accent="danger"
            text="Delete"
          />
        </DropdownMenuItemsContainer>
      }
    />
  );
};
