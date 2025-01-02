import { useLastVisitedView } from '@/navigation/hooks/useLastVisitedView';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { usePrefetchedData } from '@/prefetch/hooks/usePrefetchedData';
import { PrefetchKey } from '@/prefetch/types/PrefetchKey';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerItemsCollapsableContainer } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItemsCollapsableContainer';
import { NavigationDrawerSubItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSubItem';
import { getNavigationSubItemLeftAdornment } from '@/ui/navigation/navigation-drawer/utils/getNavigationSubItemLeftAdornment';
import { View } from '@/views/types/View';
import { getObjectMetadataItemViews } from '@/views/utils/getObjectMetadataItemViews';
import { useLocation } from 'react-router-dom';
import { AnimatedExpandableContainer, useIcons } from 'twenty-ui';

export type NavigationDrawerItemForObjectMetadataItemProps = {
  objectMetadataItem: ObjectMetadataItem;
};

export const NavigationDrawerItemForObjectMetadataItem = ({
  objectMetadataItem,
}: NavigationDrawerItemForObjectMetadataItemProps) => {
  const { records: views } = usePrefetchedData<View>(PrefetchKey.AllViews);

  const objectMetadataViews = getObjectMetadataItemViews(
    objectMetadataItem.id,
    views,
  );

  const { getIcon } = useIcons();
  const currentPath = useLocation().pathname;
  const { getLastVisitedViewIdFromObjectMetadataItemId } = useLastVisitedView();

  const lastVisitedViewId = getLastVisitedViewIdFromObjectMetadataItemId(
    objectMetadataItem.id,
  );

  const viewId = lastVisitedViewId ?? objectMetadataViews[0]?.id;

  const navigationPath = `/objects/${objectMetadataItem.namePlural}${
    viewId ? `?view=${viewId}` : ''
  }`;

  const isActive =
    currentPath === `/objects/${objectMetadataItem.namePlural}` ||
    currentPath.includes(`object/${objectMetadataItem.nameSingular}/`);

  const shouldSubItemsBeDisplayed = isActive && objectMetadataViews.length > 1;

  const sortedObjectMetadataViews = [...objectMetadataViews].sort(
    (viewA, viewB) => viewA.position - viewB.position,
  );

  const selectedSubItemIndex = sortedObjectMetadataViews.findIndex(
    (view) => viewId === view.id,
  );

  const subItemArrayLength = sortedObjectMetadataViews.length;

  return (
    <NavigationDrawerItemsCollapsableContainer
      isGroup={shouldSubItemsBeDisplayed}
    >
      <NavigationDrawerItem
        key={objectMetadataItem.id}
        label={objectMetadataItem.labelPlural}
        to={navigationPath}
        Icon={getIcon(objectMetadataItem.icon)}
        active={isActive}
      />

      <AnimatedExpandableContainer
        isExpanded={shouldSubItemsBeDisplayed}
        dimension="height"
        mode="fit-content"
        useThemeAnimation
        containAnimation
      >
        {sortedObjectMetadataViews.map((view, index) => (
          <NavigationDrawerSubItem
            label={view.name}
            to={`/objects/${objectMetadataItem.namePlural}?view=${view.id}`}
            active={viewId === view.id}
            subItemState={getNavigationSubItemLeftAdornment({
              index,
              arrayLength: subItemArrayLength,
              selectedIndex: selectedSubItemIndex,
            })}
            Icon={getIcon(view.icon)}
            key={view.id}
          />
        ))}
      </AnimatedExpandableContainer>
    </NavigationDrawerItemsCollapsableContainer>
  );
};
