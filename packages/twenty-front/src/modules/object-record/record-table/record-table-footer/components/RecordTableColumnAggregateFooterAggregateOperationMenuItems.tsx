import { getAggregateOperationLabel } from '@/object-record/record-board/record-board-column/utils/getAggregateOperationLabel';
import { AGGREGATE_OPERATIONS } from '@/object-record/record-table/constants/AggregateOperations';
import { RecordTableColumnAggregateFooterDropdownContext } from '@/object-record/record-table/record-table-footer/components/RecordTableColumnAggregateFooterDropdownContext';
import { useViewFieldAggregateOperation } from '@/object-record/record-table/record-table-footer/hooks/useViewFieldAggregateOperation';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { ReactNode, useContext } from 'react';
import { IconCheck, isDefined, MenuItem } from 'twenty-ui';

export const RecordTableColumnAggregateFooterAggregateOperationMenuItems = ({
  aggregateOperations,
  children,
}: {
  aggregateOperations: AGGREGATE_OPERATIONS[];
  children?: ReactNode;
}) => {
  const {
    updateViewFieldAggregateOperation,
    currentViewFieldAggregateOperation,
  } = useViewFieldAggregateOperation();

  const { dropdownId, resetContent } = useContext(
    RecordTableColumnAggregateFooterDropdownContext,
  );
  const { closeDropdown } = useDropdown(dropdownId);
  return (
    <DropdownMenuItemsContainer>
      {aggregateOperations.map((operation) => (
        <MenuItem
          key={operation}
          onClick={() => {
            updateViewFieldAggregateOperation(operation);
            closeDropdown();
          }}
          text={getAggregateOperationLabel(operation)}
          RightIcon={
            currentViewFieldAggregateOperation === operation
              ? IconCheck
              : undefined
          }
          aria-selected={currentViewFieldAggregateOperation === operation}
        />
      ))}
      {children}
      <MenuItem
        key={'none'}
        onClick={() => {
          updateViewFieldAggregateOperation(null);
          resetContent();
          closeDropdown();
        }}
        text={'None'}
        RightIcon={
          !isDefined(currentViewFieldAggregateOperation) ? IconCheck : undefined
        }
        aria-selected={!isDefined(currentViewFieldAggregateOperation)}
      />
    </DropdownMenuItemsContainer>
  );
};
