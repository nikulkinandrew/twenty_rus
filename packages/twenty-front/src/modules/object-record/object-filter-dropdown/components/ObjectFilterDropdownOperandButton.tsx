import { useRecoilValue } from 'recoil';
import { DropdownMenuHeader, IconChevronDown } from 'twenty-ui';

import { useFilterDropdown } from '@/object-record/object-filter-dropdown/hooks/useFilterDropdown';

import { getOperandLabel } from '../utils/getOperandLabel';

export const ObjectFilterDropdownOperandButton = () => {
  const {
    selectedOperandInDropdownState,
    setIsObjectFilterDropdownOperandSelectUnfolded,
    isObjectFilterDropdownOperandSelectUnfoldedState,
  } = useFilterDropdown();

  const selectedOperandInDropdown = useRecoilValue(
    selectedOperandInDropdownState,
  );
  const isObjectFilterDropdownOperandSelectUnfolded = useRecoilValue(
    isObjectFilterDropdownOperandSelectUnfoldedState,
  );

  if (isObjectFilterDropdownOperandSelectUnfolded) {
    return null;
  }

  return (
    <DropdownMenuHeader
      key={'selected-filter-operand'}
      EndIcon={IconChevronDown}
      onClick={() => setIsObjectFilterDropdownOperandSelectUnfolded(true)}
    >
      {getOperandLabel(selectedOperandInDropdown)}
    </DropdownMenuHeader>
  );
};
