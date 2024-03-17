import { useSetRecoilState } from 'recoil';
import {
  Button,
  ButtonGroup,
  IconCheckbox,
  IconNotes,
  IconPaperclip,
  useTabList,
} from 'twenty-ui';

import { useOpenCreateActivityDrawer } from '@/activities/hooks/useOpenCreateActivityDrawer';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { TAB_LIST_COMPONENT_ID } from '@/ui/layout/show-page/components/ShowPageRightContainer';

export const TimelineCreateButtonGroup = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const { activeTabIdState } = useTabList(TAB_LIST_COMPONENT_ID);
  const setActiveTabId = useSetRecoilState(activeTabIdState);

  const openCreateActivity = useOpenCreateActivityDrawer();

  return (
    <ButtonGroup variant={'secondary'}>
      <Button
        Icon={IconNotes}
        title="Note"
        onClick={() =>
          openCreateActivity({
            type: 'Note',
            targetableObjects: [targetableObject],
          })
        }
      />
      <Button
        Icon={IconCheckbox}
        title="Task"
        onClick={() =>
          openCreateActivity({
            type: 'Task',
            targetableObjects: [targetableObject],
          })
        }
      />
      <Button
        Icon={IconPaperclip}
        title="File"
        onClick={() => setActiveTabId('files')}
      />
    </ButtonGroup>
  );
};
