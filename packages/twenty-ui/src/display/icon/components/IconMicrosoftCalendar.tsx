import { useTheme } from '@emotion/react';

import IconMicrosoftCalendarRaw from '../assets/microsoft-calendar.svg?react';

interface IconMicrosoftCalendarProps {
  size?: number;
}

export const IconMicrosoftCalendar = (props: IconMicrosoftCalendarProps) => {
  const theme = useTheme();
  const size = props.size ?? theme.icon.size.lg;

  return <IconMicrosoftCalendarRaw height={size} width={size} />;
};
