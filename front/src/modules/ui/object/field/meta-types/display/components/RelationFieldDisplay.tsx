import { EntityChip } from '@/ui/display/chip/components/EntityChip';

import { useRelationField } from '../../hooks/useRelationField';

export const RelationFieldDisplay = () => {
  const { fieldValue, fieldDefinition } = useRelationField();

  const { identifiersMapper } = useRelationField();

  if (!fieldValue || !fieldDefinition || !identifiersMapper) {
    return <></>;
  }

  const objectIdentifiers = identifiersMapper(
    fieldValue,
    fieldDefinition.metadata.objectMetadataNameSingular,
  );

  return (
    <EntityChip
      entityId={fieldValue.id}
      name={objectIdentifiers?.name ?? ''}
      avatarUrl={objectIdentifiers?.avatarUrl}
      avatarType={objectIdentifiers?.avatarType}
    />
  );
};
