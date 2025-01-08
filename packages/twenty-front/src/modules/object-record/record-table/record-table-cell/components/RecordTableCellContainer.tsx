import { ReactElement, useContext } from 'react';

import { RecordTableCellContext } from '@/object-record/record-table/contexts/RecordTableCellContext';
import { RecordTableCellBaseContainer } from '@/object-record/record-table/record-table-cell/components/RecordTableCellBaseContainer';
import { RecordTableCellSoftFocusMode } from '@/object-record/record-table/record-table-cell/components/RecordTableCellSoftFocusMode';

import { usePermissions } from '@/auth/contexts/PermissionContext';
import { RecordTableCellDisplayMode } from './RecordTableCellDisplayMode';
import { RecordTableCellEditMode } from './RecordTableCellEditMode';

export type RecordTableCellContainerProps = {
  editModeContent: ReactElement;
  nonEditModeContent: ReactElement;
  transparent?: boolean;
  maxContentWidth?: number;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export const RecordTableCellContainer = ({
  editModeContent,
  nonEditModeContent,
}: RecordTableCellContainerProps) => {
  const { hasSoftFocus, isInEditMode } = useContext(RecordTableCellContext);

  const { hasPermission } = usePermissions();
  
  return (
    <RecordTableCellBaseContainer>
      {isInEditMode && hasPermission(['edit']) ? (
        <RecordTableCellEditMode>{editModeContent}</RecordTableCellEditMode>
      ) : hasSoftFocus ? (
        <RecordTableCellSoftFocusMode
          editModeContent={editModeContent}
          nonEditModeContent={nonEditModeContent}
        />
      ) : (
        <RecordTableCellDisplayMode>
          {nonEditModeContent}
        </RecordTableCellDisplayMode>
      )}
    </RecordTableCellBaseContainer>
  );
};
