import { TableRow } from '@/ui/layout/table/components/TableRow';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TextInputV2 } from '@/ui/input/components/TextInputV2';
import { LightIconButton } from '@/ui/input/button/components/LightIconButton';
import {
  IconCheck,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconX,
} from 'twenty-ui';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownMenu } from '@/ui/layout/dropdown/components/DropdownMenu';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { MenuItem } from '@/ui/navigation/menu-item/components/MenuItem';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { EnvironmentVariable } from '@/settings/serverless-functions/components/tabs/SettingsServerlessFunctionTabEnvironmentVariablesSection';

const StyledEditModeTableRow = styled(TableRow)`
  grid-template-columns: 180px auto 56px;
`;

const StyledTableRow = styled(TableRow)`
  grid-template-columns: 180px auto 32px;
`;

export const SettingsServerlessFunctionTabEnvironmentVariableTableRow = ({
  envVariable,
  onChange,
  onDelete,
  initialEditMode = false,
}: {
  envVariable: EnvironmentVariable;
  onChange: (newEnvVariable: EnvironmentVariable) => void;
  onDelete: () => void;
  initialEditMode?: boolean;
}) => {
  const [editedEnvVariable, setEditedEnvVariable] = useState(envVariable);
  const [editMode, setEditMode] = useState(initialEditMode);
  const dropDownId = `settings-environment-variable-dropdown-${envVariable.id}`;
  const { closeDropdown, isDropdownOpen } = useDropdown(dropDownId);

  if (editMode && isDropdownOpen) {
    closeDropdown();
  }

  return editMode ? (
    <StyledEditModeTableRow>
      <TableCell>
        <TextInputV2
          autoFocus
          value={editedEnvVariable.key}
          onChange={(newKey) =>
            setEditedEnvVariable({ ...editedEnvVariable, key: newKey })
          }
          placeholder="Name"
          fullWidth
        />
      </TableCell>
      <TableCell>
        <TextInputV2
          value={editedEnvVariable.value}
          onChange={(newValue) =>
            setEditedEnvVariable({ ...editedEnvVariable, value: newValue })
          }
          placeholder="Value"
          fullWidth
        />
      </TableCell>
      <TableCell>
        <LightIconButton
          accent={'tertiary'}
          Icon={IconX}
          onClick={() => {
            if (envVariable.key === '' && envVariable.value === '') {
              onDelete();
            }
            setEditedEnvVariable(envVariable);
            setEditMode(false);
          }}
        />
        <LightIconButton
          accent={'tertiary'}
          Icon={IconCheck}
          disabled={
            editedEnvVariable.key === '' || editedEnvVariable.value === ''
          }
          onClick={() => {
            onChange(editedEnvVariable);
            setEditMode(false);
          }}
        />
      </TableCell>
    </StyledEditModeTableRow>
  ) : (
    <StyledTableRow>
      <TableCell>{envVariable.key}</TableCell>
      <TableCell>{envVariable.value}</TableCell>
      <TableCell>
        <Dropdown
          dropdownMenuWidth="100px"
          dropdownId={dropDownId}
          clickableComponent={
            <LightIconButton
              aria-label="Env Variable Options"
              Icon={IconDotsVertical}
              accent="tertiary"
            />
          }
          dropdownComponents={
            <DropdownMenu disableBlur disableBorder width="auto">
              <DropdownMenuItemsContainer>
                <MenuItem
                  text={'Edit'}
                  LeftIcon={IconPencil}
                  onClick={() => {
                    setEditMode(true);
                  }}
                />
                <MenuItem
                  text={'Delete'}
                  LeftIcon={IconTrash}
                  onClick={() => {
                    onDelete();
                    closeDropdown();
                  }}
                />
              </DropdownMenuItemsContainer>
            </DropdownMenu>
          }
          dropdownHotkeyScope={{
            scope: dropDownId,
          }}
        />
      </TableCell>
    </StyledTableRow>
  );
};
