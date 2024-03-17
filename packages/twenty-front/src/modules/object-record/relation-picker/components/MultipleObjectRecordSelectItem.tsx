import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import {
  Avatar,
  MenuItemMultiSelectAvatar,
  SelectableItem,
  useSelectableList,
} from 'twenty-ui';
import { v4 } from 'uuid';

import { MULTI_OBJECT_RECORD_SELECT_SELECTABLE_LIST_ID } from '@/object-record/relation-picker/constants/MultiObjectRecordSelectSelectableListId';
import { ObjectRecordForSelect } from '@/object-record/relation-picker/hooks/useMultiObjectSearch';

export const StyledSelectableItem = styled(SelectableItem)`
  height: 100%;
  width: 100%;
`;

export const MultipleObjectRecordSelectItem = ({
  objectRecordForSelect,
  onSelectedChange,
  selected,
}: {
  objectRecordForSelect: ObjectRecordForSelect;
  onSelectedChange?: (selected: boolean) => void;
  selected: boolean;
}) => {
  const { isSelectedItemIdSelector } = useSelectableList(
    MULTI_OBJECT_RECORD_SELECT_SELECTABLE_LIST_ID,
  );

  const isSelectedByKeyboard = useRecoilValue(
    isSelectedItemIdSelector(objectRecordForSelect.record.id),
  );

  return (
    <StyledSelectableItem
      itemId={objectRecordForSelect.record.id}
      key={objectRecordForSelect.record.id + v4()}
    >
      <MenuItemMultiSelectAvatar
        selected={selected}
        onSelectChange={onSelectedChange}
        isKeySelected={isSelectedByKeyboard}
        avatar={
          <Avatar
            avatarUrl={objectRecordForSelect.recordIdentifier.avatarUrl}
            entityId={objectRecordForSelect.record.id}
            placeholder={objectRecordForSelect.recordIdentifier.name}
            size="md"
            type={
              objectRecordForSelect.recordIdentifier.avatarType ?? 'rounded'
            }
          />
        }
        text={objectRecordForSelect.recordIdentifier.name}
      />
    </StyledSelectableItem>
  );
};
