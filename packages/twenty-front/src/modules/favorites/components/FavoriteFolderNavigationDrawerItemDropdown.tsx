import { FavoriteFolderHotkeyScope } from '@/favorites/constants/FavoriteFolderRightIconDropdownHotkeyScope';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';

import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { IconDotsVertical, IconPencil, IconTrash, MenuItem } from 'twenty-ui';

type FavoriteFolderNavigationDrawerItemDropdownProps = {
  folderId: string;
  onRename: () => void;
  onDelete: () => void;
  closeDropdown: () => void;
};

const StyledIconContainer = styled.div`
  align-items: center;
  background: transparent;
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  border-radius: ${({ theme }) => theme.border.radius.sm};
`;

export const FavoriteFolderNavigationDrawerItemDropdown = ({
  folderId,
  onRename,
  onDelete,
  closeDropdown,
}: FavoriteFolderNavigationDrawerItemDropdownProps) => {
  const theme = useTheme();

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
        <StyledIconContainer>
          <IconDotsVertical
            size={theme.icon.size.sm}
            color={theme.font.color.tertiary}
          />
        </StyledIconContainer>
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
