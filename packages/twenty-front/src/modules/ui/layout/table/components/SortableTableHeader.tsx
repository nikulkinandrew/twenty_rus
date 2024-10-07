import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { sortedFieldByTableFamilyState } from '@/ui/layout/table/states/sortedFieldByTableFamilyState';
import { TableSortValue } from '@/ui/layout/table/types/TableSortValue';
import { useRecoilState } from 'recoil';
import { IconArrowDown, IconArrowUp } from 'twenty-ui';

export const SortableTableHeader = ({
  tableId,
  fieldName,
  label,
  align = 'left',
  initialSort,
}: {
  tableId: string;
  fieldName: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  initialSort?: TableSortValue;
}) => {
  const [sortedFieldByTable, setSortedFieldByTable] = useRecoilState(
    sortedFieldByTableFamilyState({ tableId }),
  );

  const sortValue = sortedFieldByTable ?? initialSort;

  const isSortOnThisField = sortValue?.fieldName === fieldName;

  const sortDirection = isSortOnThisField ? sortValue.orderBy : null;

  const isAsc =
    sortDirection === 'AscNullsLast' || sortDirection === 'AscNullsFirst';
  const isDesc =
    sortDirection === 'DescNullsLast' || sortDirection === 'DescNullsFirst';

  const isSortActive = isAsc || isDesc;

  const handleClick = () => {
    setSortedFieldByTable({
      fieldName,
      orderBy: isSortOnThisField
        ? sortValue.orderBy === 'AscNullsLast'
          ? 'DescNullsLast'
          : 'AscNullsLast'
        : 'DescNullsLast',
    });
  };

  return (
    <TableHeader align={align} onClick={handleClick}>
      {isSortActive && align === 'right' ? (
        isAsc ? (
          <IconArrowUp size="14" />
        ) : (
          <IconArrowDown size="14" />
        )
      ) : null}
      {label}
      {isSortActive && align === 'left' ? (
        isAsc ? (
          <IconArrowUp size="14" />
        ) : (
          <IconArrowDown size="14" />
        )
      ) : null}
    </TableHeader>
  );
};
