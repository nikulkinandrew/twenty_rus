import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { CurrentWorkspaceMemberOrphanFavorites } from '@/favorites/components/CurrentWorkspaceMemberOrphanFavorites';
import { FavoritesDragProvider } from '@/favorites/components/FavoritesDragProvider';
import { FavoriteFolders } from '@/favorites/components/FavoritesFolders';
import { FavoritesSkeletonLoader } from '@/favorites/components/FavoritesSkeletonLoader';
import { useFavorites } from '@/favorites/hooks/useFavorites';
import { useReorderFavorite } from '@/favorites/hooks/useReorderFavorite';
import { isFavoriteFolderCreatingState } from '@/favorites/states/isFavoriteFolderCreatingState';
import { useIsPrefetchLoading } from '@/prefetch/hooks/useIsPrefetchLoading';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { useTheme } from '@emotion/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconFolderPlus, isDefined } from 'twenty-ui';

export const CurrentWorkspaceMemberFavoritesFolders = () => {
  const theme = useTheme();
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);
  const { sortedFavorites: favorites } = useFavorites();
  const [isFavoriteFolderCreating, setIsFavoriteFolderCreating] =
    useRecoilState(isFavoriteFolderCreatingState);
  const { handleReorderFavorite } = useReorderFavorite();

  const isFavoriteFolderEnabled = useIsFeatureEnabled(
    'IS_FAVORITE_FOLDER_ENABLED',
  );
  const loading = useIsPrefetchLoading();

  const {
    toggleNavigationSection,
    isNavigationSectionOpenState,
    openNavigationSection,
  } = useNavigationSection('Favorites');
  const isNavigationSectionOpen = useRecoilValue(isNavigationSectionOpenState);

  const toggleNewFolder = () => {
    openNavigationSection();
    setIsFavoriteFolderCreating((current) => !current);
  };

  const shouldDisplayFavoritesWithFeatureFlagEnabled = true;

  //todo: remove this logic once feature flag gating is removed
  const shouldDisplayFavoritesWithoutFeatureFlagEnabled =
    favorites.length > 0 || isFavoriteFolderCreating;

  const shouldDisplayFavorites = isFavoriteFolderEnabled
    ? shouldDisplayFavoritesWithFeatureFlagEnabled
    : shouldDisplayFavoritesWithoutFeatureFlagEnabled;

  if (loading && isDefined(currentWorkspaceMember)) {
    return <FavoritesSkeletonLoader />;
  }

  if (!shouldDisplayFavorites) {
    return null;
  }

  return (
    <NavigationDrawerSection>
      <NavigationDrawerAnimatedCollapseWrapper>
        <NavigationDrawerSectionTitle
          label="Favorites"
          onClick={toggleNavigationSection}
          rightIcon={
            isFavoriteFolderEnabled ? (
              <IconFolderPlus size={theme.icon.size.sm} />
            ) : undefined
          }
          onRightIconClick={
            isFavoriteFolderEnabled ? toggleNewFolder : undefined
          }
        />
      </NavigationDrawerAnimatedCollapseWrapper>

      {isNavigationSectionOpen && (
        <FavoritesDragProvider onReorder={handleReorderFavorite}>
          {isFavoriteFolderEnabled && (
            <FavoriteFolders
              isNavigationSectionOpen={isNavigationSectionOpen}
            />
          )}
          <CurrentWorkspaceMemberOrphanFavorites />
        </FavoritesDragProvider>
      )}
    </NavigationDrawerSection>
  );
};
