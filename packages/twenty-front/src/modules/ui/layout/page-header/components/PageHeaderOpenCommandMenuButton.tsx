import { Button, IconButton, IconDotsVertical, useIsMobile } from 'twenty-ui';

import { useCommandMenu } from '@/command-menu/hooks/useCommandMenu';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey } from '~/generated/graphql';

export const PageHeaderOpenCommandMenuButton = () => {
  const { openCommandMenu } = useCommandMenu();

  const isPageHeaderV2Enabled = useIsFeatureEnabled(
    FeatureFlagKey.IsPageHeaderV2Enabled,
  );

  const isMobile = useIsMobile();

  return (
    <>
      {isPageHeaderV2Enabled ? (
        <Button
          Icon={IconDotsVertical}
          dataTestId="page-header-open-command-menu-button"
          size={isMobile ? 'medium' : 'small'}
          variant="secondary"
          accent="default"
          shortcut={isMobile ? '' : '⌘K'}
          ariaLabel="Open command menu"
          onClick={openCommandMenu}
        />
      ) : (
        <IconButton
          Icon={IconDotsVertical}
          size="medium"
          dataTestId="more-showpage-button"
          accent="default"
          variant="secondary"
          onClick={openCommandMenu}
        />
      )}
    </>
  );
};
