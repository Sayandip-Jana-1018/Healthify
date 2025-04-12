'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  variants?: any;
  initial?: any;
  animate?: any;
}

export function AnimatedContainer({ children, className = '', variants, initial, animate }: Props) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      animate={animate}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedHeading({ children, className = '', variants }: Props) {
  return (
    <motion.h1
      className={className}
      variants={variants}
    >
      {children}
    </motion.h1>
  );
}

export function AnimatedParagraph({ children, className = '', variants }: Props) {
  return (
    <motion.p
      className={className}
      variants={variants}
    >
      {children}
    </motion.p>
  );
}
