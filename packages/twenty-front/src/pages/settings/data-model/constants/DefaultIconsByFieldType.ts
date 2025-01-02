import { FieldMetadataType } from '~/generated-metadata/graphql';

export const DEFAULT_ICONS_BY_FIELD_TYPE: Record<FieldMetadataType, string> = {
  [FieldMetadataType.Address]: 'IconMap',
  [FieldMetadataType.Boolean]: 'IconToggleLeft',
  [FieldMetadataType.Currency]: 'IconMoneybag',
  [FieldMetadataType.Date]: 'IconCalendarEvent',
  [FieldMetadataType.DateTime]: 'IconCalendarClock',
  [FieldMetadataType.FullName]: 'IconUserCircle',
  [FieldMetadataType.MultiSelect]: 'IconTags',
  [FieldMetadataType.Number]: 'IconNumber9',
  [FieldMetadataType.Rating]: 'IconStar',
  [FieldMetadataType.RawJson]: 'IconBraces',
  [FieldMetadataType.Relation]: 'IconRelationOneToMany',
  [FieldMetadataType.Select]: 'IconTag',
  [FieldMetadataType.Text]: 'IconTypography',
  [FieldMetadataType.Uuid]: 'IconId',
  [FieldMetadataType.Array]: 'IconBracketsContain',
  [FieldMetadataType.Emails]: 'IconMail',
  [FieldMetadataType.Links]: 'IconWorld',
  [FieldMetadataType.Phones]: 'IconPhone',
  [FieldMetadataType.Actor]: 'IconUsers',
  [FieldMetadataType.Numeric]: 'IconUsers',
  [FieldMetadataType.Position]: 'IconUsers',
  [FieldMetadataType.RichTextOld]: 'IconUsers',
  [FieldMetadataType.TsVector]: 'IconUsers',
};
