import { Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { currencyFieldDefaultValueSchema } from '@/object-record/record-field/validation-schemas/currencyFieldDefaultValueSchema';
import { SettingsOptionCardContent } from '@/settings/components/SettingsOptionCardContent';
import { SETTINGS_FIELD_CURRENCY_CODES } from '@/settings/data-model/constants/SettingsFieldCurrencyCodes';
import { useCurrencySettingsFormInitialValues } from '@/settings/data-model/fields/forms/currency/hooks/useCurrencySettingsFormInitialValues';
import { IllustrationIconCurrencyDollar } from 'twenty-ui';
import { applySimpleQuotesToString } from '~/utils/string/applySimpleQuotesToString';

export const settingsDataModelFieldCurrencyFormSchema = z.object({
  defaultValue: currencyFieldDefaultValueSchema,
});

export type SettingsDataModelFieldCurrencyFormValues = z.infer<
  typeof settingsDataModelFieldCurrencyFormSchema
>;

type SettingsDataModelFieldCurrencyFormProps = {
  disabled?: boolean;
  fieldMetadataItem: Pick<FieldMetadataItem, 'defaultValue'>;
};

const OPTIONS = Object.entries(SETTINGS_FIELD_CURRENCY_CODES).map(
  ([value, { label, Icon }]) => ({
    label,
    value: applySimpleQuotesToString(value),
    Icon,
  }),
);

export const SettingsDataModelFieldCurrencyForm = ({
  disabled,
  fieldMetadataItem,
}: SettingsDataModelFieldCurrencyFormProps) => {
  const { control } =
    useFormContext<SettingsDataModelFieldCurrencyFormValues>();

  const { initialAmountMicrosValue, initialCurrencyCodeValue } =
    useCurrencySettingsFormInitialValues({ fieldMetadataItem });

  return (
    <>
      <Controller
        name="defaultValue.amountMicros"
        control={control}
        defaultValue={initialAmountMicrosValue}
        render={() => <></>}
      />
      <Controller
        name="defaultValue.currencyCode"
        control={control}
        defaultValue={initialCurrencyCodeValue}
        render={({ field: { onChange, value } }) => (
          <SettingsOptionCardContent
            variant="select"
            Icon={IllustrationIconCurrencyDollar}
            title="Default Value"
            description="Choose the default currency that will apply"
            value={value}
            onChange={onChange}
            disabled={disabled}
            fullWidth
            dropdownId="object-field-default-value-select-currency"
            options={OPTIONS}
          />
        )}
      />
    </>
  );
};
