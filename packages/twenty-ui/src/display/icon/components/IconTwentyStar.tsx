import IconTwentyStarRaw from '../assets/twenty-star.svg?react';
import { TablerIconsProps } from '..';

type IconTwentyStarProps = TablerIconsProps;

export const IconTwentyStar = (props: IconTwentyStarProps): JSX.Element => {
  const size = props.size ?? 24;
  const stroke = props.stroke ?? 2;

  return <IconTwentyStarRaw height={size} width={size} strokeWidth={stroke} />;
};
