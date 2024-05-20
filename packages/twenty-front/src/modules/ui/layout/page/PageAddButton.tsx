import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useTheme } from '@emotion/react';
import { IconPlus } from 'twenty-ui';

import { IconButton } from '@/ui/input/button/components/IconButton';
import { useUserOrMetadataLoading } from '~/hooks/useUserOrMetadataLoading';

type PageAddButtonProps = {
  onClick: () => void;
};

const StyledSkeletonLoader = () => {
  const theme = useTheme();
  return (
    <SkeletonTheme
      baseColor={theme.background.tertiary}
      highlightColor={theme.background.transparent.lighter}
      borderRadius={4}
    >
      <Skeleton width={132} height={16} />
    </SkeletonTheme>
  );
};

export const PageAddButton = ({ onClick }: PageAddButtonProps) => {
  const loading = useUserOrMetadataLoading();

  if (loading) {
    return <StyledSkeletonLoader />;
  }

  return (
    <IconButton
      Icon={IconPlus}
      dataTestId="add-button"
      size="medium"
      variant="secondary"
      accent="default"
      onClick={onClick}
      ariaLabel="Add"
    />
  );
};
