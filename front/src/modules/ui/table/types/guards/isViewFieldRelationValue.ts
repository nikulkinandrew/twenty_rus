import { ViewFieldRelationValue } from '../ViewField';

// TODO: add yup
export function isViewFieldRelationValue(
  fieldValue: unknown,
): fieldValue is ViewFieldRelationValue {
  return (
    fieldValue !== null &&
    fieldValue !== undefined &&
    typeof fieldValue === 'object'
  );
}
