import { FieldDefinition } from '@/ui/field/types/FieldDefinition';
import { FieldMetadata } from '@/ui/field/types/FieldMetadata';

export type ViewFieldForVisibility = Pick<
  FieldDefinition<FieldMetadata>,
  'key' | 'name' | 'Icon'
> & {
  isVisible?: boolean;
  index: number;
};
