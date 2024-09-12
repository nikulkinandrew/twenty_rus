import { useTheme } from '@emotion/react';

import IllustrationIconNumbersRaw from '@ui/display/icon/assets/illustration-numbers.svg?react';
import { IconComponentProps } from '@ui/display/icon/types/IconComponent';

type IllustrationIconNumbersProps = Pick<IconComponentProps, 'size'>;

export const IllustrationIconNumbers = (
  props: IllustrationIconNumbersProps,
) => {
  const theme = useTheme();
  const size = props.size ?? theme.icon.size.lg;
  const { color, fill } = theme.IllustrationIcon;
  return (
    <IllustrationIconNumbersRaw
      height={size}
      width={size}
      fill={fill}
      color={color}
    />
  );
};
