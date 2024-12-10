import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { useRecordTableContext } from '@/object-record/record-table/contexts/RecordTableContext';
import { useContext } from 'react';
import { RecordTableCellDisplayContainer } from './RecordTableCellDisplayContainer';

export const RecordTableCellDisplayMode = ({
  children,
  softFocus,
}: React.PropsWithChildren<{ softFocus?: boolean }>) => {
  const { onActionMenuDropdownOpened } = useRecordTableContext();
  const { recordId } = useContext(FieldContext);

  const handleActionMenuDropdown = (event: React.MouseEvent) => {
    onActionMenuDropdownOpened(event, recordId);
  };

  return (
    <RecordTableCellDisplayContainer
      softFocus={softFocus}
      onContextMenu={handleActionMenuDropdown}
    >
      {children}
    </RecordTableCellDisplayContainer>
  );
};
