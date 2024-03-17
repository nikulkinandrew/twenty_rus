import { useRecoilCallback } from 'recoil';
import { currentHotkeyScopeState, getSnapshotValue } from 'twenty-ui';

import { useRecordTableStates } from '@/object-record/record-table/hooks/internal/useRecordTableStates';

import { TableHotkeyScope } from '../../types/TableHotkeyScope';

import { useCloseCurrentTableCellInEditMode } from './useCloseCurrentTableCellInEditMode';
import { useDisableSoftFocus } from './useDisableSoftFocus';

export const useLeaveTableFocus = (recordTableId?: string) => {
  const disableSoftFocus = useDisableSoftFocus(recordTableId);
  const closeCurrentCellInEditMode =
    useCloseCurrentTableCellInEditMode(recordTableId);

  const { isSoftFocusActiveState } = useRecordTableStates(recordTableId);

  return useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const isSoftFocusActive = getSnapshotValue(
          snapshot,
          isSoftFocusActiveState,
        );

        const currentHotkeyScope = snapshot
          .getLoadable(currentHotkeyScopeState)
          .getValue();

        if (!isSoftFocusActive) {
          return;
        }

        if (currentHotkeyScope?.scope === TableHotkeyScope.Table) {
          return;
        }

        closeCurrentCellInEditMode();
        disableSoftFocus();
      },
    [closeCurrentCellInEditMode, disableSoftFocus, isSoftFocusActiveState],
  );
};
