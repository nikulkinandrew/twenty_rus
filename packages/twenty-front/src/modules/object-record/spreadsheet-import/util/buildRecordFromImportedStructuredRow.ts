import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { FieldAddressValue } from '@/object-record/record-field/types/FieldMetadata';
import { COMPOSITE_FIELD_IMPORT_LABELS } from '@/object-record/spreadsheet-import/constants/CompositeFieldImportLabels';
import { ImportedStructuredRow } from '@/spreadsheet-import/types';
import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-ui';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { convertCurrencyMicrosToCurrencyAmount } from '~/utils/convertCurrencyToCurrencyMicros';

const castToString = (value: any) => {
  return (value as string) ?? '';
};

export const buildRecordFromImportedStructuredRow = (
  importedStructuredRow: ImportedStructuredRow<any>,
  fields: FieldMetadataItem[],
) => {
  const recordToBuild: Record<string, any> = {};

  const {
    ADDRESS: {
      addressCityLabel,
      addressCountryLabel,
      addressLatLabel,
      addressLngLabel,
      addressPostcodeLabel,
      addressStateLabel,
      addressStreet1Label,
      addressStreet2Label,
    },
    CURRENCY: { amountMicrosLabel, currencyCodeLabel },
    FULL_NAME: { firstNameLabel, lastNameLabel },
  } = COMPOSITE_FIELD_IMPORT_LABELS;

  for (const field of fields) {
    const importedFieldValue = importedStructuredRow[field.name];

    switch (field.type) {
      case FieldMetadataType.Boolean:
        recordToBuild[field.name] =
          importedFieldValue === 'true' || importedFieldValue === true;
        break;
      case FieldMetadataType.Number:
      case FieldMetadataType.Numeric:
        recordToBuild[field.name] = Number(importedFieldValue);
        break;
      case FieldMetadataType.Currency:
        if (
          isDefined(
            importedStructuredRow[`${amountMicrosLabel} (${field.name})`] ||
              importedStructuredRow[`${currencyCodeLabel} (${field.name})`],
          )
        ) {
          recordToBuild[field.name] = {
            amountMicros: convertCurrencyMicrosToCurrencyAmount(
              Number(
                importedStructuredRow[`${amountMicrosLabel} (${field.name})`],
              ),
            ),
            currencyCode:
              importedStructuredRow[`${currencyCodeLabel} (${field.name})`] ||
              'USD',
          };
        }
        break;
      case FieldMetadataType.Address: {
        // TODO: check if validaction has been made to allow casting as string
        if (
          isDefined(
            importedStructuredRow[`${addressStreet1Label} (${field.name})`] ||
              importedStructuredRow[`${addressStreet2Label} (${field.name})`] ||
              importedStructuredRow[`${addressCityLabel} (${field.name})`] ||
              importedStructuredRow[
                `${addressPostcodeLabel} (${field.name})`
              ] ||
              importedStructuredRow[`${addressStateLabel} (${field.name})`] ||
              importedStructuredRow[`${addressCountryLabel} (${field.name})`] ||
              importedStructuredRow[`${addressLatLabel} (${field.name})`] ||
              importedStructuredRow[`${addressLngLabel} (${field.name})`],
          )
        ) {
          recordToBuild[field.name] = {
            addressStreet1: castToString(
              importedStructuredRow[`${addressStreet1Label} (${field.name})`],
            ),
            addressStreet2: castToString(
              importedStructuredRow[`${addressStreet2Label} (${field.name})`],
            ),
            addressCity: castToString(
              importedStructuredRow[`${addressCityLabel} (${field.name})`],
            ),
            addressPostcode: castToString(
              importedStructuredRow[`${addressPostcodeLabel} (${field.name})`],
            ),
            addressState: castToString(
              importedStructuredRow[`${addressStateLabel} (${field.name})`],
            ),
            addressCountry: castToString(
              importedStructuredRow[`${addressCountryLabel} (${field.name})`],
            ),
            addressLat: Number(
              importedStructuredRow[`${addressLatLabel} (${field.name})`],
            ),
            addressLng: Number(
              importedStructuredRow[`${addressLngLabel} (${field.name})`],
            ),
          } satisfies FieldAddressValue;
        }
        break;
      }
      case FieldMetadataType.Link:
        if (importedFieldValue !== undefined) {
          recordToBuild[field.name] = {
            label: field.name,
            url: importedFieldValue || null,
          };
        }
        break;
      case FieldMetadataType.Relation:
        if (
          isDefined(importedFieldValue) &&
          (isNonEmptyString(importedFieldValue) || importedFieldValue !== false)
        ) {
          recordToBuild[field.name + 'Id'] = importedFieldValue;
        }
        break;
      case FieldMetadataType.FullName:
        if (
          isDefined(
            importedStructuredRow[`${firstNameLabel} (${field.name})`] ??
              importedStructuredRow[`${lastNameLabel} (${field.name})`],
          )
        ) {
          recordToBuild[field.name] = {
            firstName:
              importedStructuredRow[`${firstNameLabel} (${field.name})`] ?? '',
            lastName:
              importedStructuredRow[`${lastNameLabel} (${field.name})`] ?? '',
          };
        }
        break;
      default:
        recordToBuild[field.name] = importedFieldValue;
        break;
    }
  }

  return recordToBuild;
};
