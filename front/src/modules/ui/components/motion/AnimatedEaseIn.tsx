import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props
  extends Omit<
    React.ComponentProps<typeof motion.div>,
    'initial' | 'animated' | 'transition'
  > {
  duration?: number;
}

export const AnimatedEaseIn: React.FC<Props> = ({
  children,
  duration = 0.8,
  ...restProps
}) => {
  const initial = useMemo(() => ({ opacity: 0 }), []);
  const animate = useMemo(() => ({ opacity: 1 }), []);
  const transition = useMemo(() => ({ ease: 'linear', duration }), [duration]);

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      {...restProps}
    >
      {children}
    </motion.div>
  );
};
