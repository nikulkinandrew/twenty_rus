import { TextInput } from '@/ui/field/input/components/TextInput';

import { FieldInputOverlay } from '../../../../../ui/field/input/components/FieldInputOverlay';
import { useNumberField } from '../../hooks/useNumberField';

export type FieldInputEvent = (persist: () => void) => void;

export type NumberFieldInputProps = {
  onClickOutside?: FieldInputEvent;
  onEnter?: FieldInputEvent;
  onEscape?: FieldInputEvent;
  onTab?: FieldInputEvent;
  onShiftTab?: FieldInputEvent;
};

export const NumberFieldInput = ({
  onEnter,
  onEscape,
  onClickOutside,
  onTab,
  onShiftTab,
}: NumberFieldInputProps) => {
  const {
    fieldDefinition,
    draftValue,
    setDraftValue,
    hotkeyScope,
    persistNumberField,
  } = useNumberField();

  const isPercentage =
    fieldDefinition?.metadata?.settings?.type === 'percentage';

  const handleEnter = (newText: string) => {
    onEnter?.(() => persistNumberField(newText, isPercentage));
  };

  const handleEscape = (newText: string) => {
    onEscape?.(() => persistNumberField(newText, isPercentage));
  };

  const handleClickOutside = (
    event: MouseEvent | TouchEvent,
    newText: string,
  ) => {
    onClickOutside?.(() => persistNumberField(newText, isPercentage));
  };

  const handleTab = (newText: string) => {
    onTab?.(() => persistNumberField(newText, isPercentage));
  };

  const handleShiftTab = (newText: string) => {
    onShiftTab?.(() => persistNumberField(newText, isPercentage));
  };

  const handleChange = (newText: string) => {
    setDraftValue(newText);
  };

  return (
    <FieldInputOverlay>
      <TextInput
        placeholder={fieldDefinition.metadata.placeHolder}
        autoFocus
        value={draftValue?.toString() ?? ''}
        onClickOutside={handleClickOutside}
        onEnter={handleEnter}
        onEscape={handleEscape}
        onShiftTab={handleShiftTab}
        onTab={handleTab}
        hotkeyScope={hotkeyScope}
        onChange={handleChange}
      />
    </FieldInputOverlay>
  );
};
