import { useContext } from 'react';
import { useIcons } from 'twenty-ui';

import { FieldDisplay } from '@/object-record/record-field/components/FieldDisplay';
import { FieldInput } from '@/object-record/record-field/components/FieldInput';
import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { FieldFocusContextProvider } from '@/object-record/record-field/contexts/FieldFocusContextProvider';
import { useGetButtonIcon } from '@/object-record/record-field/hooks/useGetButtonIcon';
import { useIsFieldInputOnly } from '@/object-record/record-field/hooks/useIsFieldInputOnly';
import { FieldInputEvent } from '@/object-record/record-field/types/FieldInputEvent';
import { isFieldRelation } from '@/object-record/record-field/types/guards/isFieldRelation';
import { RelationPickerHotkeyScope } from '@/object-record/relation-picker/types/RelationPickerHotkeyScope';

import { useInlineCell } from '../hooks/useInlineCell';

import { useIsFieldValueReadOnly } from '@/object-record/record-field/hooks/useIsFieldValueReadOnly';
import { getRecordFieldInputId } from '@/object-record/utils/getRecordFieldInputId';
import { activeDropdownFocusIdState } from '@/ui/layout/dropdown/states/activeDropdownFocusIdState';
import { getDropdownFocusIdForRecordField } from '@/ui/layout/dropdown/utils/getDropdownFocusIdForRecordField';
import { useRecoilValue } from 'recoil';
import { RecordInlineCellContainer } from './RecordInlineCellContainer';
import {
  RecordInlineCellContext,
  RecordInlineCellContextProps,
} from './RecordInlineCellContext';

type RecordInlineCellProps = {
  readonly?: boolean;
  loading?: boolean;
};

export const RecordInlineCell = ({ loading }: RecordInlineCellProps) => {
  const { fieldDefinition, recordId, isCentered } = useContext(FieldContext);
  const buttonIcon = useGetButtonIcon();

  const isFieldInputOnly = useIsFieldInputOnly();

  const isFieldReadOnly = useIsFieldValueReadOnly();

  const { closeInlineCell } = useInlineCell();

  const activeDropdownFocusId = useRecoilValue(activeDropdownFocusIdState);

  const handleEnter: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
  };

  const handleSubmit: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
  };

  const handleCancel = () => {
    closeInlineCell();
  };

  const handleEscape = () => {
    closeInlineCell();
  };

  const handleTab: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
  };

  const handleShiftTab: FieldInputEvent = (persistField) => {
    persistField();
    closeInlineCell();
  };

  const handleClickOutside: FieldInputEvent = (persistField) => {
    // If not currently focused return
    const recordFieldDropdownId = getDropdownFocusIdForRecordField(
      recordId,
      fieldDefinition.fieldMetadataId,
      'inline-cell',
    );

    console.log({
      recordFieldDropdownId,
      activeDropdownFocusId,
    });

    if (recordFieldDropdownId !== activeDropdownFocusId) {
      return;
    }

    persistField();
    closeInlineCell();
  };

  const { getIcon } = useIcons();

  const RecordInlineCellContextValue: RecordInlineCellContextProps = {
    readonly: isFieldReadOnly,
    buttonIcon: buttonIcon,
    customEditHotkeyScope: isFieldRelation(fieldDefinition)
      ? { scope: RelationPickerHotkeyScope.RelationPicker }
      : undefined,
    IconLabel: fieldDefinition.iconName
      ? getIcon(fieldDefinition.iconName)
      : undefined,
    label: fieldDefinition.label,
    labelWidth: fieldDefinition.labelWidth,
    showLabel: fieldDefinition.showLabel,
    isCentered,
    editModeContent: (
      <FieldInput
        recordFieldInputdId={getRecordFieldInputId(
          recordId,
          fieldDefinition?.metadata?.fieldName,
        )}
        onEnter={handleEnter}
        onCancel={handleCancel}
        onEscape={handleEscape}
        onSubmit={handleSubmit}
        onTab={handleTab}
        onShiftTab={handleShiftTab}
        onClickOutside={handleClickOutside}
        isReadOnly={isFieldReadOnly}
      />
    ),
    displayModeContent: <FieldDisplay />,
    isDisplayModeFixHeight: undefined,
    editModeContentOnly: isFieldInputOnly,
    loading: loading,
  };

  return (
    <FieldFocusContextProvider>
      <RecordInlineCellContext.Provider value={RecordInlineCellContextValue}>
        <RecordInlineCellContainer />
      </RecordInlineCellContext.Provider>
    </FieldFocusContextProvider>
  );
};
