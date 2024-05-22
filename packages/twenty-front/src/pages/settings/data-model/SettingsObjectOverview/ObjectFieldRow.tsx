import { Handle, Position } from 'reactflow';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { useIcons } from 'twenty-ui';

import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { capitalize } from '~/utils/string/capitalize';

type ObjectFieldRowProps = {
  field: FieldMetadataItem;
  type: 'from' | 'to';
};

const StyledRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  position: relative;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing(2)};
`;

export const ObjectFieldRow = ({ field, type }: ObjectFieldRowProps) => {
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const { getIcon } = useIcons();
  const theme = useTheme();

  const relatedObjectId =
    type === 'from'
      ? field.toRelationMetadata?.fromObjectMetadata.id
      : field.fromRelationMetadata?.toObjectMetadata.id;
  const relatedObject = objectMetadataItems.find(
    (x) => x.id === relatedObjectId,
  );

  const Icon = getIcon(relatedObject?.icon);

  return (
    <StyledRow>
      {Icon && <Icon size={theme.icon.size.md} />}
      {capitalize(relatedObject?.namePlural ?? '')}
      <Handle
        type={field.toRelationMetadata ? 'source' : 'target'}
        position={Position.Right}
        id={`${field.id}-right`}
        className={
          field.fromRelationMetadata
            ? 'right-handle source-handle'
            : 'right-handle target-handle'
        }
      />
      <Handle
        type={field.toRelationMetadata ? 'source' : 'target'}
        position={Position.Left}
        id={`${field.id}-left`}
        className={
          field.fromRelationMetadata
            ? 'left-handle source-handle'
            : 'left-handle target-handle'
        }
      />
    </StyledRow>
  );
};
