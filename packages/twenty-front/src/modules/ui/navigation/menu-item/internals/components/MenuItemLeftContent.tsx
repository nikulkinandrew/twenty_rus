import { useTheme } from '@emotion/react';
import { isString } from '@sniptt/guards';
import { ReactNode } from 'react';
import {
  IconComponent,
  IconGripVertical,
  OverflowingTextWithTooltip,
} from 'twenty-ui';

import {
  StyledDraggableItem,
  StyledMenuItemLabel,
  StyledMenuItemLeftContent,
} from './StyledMenuItemBase';

type MenuItemLeftContentProps = {
  className?: string;
  LeftIcon: IconComponent | null | undefined;
  showGrip?: boolean;
  isDisabled?: boolean;
  text: ReactNode;
  smallIcon?: boolean;
};

export const MenuItemLeftContent = ({
  className,
  LeftIcon,
  text,
  showGrip = false,
  isDisabled = false,
  smallIcon,
}: MenuItemLeftContentProps) => {
  const theme = useTheme();

  return (
    <StyledMenuItemLeftContent className={className}>
      {showGrip &&
        (isDisabled ? (
          <IconGripVertical
            size={theme.icon.size.md}
            stroke={theme.icon.stroke.sm}
            color={
              isDisabled ? theme.font.color.extraLight : theme.font.color.light
            }
          />
        ) : (
          <StyledDraggableItem>
            <IconGripVertical
              size={smallIcon ? theme.icon.size.sm : theme.icon.size.md}
              stroke={theme.icon.stroke.sm}
              color={
                isDisabled
                  ? theme.font.color.extraLight
                  : theme.font.color.light
              }
            />
          </StyledDraggableItem>
        ))}
      {LeftIcon && (
        <LeftIcon
          size={smallIcon ? theme.icon.size.sm : theme.icon.size.md}
          stroke={theme.icon.stroke.sm}
        />
      )}
      <StyledMenuItemLabel hasLeftIcon={!!LeftIcon}>
        {isString(text) ? <OverflowingTextWithTooltip text={text} /> : text}
      </StyledMenuItemLabel>
    </StyledMenuItemLeftContent>
  );
};
