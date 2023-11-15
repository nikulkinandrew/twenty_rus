import { FieldMetadataType } from 'src/metadata/field-metadata/field-metadata.entity';

const viewMetadata = {
  nameSingular: 'viewV2',
  namePlural: 'viewsV2',
  labelSingular: 'View',
  labelPlural: 'Views',
  targetTableName: 'view',
  description: '(System) Views',
  icon: 'IconLayoutCollage',
  isActive: true,
  isSystem: true,
  fields: [
    {
      type: FieldMetadataType.TEXT,
      name: 'name',
      label: 'Name',
      targetColumnMap: {
        value: 'name',
      },
      description: 'View name',
      icon: null,
      isNullable: false,
    },
    {
      type: FieldMetadataType.TEXT,
      name: 'objectMetadataId',
      label: 'Object Metadata Id',
      targetColumnMap: {
        value: 'objectMetadataId',
      },
      description: 'View target object',
      icon: null,
      isNullable: false,
    },
    {
      type: FieldMetadataType.TEXT,
      name: 'type',
      label: 'Type',
      targetColumnMap: {
        value: 'type',
      },
      description: 'View type',
      icon: null,
      isNullable: false,
    },
    {
      isCustom: false,
      isActive: true,
      type: FieldMetadataType.RELATION,
      name: 'viewFields',
      label: 'View Fields',
      targetColumnMap: {},
      description: 'View Fields',
      icon: 'IconTag',
      isNullable: true,
    },
    {
      isCustom: false,
      isActive: true,
      type: FieldMetadataType.RELATION,
      name: 'viewSorts',
      label: 'View Sorts',
      targetColumnMap: {},
      description: 'View Sorts',
      icon: 'IconArrowsSort',
      isNullable: true,
    },
    {
      isCustom: false,
      isActive: true,
      type: FieldMetadataType.RELATION,
      name: 'viewFilters',
      label: 'View Filters',
      targetColumnMap: {},
      description: 'View Filters',
      icon: 'IconFilterBolt',
      isNullable: true,
    },
  ],
};

export default viewMetadata;
