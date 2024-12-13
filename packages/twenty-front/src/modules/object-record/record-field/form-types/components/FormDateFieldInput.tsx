import { FormFieldInputContainer } from '@/object-record/record-field/form-types/components/FormFieldInputContainer';
import { FormFieldInputInputContainer } from '@/object-record/record-field/form-types/components/FormFieldInputInputContainer';
import { FormFieldInputRowContainer } from '@/object-record/record-field/form-types/components/FormFieldInputRowContainer';
import { VariableChip } from '@/object-record/record-field/form-types/components/VariableChip';
import { VariablePickerComponent } from '@/object-record/record-field/form-types/types/VariablePickerComponent';
import { DateInput } from '@/ui/field/input/components/DateInput';
import { InputLabel } from '@/ui/input/components/InputLabel';
import { MAX_DATE } from '@/ui/input/components/internal/date/constants/MaxDate';
import { MIN_DATE } from '@/ui/input/components/internal/date/constants/MinDate';
import { parseDateToString } from '@/ui/input/components/internal/date/utils/parseDateToString';
import { parseStringToDate } from '@/ui/input/components/internal/date/utils/parseStringToDate';
import { UserContext } from '@/users/contexts/UserContext';
import { isStandaloneVariableString } from '@/workflow/utils/isStandaloneVariableString';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  ChangeEvent,
  KeyboardEvent,
  useContext,
  useId,
  useRef,
  useState,
} from 'react';
import { isDefined, Nullable, TEXT_INPUT_STYLE } from 'twenty-ui';

const StyledInputContainer = styled(FormFieldInputInputContainer)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0px;
  overflow: visible;
  position: relative;
`;

const StyledDateInputAbsoluteContainer = styled.div`
  position: absolute;
`;

const StyledDateInput = styled.input<{ hasError?: boolean }>`
  ${TEXT_INPUT_STYLE}

  ${({ hasError, theme }) =>
    hasError &&
    css`
      color: ${theme.color.red};
    `};
`;

const StyledDateInputContainer = styled.div`
  position: relative;
  z-index: 1;
