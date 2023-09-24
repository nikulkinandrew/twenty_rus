import { useCallback, useContext, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useRecoilState } from 'recoil';
import { Key } from 'ts-key-enum';

import { useCreateCompanyProgress } from '@/companies/hooks/useCreateCompanyProgress';
import { useFilteredSearchCompanyQuery } from '@/companies/hooks/useFilteredSearchCompanyQuery';
import { StyledDropdownMenu } from '@/ui/dropdown/components/StyledDropdownMenu';
import { StyledDropdownMenuItemsContainer } from '@/ui/dropdown/components/StyledDropdownMenuItemsContainer';
import {
  IconArrowLeft,
  IconArrowRight,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@/ui/icon';
import { SingleEntitySelect } from '@/ui/input/relation-picker/components/SingleEntitySelect';
import { relationPickerSearchFilterScopedState } from '@/ui/input/relation-picker/states/relationPickerSearchFilterScopedState';
import { EntityForSelect } from '@/ui/input/relation-picker/types/EntityForSelect';
import { RelationPickerHotkeyScope } from '@/ui/input/relation-picker/types/RelationPickerHotkeyScope';
import { MenuItem } from '@/ui/menu-item/components/MenuItem';
import { useSnackBar } from '@/ui/snack-bar/hooks/useSnackBar';
import { usePreviousHotkeyScope } from '@/ui/utilities/hotkey/hooks/usePreviousHotkeyScope';
import { useScopedHotkeys } from '@/ui/utilities/hotkey/hooks/useScopedHotkeys';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import { useRecoilScopedState } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopedState';

import { BoardColumnContext } from '../contexts/BoardColumnContext';
import { useBoardColumnns } from '../hooks/useBoardColumns';
import { boardColumnsState } from '../states/boardColumnsState';
import { BoardColumnHotkeyScope } from '../types/BoardColumnHotkeyScope';

import { BoardColumnEditTitleMenu } from './BoardColumnEditTitleMenu';
const StyledMenuContainer = styled.div`
  position: absolute;
  width: 200px;
  z-index: 1;
`;

type BoardColumnMenuProps = {
  onClose: () => void;
  onDelete?: (id: string) => void;
  onTitleEdit: (title: string, color: string) => void;
  stageId: string;
};

type Menu = 'actions' | 'add' | 'title';

export const BoardColumnMenu = ({
  onClose,
  onDelete,
  onTitleEdit,
  stageId,
}: BoardColumnMenuProps) => {
  const [currentMenu, setCurrentMenu] = useState('actions');
  const column = useContext(BoardColumnContext);

  const [, setBoardColumns] = useRecoilState(boardColumnsState);

  const boardColumnMenuRef = useRef(null);

  const { enqueueSnackBar } = useSnackBar();
  const createCompanyProgress = useCreateCompanyProgress();
  const { handleMoveBoardColumn } = useBoardColumnns();

  const handleCompanySelected = (
    selectedCompany: EntityForSelect | null | undefined,
  ) => {
    if (!selectedCompany?.id) {
      enqueueSnackBar(
        'There was a problem with the company selection, please retry.',
        {
          variant: 'error',
        },
      );

      console.error(
        'There was a problem with the company selection, please retry.',
      );
      return;
    }

    createCompanyProgress(selectedCompany.id, stageId);
    closeMenu();
  };

  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  const closeMenu = useCallback(() => {
    goBackToPreviousHotkeyScope();
    onClose();
  }, [goBackToPreviousHotkeyScope, onClose]);

  const handleDelete = useCallback(() => {
    setBoardColumns((previousBoardColumns) =>
      previousBoardColumns.filter((column) => column.id !== stageId),
    );
    onDelete?.(stageId);
    closeMenu();
  }, [closeMenu, onDelete, setBoardColumns, stageId]);

  const setMenu = (menu: Menu) => {
    if (menu === 'add') {
      setHotkeyScopeAndMemorizePreviousScope(
        RelationPickerHotkeyScope.RelationPicker,
      );
    }
    setCurrentMenu(menu);
  };
  const [relationPickerSearchFilter] = useRecoilScopedState(
    relationPickerSearchFilterScopedState,
  );
  const companies = useFilteredSearchCompanyQuery({
    searchFilter: relationPickerSearchFilter,
  });

  useListenClickOutside({
    refs: [boardColumnMenuRef],
    callback: closeMenu,
  });

  useScopedHotkeys(
    [Key.Escape, Key.Enter],
    closeMenu,
    BoardColumnHotkeyScope.BoardColumn,
    [],
  );

  if (!column) return <></>;

  const { isFirstColumn, isLastColumn, columnDefinition } = column;

  const handleColumnMoveLeft = () => {
    closeMenu();
    if (isFirstColumn) {
      return;
    }
    handleMoveBoardColumn('left', columnDefinition);
  };

  const handleColumnMoveRight = () => {
    closeMenu();
    if (isLastColumn) {
      return;
    }
    handleMoveBoardColumn('right', columnDefinition);
  };

  return (
    <StyledMenuContainer ref={boardColumnMenuRef}>
      <StyledDropdownMenu>
        {currentMenu === 'actions' && (
          <StyledDropdownMenuItemsContainer>
            <MenuItem
              onClick={() => setMenu('title')}
              LeftIcon={IconPencil}
              text="Rename"
            />
            <MenuItem
              LeftIcon={IconArrowLeft}
              onClick={handleColumnMoveLeft}
              text="Move left"
            />
            <MenuItem
              LeftIcon={IconArrowRight}
              onClick={handleColumnMoveRight}
              text="Move right"
            />
            <MenuItem
              onClick={handleDelete}
              LeftIcon={IconTrash}
              text="Delete"
            />
            <MenuItem
              onClick={() => setMenu('add')}
              LeftIcon={IconPlus}
              text="New opportunity"
            />
          </StyledDropdownMenuItemsContainer>
        )}
        {currentMenu === 'title' && (
          <BoardColumnEditTitleMenu
            color={columnDefinition.colorCode ?? 'gray'}
            onClose={closeMenu}
            onTitleEdit={onTitleEdit}
            title={columnDefinition.title}
          />
        )}
        {currentMenu === 'add' && (
          <SingleEntitySelect
            disableBackgroundBlur
            entitiesToSelect={companies.entitiesToSelect}
            loading={companies.loading}
            onCancel={closeMenu}
            onEntitySelected={handleCompanySelected}
            selectedEntity={companies.selectedEntities[0]}
          />
        )}
      </StyledDropdownMenu>
    </StyledMenuContainer>
  );
};
