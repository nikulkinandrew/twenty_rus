import { IconComponent } from 'twenty-ui';

import { FilterableFieldType } from './FilterableFieldType';

export type FilterDefinition = {
  fieldMetadataId: string;
  label: string;
  fieldName: string;
  iconName: string;
  type: FilterableFieldType;
  relationObjectMetadataNamePlural?: string;
  relationObjectMetadataNameSingular?: string;
  selectAllLabel?: string;
  SelectAllIcon?: IconComponent;
  isSubField?: boolean;
};
