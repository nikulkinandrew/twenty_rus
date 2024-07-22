import { useOpenCreateActivityDrawer } from '@/activities/hooks/useOpenCreateActivityDrawer';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { PageAddButton } from '@/ui/layout/page/PageAddButton';

export const PageAddTaskButton = () => {
  const openCreateActivity = useOpenCreateActivityDrawer({
    objectNameSingular: CoreObjectNameSingular.Task,
  });

  // TODO: fetch workspace member from filter here

  const handleClick = () => {
    openCreateActivity({
      targetableObjects: [],
    });
  };

  return <PageAddButton onClick={handleClick} />;
};