`;

type DraftValue =
  | {
      type: 'static';
      value: string | null;
      mode: 'view' | 'edit';
    }
  | {
      type: 'variable';
      value: string;
    };

type FormDateFieldInputProps = {
  label?: string;
  defaultValue: string | undefined;
  onPersist: (value: string | null) => void;
  VariablePicker?: VariablePickerComponent;
};

export const FormDateFieldInput = ({
  label,
  defaultValue,
  onPersist,
  VariablePicker,
}: FormDateFieldInputProps) => {
  const { timeZone } = useContext(UserContext);

  const inputId = useId();

  const [draftValue, setDraftValue] = useState<DraftValue>(
    isStandaloneVariableString(defaultValue)
      ? {
          type: 'variable',
          value: defaultValue,
        }
      : {
          type: 'static',
          value: defaultValue ?? null,
          mode: 'view',
        },
  );

  const draftValueAsDate = isDefined(draftValue.value)
    ? new Date(draftValue.value)
    : null;

  const datePickerWrapperRef = useRef<HTMLDivElement>(null);

  const [temporaryValue, setTemporaryValue] =
    useState<Nullable<Date>>(draftValueAsDate);

  const [inputDateTime, setInputDateTime] = useState(
    isDefined(draftValueAsDate) && !isStandaloneVariableString(defaultValue)
      ? parseDateToString({
          date: draftValueAsDate,
          isDateTimeInput: false,
          userTimezone: timeZone,
        })
      : '',
  );

  const persistDate = (newDate: Nullable<Date>) => {
    if (!isDefined(newDate)) {
      onPersist(null);
    } else {
      const newDateISO = newDate.toISOString();

      onPersist(newDateISO);
    }
  };

  const handlePickerChange = (newDate: Nullable<Date>) => {
    setDraftValue({
      type: 'static',
      mode: 'edit',
      value: newDate?.toDateString() ?? null,
    });

    setInputDateTime(
      isDefined(newDate)
        ? parseDateToString({
            date: newDate,
            isDateTimeInput: false,
            userTimezone: timeZone,
          })
        : '',
    );

    persistDate(newDate);
  };

  const handlePickerEnter = () => {};

  const handlePickerEscape = () => {
    // FIXME: Escape key is not handled properly by the underlying DateInput component. We need to solve that.

    setDraftValue({
      type: 'static',
      value: draftValue.value,
      mode: 'view',
    });
  };

  const handlePickerClickOutside = () => {
    setDraftValue({
      type: 'static',
      value: draftValue.value,
      mode: 'view',
    });
  };

  const handlePickerClear = () => {
    setDraftValue({
      type: 'static',
      value: null,
      mode: 'view',
    });

    setTemporaryValue(null);

    setInputDateTime('');

    persistDate(null);
  };

  const handlePickerSubmit = (newDate: Nullable<Date>) => {
    // 2
    setDraftValue({
      type: 'static',
      value: newDate?.toDateString() ?? null,
      mode: 'view',
    });

    setTemporaryValue(newDate);

    setInputDateTime(
      isDefined(newDate)
        ? parseDateToString({
            date: newDate,
            isDateTimeInput: false,
            userTimezone: timeZone,
          })
        : '',
    );

    persistDate(newDate);
  };

  const handleInputFocus = () => {
    setDraftValue({
      type: 'static',
      mode: 'edit',
      value: draftValue.value,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputDateTime(event.target.value);
  };

  const handleInputKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    const inputDateTimeTrimmed = inputDateTime.trim();

    if (inputDateTimeTrimmed === '') {
      handlePickerClear();

      return;
    }

    const parsedInputDateTime = parseStringToDate({
      dateAsString: inputDateTimeTrimmed,
      isDateTimeInput: false,
      userTimezone: timeZone,
    });

    if (!isDefined(parsedInputDateTime)) {
      return;
    }

    let validatedDate = parsedInputDateTime;
    if (parsedInputDateTime < MIN_DATE) {
      validatedDate = MIN_DATE;
    } else if (parsedInputDateTime > MAX_DATE) {
      validatedDate = MAX_DATE;
    }

    setDraftValue({
      type: 'static',
      value: validatedDate.toDateString(),
      mode: 'edit',
    });

    setTemporaryValue(validatedDate);

    setInputDateTime(
      parseDateToString({
        date: validatedDate,
        isDateTimeInput: false,
        userTimezone: timeZone,
      }),
    );

    persistDate(validatedDate);
  };

  const handleVariableTagInsert = (variableName: string) => {
    setDraftValue({
      type: 'variable',
      value: variableName,
    });

    setInputDateTime('');

    onPersist(variableName);
  };

  const handleUnlinkVariable = () => {
    setDraftValue({
      type: 'static',
      value: null,
      mode: 'view',
    });

    setTemporaryValue(null);

    onPersist(null);
  };

  return (
    <FormFieldInputContainer>
      {label ? <InputLabel>{label}</InputLabel> : null}

      <FormFieldInputRowContainer>
        <StyledInputContainer
          ref={datePickerWrapperRef}
          hasRightElement={isDefined(VariablePicker)}
        >
          {draftValue.type === 'static' ? (
            <>
              <StyledDateInput
                type="text"
                placeholder="mm/dd/yyyy"
                value={inputDateTime}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onKeyDown={handleInputKeydown}
              />

              {draftValue.mode === 'edit' ? (
                <StyledDateInputContainer>
                  <StyledDateInputAbsoluteContainer>
                    <DateInput
                      clearable
                      onChange={handlePickerChange}
                      onEscape={handlePickerEscape}
                      onClickOutside={handlePickerClickOutside}
                      onEnter={handlePickerEnter}
                      onClear={handlePickerClear}
                      onSubmit={handlePickerSubmit}
                      hideHeaderInput
                      wrapperRef={datePickerWrapperRef}
                      temporaryValue={temporaryValue}
                      setTemporaryValue={setTemporaryValue}
                    />
                  </StyledDateInputAbsoluteContainer>
                </StyledDateInputContainer>
              ) : null}
            </>
          ) : (
            <VariableChip
              rawVariableName={draftValue.value}
              onRemove={handleUnlinkVariable}
            />
          )}
        </StyledInputContainer>

        {VariablePicker ? (
          <VariablePicker
            inputId={inputId}
            onVariableSelect={handleVariableTagInsert}
          />
        ) : null}
      </FormFieldInputRowContainer>
    </FormFieldInputContainer>
  );
};
