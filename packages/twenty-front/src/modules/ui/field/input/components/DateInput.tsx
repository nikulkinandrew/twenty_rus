import { useRef, useState } from 'react';
import { Nullable } from 'twenty-ui';

import { useRegisterInputEvents } from '@/object-record/record-field/meta-types/input/hooks/useRegisterInputEvents';
import {
  InternalDatePicker,
  MONTH_AND_YEAR_DROPDOWN_ID,
  MONTH_AND_YEAR_DROPDOWN_MONTH_SELECT_ID,
  MONTH_AND_YEAR_DROPDOWN_YEAR_SELECT_ID,
} from '@/ui/input/components/internal/date/components/InternalDatePicker';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { ClickOutsideMode } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';

export type DateInputProps = {
  value: Nullable<Date>;
  onEnter: (newDate: Nullable<Date>) => void;
  onEscape: (newDate: Nullable<Date>) => void;
  onClickOutside: (
    event: MouseEvent | TouchEvent,
    newDate: Nullable<Date>,
  ) => void;
  clearable?: boolean;
  onChange?: (newDate: Nullable<Date>) => void;
  isDateTimeInput?: boolean;
  onClear?: () => void;
  onSubmit?: (newDate: Nullable<Date>) => void;
  hideHeaderInput?: boolean;
  hotkeyScope: string;
};

export const DateInput = ({
  value,
  onEnter,
  onEscape,
  onClickOutside,
  clearable,
  onChange,
  isDateTimeInput,
  onClear,
  onSubmit,
  hideHeaderInput,
  hotkeyScope,
}: DateInputProps) => {
  const [internalValue, setInternalValue] = useState(value);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleChange = (newDate: Date | null) => {
    setInternalValue(newDate);
    onChange?.(newDate);
  };

  const handleClear = () => {
    setInternalValue(null);
    onClear?.();
  };

  const handleMouseSelect = (newDate: Date | null) => {
    setInternalValue(newDate);
    onSubmit?.(newDate);
  };

  const { closeDropdown } = useDropdown(MONTH_AND_YEAR_DROPDOWN_ID);
  const { closeDropdown: closeDropdownMonthSelect } = useDropdown(
    MONTH_AND_YEAR_DROPDOWN_MONTH_SELECT_ID,
  );
  const { closeDropdown: closeDropdownYearSelect } = useDropdown(
    MONTH_AND_YEAR_DROPDOWN_YEAR_SELECT_ID,
  );

  const handleEnter = () => {
    closeDropdownYearSelect();
    closeDropdownMonthSelect();
    closeDropdown();

    onEnter(internalValue);
  };

  const handleEscape = () => {
    closeDropdownYearSelect();
    closeDropdownMonthSelect();
    closeDropdown();

    onEscape(internalValue);
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    event.stopImmediatePropagation();

    closeDropdownYearSelect();
    closeDropdownMonthSelect();
    closeDropdown();

    onClickOutside(event, internalValue);
  };

  useRegisterInputEvents({
    inputRef: wrapperRef,
    inputValue: internalValue,
    onEnter: handleEnter,
    onEscape: handleEscape,
    onClickOutside: handleClickOutside,
    hotkeyScope: hotkeyScope,
    mode: ClickOutsideMode.comparePixels,
  });

  return (
    <div ref={wrapperRef}>
      <InternalDatePicker
        date={internalValue ?? new Date()}
        onChange={handleChange}
        onMouseSelect={handleMouseSelect}
        clearable={clearable ? clearable : false}
        isDateTimeInput={isDateTimeInput}
        onEnter={onEnter}
        onEscape={onEscape}
        onClear={handleClear}
        hideHeaderInput={hideHeaderInput}
      />
    </div>
  );
};
