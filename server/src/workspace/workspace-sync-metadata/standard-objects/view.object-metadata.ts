import { FieldMetadataType } from 'src/metadata/field-metadata/field-metadata.entity';
import { RelationMetadataType } from 'src/metadata/relation-metadata/relation-metadata.entity';
import {
  ObjectMetadata,
  IsSystem,
  FieldMetadata,
  RelationMetadata,
  IsNullable,
} from 'src/workspace/workspace-sync-metadata/decorators/metadata.decorator';
import { BaseObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/base.object-metadata';
import { ViewFieldObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/view-field.object-metadata';
import { ViewFilterObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/view-filter.object-metadata';
import { ViewSortObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/view-sort.object-metadata';

@ObjectMetadata({
  namePlural: 'views',
  labelSingular: 'View',
  labelPlural: 'Views',
  description: '(System) Views',
  icon: 'IconLayoutCollage',
})
@IsSystem()
export class ViewObjectMetadata extends BaseObjectMetadata {
  @FieldMetadata({
    type: FieldMetadataType.TEXT,
    label: 'Name',
    description: 'View name',
    icon: null,
  })
  name: string;

  @FieldMetadata({
    type: FieldMetadataType.UUID,
    label: 'Object Metadata Id',
    description: 'View target object',
    icon: null,
  })
  @IsNullable()
  objectMetadataId: string;

  @FieldMetadata({
    type: FieldMetadataType.TEXT,
    label: 'Type',
    description: 'View type',
    icon: null,
    defaultValue: { value: 'table' },
  })
  type: string;

  @FieldMetadata({
    type: FieldMetadataType.RELATION,
    label: 'View Fields',
    description: 'View Fields',
    icon: 'IconTag',
  })
  @RelationMetadata({
    type: RelationMetadataType.ONE_TO_MANY,
    objectName: 'viewField',
  })
  viewFields: ViewFieldObjectMetadata[];

  @FieldMetadata({
    type: FieldMetadataType.RELATION,
    label: 'View Filters',
    description: 'View Filters',
    icon: 'IconFilterBolt',
  })
  @RelationMetadata({
    type: RelationMetadataType.ONE_TO_MANY,
    objectName: 'viewFilter',
  })
  viewFilters: ViewFilterObjectMetadata[];

  @FieldMetadata({
    type: FieldMetadataType.RELATION,
    label: 'View Sorts',
    description: 'View Sorts',
    icon: 'IconArrowsSort',
  })
  @RelationMetadata({
    type: RelationMetadataType.ONE_TO_MANY,
    objectName: 'viewSort',
  })
  viewSorts: ViewSortObjectMetadata[];
}
