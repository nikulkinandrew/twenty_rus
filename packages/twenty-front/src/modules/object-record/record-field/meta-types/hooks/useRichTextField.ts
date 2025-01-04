import { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { useRecordFieldInput } from '@/object-record/record-field/hooks/useRecordFieldInput';
import {
  FieldRichTextDeprecatedValue,
  FieldRichTextValue,
} from '@/object-record/record-field/types/FieldMetadata';
import { recordStoreFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreFamilySelector';
import { FieldMetadataType } from '~/generated-metadata/graphql';

import { usePersistField } from '@/object-record/record-field/hooks/usePersistField';
import { isFieldRichTextDeprecated } from '@/object-record/record-field/types/guards/isFieldRichTextDeprecated';
import { isFieldRichTextValue } from '@/object-record/record-field/types/guards/isFieldRichTextValue';
import { PartialBlock } from '@blocknote/core';
import { isNonEmptyString } from '@sniptt/guards';
import { FieldContext } from '../../contexts/FieldContext';
import { assertFieldMetadata } from '../../types/guards/assertFieldMetadata';

export const useRichTextField = () => {
  const { recordId, fieldDefinition, hotkeyScope, maxWidth } =
    useContext(FieldContext);

  assertFieldMetadata(
    FieldMetadataType.RichTextDeprecated,
    isFieldRichTextDeprecated,
    fieldDefinition,
  );

  const fieldName = fieldDefinition.metadata.fieldName;

  const [fieldValue, setFieldValue] =
    useRecoilState<FieldRichTextDeprecatedValue>(
      recordStoreFamilySelector({
        recordId,
        fieldName: fieldName,
      }),
    );
  const fieldRichTextValue = isFieldRichTextValue(fieldValue)
    ? fieldValue
    : ({ blocknote: null, markdown: null } as FieldRichTextValue);

  const { setDraftValue, getDraftValueSelector } =
    useRecordFieldInput<FieldRichTextDeprecatedValue>(
      `${recordId}-${fieldName}`,
    );

  const draftValue = useRecoilValue(getDraftValueSelector());

  const draftValueParsed: PartialBlock[] = isNonEmptyString(draftValue)
    ? JSON.parse(draftValue)
    : draftValue;

  const persistField = usePersistField();

  const persistRichTextField = (nextValue: PartialBlock[]) => {
    if (!nextValue) {
      persistField(null);
    } else {
      const parsedValueToPersist = JSON.stringify(nextValue);

      persistField(parsedValueToPersist);
    }
  };

  return {
    draftValue: draftValueParsed,
    setDraftValue,
    maxWidth,
    fieldDefinition,
    fieldValue: fieldRichTextValue,
    setFieldValue,
    hotkeyScope,
    persistRichTextField,
  };
};
