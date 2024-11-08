import styled from '@emotion/styled';
import {
  IconButton,
  IconCheckbox,
  IconNotes,
  IconPlus,
  MenuItem,
} from 'twenty-ui';

import { useOpenCreateActivityDrawer } from '@/activities/hooks/useOpenCreateActivityDrawer';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { SHOW_PAGE_ADD_BUTTON_DROPDOWN_ID } from '@/ui/layout/show-page/constants/ShowPageAddButtonDropdownId';

import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { Dropdown } from '../../dropdown/components/Dropdown';
import { DropdownMenu } from '../../dropdown/components/DropdownMenu';

const StyledContainer = styled.div`
  z-index: 1;
`;

export const ShowPageAddButton = ({
  activityTargetObject,
}: {
  activityTargetObject: ActivityTargetableObject;
}) => {
  const { closeDropdown, toggleDropdown } = useDropdown('add-show-page');
  const openNote = useOpenCreateActivityDrawer({
    activityObjectNameSingular: CoreObjectNameSingular.Note,
  });
  const openTask = useOpenCreateActivityDrawer({
    activityObjectNameSingular: CoreObjectNameSingular.Task,
  });

  const handleSelect = (objectNameSingular: CoreObjectNameSingular) => {
    if (objectNameSingular === CoreObjectNameSingular.Note) {
      openNote({
        targetableObjects: [activityTargetObject],
      });
    }
    if (objectNameSingular === CoreObjectNameSingular.Task) {
      openTask({
        targetableObjects: [activityTargetObject],
      });
    }

    closeDropdown();
  };

  if (
    activityTargetObject.targetObjectNameSingular ===
      CoreObjectNameSingular.Task ||
    activityTargetObject.targetObjectNameSingular ===
      CoreObjectNameSingular.Note
  ) {
    return;
  }

  return (
    <StyledContainer>
      <Dropdown
        dropdownId={SHOW_PAGE_ADD_BUTTON_DROPDOWN_ID}
        clickableComponent={
          <IconButton
            Icon={IconPlus}
            size="medium"
            dataTestId="add-showpage-button"
            accent="default"
            variant="secondary"
            onClick={toggleDropdown}
          />
        }
        dropdownComponents={
          <DropdownMenu>
            <DropdownMenuItemsContainer>
              <MenuItem
                onClick={() => handleSelect(CoreObjectNameSingular.Note)}
                accent="default"
                LeftIcon={IconNotes}
                text="Note"
              />
              <MenuItem
                onClick={() => handleSelect(CoreObjectNameSingular.Task)}
                accent="default"
                LeftIcon={IconCheckbox}
                text="Task"
              />
            </DropdownMenuItemsContainer>
          </DropdownMenu>
        }
        dropdownHotkeyScope={{
          scope: PageHotkeyScope.ShowPage,
        }}
      />
    </StyledContainer>
  );
};
