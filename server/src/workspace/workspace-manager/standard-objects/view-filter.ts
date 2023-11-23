import { FieldMetadataType } from 'src/metadata/field-metadata/field-metadata.entity';

const viewFilterMetadata = {
  nameSingular: 'viewFilter',
  namePlural: 'viewFilters',
  labelSingular: 'View Filter',
  labelPlural: 'View Filters',
  targetTableName: 'viewFilter',
  description: '(System) View Filters',
  icon: 'IconFilterBolt',
  isActive: true,
  isSystem: true,
  fields: [
    {
      isCustom: false,
      isActive: true,
      type: FieldMetadataType.TEXT,
      name: 'fieldMetadataId',
      label: 'Field Metadata Id',
      targetColumnMap: {
        value: 'fieldMetadataId',
      },
      description: 'View Filter target field',
      icon: null,
      isNullable: false,
      defaultValue: { value: '' },
    },
    {
      isCustom: false,
      isActive: true,
      type: FieldMetadataType.TEXT,
      name: 'operand',
      label: 'Operand',
      targetColumnMap: {
        value: 'operand',
      },
      description: 'View Filter operand',
      icon: null,
      isNullable: false,
      defaultValue: { value: 'Contains' },
    },
    {
      isCustom: false,
      isActive: true,
      type: FieldMetadataType.TEXT,
      name: 'value',
      label: 'Value',
      targetColumnMap: {
        value: 'value',
      },
      description: 'View Filter value',
      icon: null,
      isNullable: false,
      defaultValue: { value: '' },
    },
    {
      isCustom: false,
      isActive: true,
      type: FieldMetadataType.TEXT,
      name: 'displayValue',
      label: 'Display Value',
      targetColumnMap: {
        value: 'displayValue',
      },
      description: 'View Filter Display Value',
      icon: null,
      isNullable: false,
      defaultValue: { value: '' },
    },
    {
      isCustom: false,
      isActive: true,
      type: FieldMetadataType.RELATION,
      name: 'view',
      label: 'View',
      targetColumnMap: {},
      description: 'View Filter related view',
      icon: 'IconLayoutCollage',
      isNullable: true,
    },
    {
      isCustom: false,
      isActive: true,
      type: FieldMetadataType.UUID,
      name: 'viewId',
      label: 'View Id',
      targetColumnMap: {
        value: 'viewId',
      },
      description: 'View Filter related view',
      icon: 'IconLayoutCollage',
      isNullable: false,
    },
  ],
};

export default viewFilterMetadata;
