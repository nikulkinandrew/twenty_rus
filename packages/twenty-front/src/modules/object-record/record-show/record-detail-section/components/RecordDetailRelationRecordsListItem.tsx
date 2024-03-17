import { useContext } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  Dropdown,
  DropdownMenuItemsContainer,
  DropdownScope,
  IconDotsVertical,
  IconTrash,
  IconUnlink,
  LightIconButton,
  MenuItem,
  useDropdown,
} from 'twenty-ui';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { RecordChip } from '@/object-record/components/RecordChip';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord.ts';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { usePersistField } from '@/object-record/record-field/hooks/usePersistField';
import { FieldRelationMetadata } from '@/object-record/record-field/types/FieldMetadata';
import { RecordDetailRecordsListItem } from '@/object-record/record-show/record-detail-section/components/RecordDetailRecordsListItem';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';

const StyledListItem = styled(RecordDetailRecordsListItem)<{
  isDropdownOpen?: boolean;
}>`
  ${({ isDropdownOpen, theme }) =>
    !isDropdownOpen &&
    css`
      .displayOnHover {
        opacity: 0;
        pointer-events: none;
        transition: opacity ${theme.animation.duration.instant}s ease;
      }
    `}

  &:hover {
    .displayOnHover {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

type RecordDetailRelationRecordsListItemProps = {
  relationRecord: ObjectRecord;
};

export const RecordDetailRelationRecordsListItem = ({
  relationRecord,
}: RecordDetailRelationRecordsListItemProps) => {
  const { fieldDefinition } = useContext(FieldContext);

  const {
    relationFieldMetadataId,
    relationObjectMetadataNameSingular,
    relationType,
  } = fieldDefinition.metadata as FieldRelationMetadata;

  const isToOneObject = relationType === 'TO_ONE_OBJECT';
  const { objectMetadataItem: relationObjectMetadataItem } =
    useObjectMetadataItem({
      objectNameSingular: relationObjectMetadataNameSingular,
    });
  const persistField = usePersistField();
  const { updateOneRecord: updateOneRelationRecord } = useUpdateOneRecord({
    objectNameSingular: relationObjectMetadataNameSingular,
  });

  const { deleteOneRecord: deleteOneRelationRecord } = useDeleteOneRecord({
    objectNameSingular: relationObjectMetadataNameSingular,
  });

  const dropdownScopeId = `record-field-card-menu-${relationRecord.id}`;

  const { closeDropdown, isDropdownOpen } = useDropdown(dropdownScopeId);

  const handleDetach = () => {
    closeDropdown();

    const relationFieldMetadataItem = relationObjectMetadataItem.fields.find(
      ({ id }) => id === relationFieldMetadataId,
    );

    if (!relationFieldMetadataItem?.name) return;

    if (isToOneObject) {
      persistField(null);
      return;
    }

    updateOneRelationRecord({
      idToUpdate: relationRecord.id,
      updateOneRecordInput: {
        [relationFieldMetadataItem.name]: null,
      },
    });
  };

  const handleDelete = async () => {
    closeDropdown();
    await deleteOneRelationRecord(relationRecord.id);
  };

  const isAccountOwnerRelation =
    relationObjectMetadataNameSingular ===
    CoreObjectNameSingular.WorkspaceMember;

  return (
    <StyledListItem isDropdownOpen={isDropdownOpen}>
      <RecordChip
        record={relationRecord}
        objectNameSingular={relationObjectMetadataItem.nameSingular}
      />
      {
        <DropdownScope dropdownScopeId={dropdownScopeId}>
          <Dropdown
            dropdownId={dropdownScopeId}
            dropdownPlacement="right-start"
            clickableComponent={
              <LightIconButton
                className="displayOnHover"
                Icon={IconDotsVertical}
                accent="tertiary"
              />
            }
            dropdownComponents={
              <DropdownMenuItemsContainer>
                <MenuItem
                  LeftIcon={IconUnlink}
                  text="Detach"
                  onClick={handleDetach}
                />
                {!isAccountOwnerRelation && (
                  <MenuItem
                    LeftIcon={IconTrash}
                    text="Delete"
                    accent="danger"
                    onClick={handleDelete}
                  />
                )}
              </DropdownMenuItemsContainer>
            }
            dropdownHotkeyScope={{
              scope: dropdownScopeId,
            }}
          />
        </DropdownScope>
      }
    </StyledListItem>
  );
};
