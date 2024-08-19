import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { lastVisitedPageOrViewStateSelector } from '@/navigation/states/selectors/lastVisitedPageOrViewStateSelector';
import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { navigationMemorizedUrlState } from '@/ui/navigation/states/navigationMemorizedUrlState';
import { extractComponentState } from '@/ui/utilities/state/component-state/utils/extractComponentState';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';

export const useLastVisitedPageOrView = () => {
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const scopeId = currentWorkspace?.id ?? '';
  const currentPagesState = extractComponentState(
    lastVisitedPageOrViewStateSelector,
    scopeId,
  );
  const [currentPages, setCurrentPages] = useRecoilState(currentPagesState);
  const {
    findActiveObjectMetadataItemBySlug,
    alphaSortedActiveObjectMetadataItems,
  } = useFilteredObjectMetadataItems();

  const resetNavigationMemorizedUrl = useSetRecoilState(
    navigationMemorizedUrlState,
  );

  const lastVisitedObjectMetadataId =
    currentPages?.['last_visited_object'] ?? null;

  const removeMatchingIdInCaseLastVisited = ({
    objectMetadataId,
  }: {
    objectMetadataId: string;
  }) => {
    const isDeactivateDefault = isDeeplyEqual(
      lastVisitedObjectMetadataId,
      objectMetadataId,
    );

    const [newFallbackObjectMetadataItem] =
      alphaSortedActiveObjectMetadataItems.filter(
        (item) => item.id !== objectMetadataId,
      );

    setCurrentPages({
      ...(isDeactivateDefault && {
        last_visited_object: newFallbackObjectMetadataItem.id,
      }),
      [objectMetadataId]: undefined,
    });

    if (isDeactivateDefault) {
      resetNavigationMemorizedUrl(
        `/objects/${newFallbackObjectMetadataItem.namePlural}`,
      );
    }
  };

  const setLastVisitedObjectOrView = ({
    componentId,
    viewId,
  }: {
    componentId: string;
    viewId: string;
  }) => {
    const fallbackObjectMetadataId =
      findActiveObjectMetadataItemBySlug(componentId)?.id ?? '';
    /* when both are equal meaning there was change in view else 
      there was a object page change from nav
    */
    const fallbackViewId =
      lastVisitedObjectMetadataId === fallbackObjectMetadataId
        ? viewId
        : (currentPages?.[fallbackObjectMetadataId] ?? viewId);

    setCurrentPages({
      last_visited_object: fallbackObjectMetadataId,
      [fallbackObjectMetadataId]: fallbackViewId,
    });
  };

  const getLastVisitedViewId = (pluralName: string) => {
    const objectMetadataId: string | undefined =
      findActiveObjectMetadataItemBySlug(pluralName)?.id;
    return objectMetadataId ? currentPages?.[objectMetadataId] : undefined;
  };

  const getLastVisitedViewIdFromObjectId = (objectMetadataId: string) => {
    return currentPages?.[objectMetadataId];
  };
  return {
    lastVisitedObjectMetadataId,
    setLastVisitedObjectOrView,
    getLastVisitedViewId,
    getLastVisitedViewIdFromObjectId,
    removeMatchingIdInCaseLastVisited,
  };
};
