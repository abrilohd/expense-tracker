/**
 * Page transition wrapper component with fade and slide animations
 */
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps page content with fade in + slide up animation
 * Use this component to wrap each page for consistent transitions
 */
export const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger container for animating children one by one
 * Use this to wrap lists of items (cards, table rows, etc.)
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = ({
  children,
  className = '',
  staggerDelay = 0.1,
}: StaggerContainerProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger item - use as child of StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = ({ children, className = '' }: StaggerItemProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Scale pop animation for cards
 */
interface ScalePopProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ScalePop = ({ children, className = '', delay = 0 }: ScalePopProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Slide in from left animation (for table rows)
 */
interface SlideInLeftProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const SlideInLeft = ({ children, className = '', delay = 0 }: SlideInLeftProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Fade in animation
 */
interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const FadeIn = ({ children, className = '', delay = 0 }: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Button press animation (scale down on click)
 */
interface ButtonPressProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const ButtonPress = ({ children, className = '', onClick, disabled = false }: ButtonPressProps) => {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

/**
 * Card hover lift animation
 */
interface CardHoverProps {
  children: ReactNode;
  className?: string;
}

export const CardHover = ({ children, className = '' }: CardHoverProps) => {
  return (
    <motion.div
      whileHover={{
        y: -2,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Shake animation (for delete button hover)
 */
interface ShakeProps {
  children: ReactNode;
  className?: string;
}

export const Shake = ({ children, className = '' }: ShakeProps) => {
  return (
    <motion.div
      whileHover={{
        x: [0, -2, 2, -2, 2, 0],
      }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Rotate animation (for loading spinners)
 */
interface RotateProps {
  children: ReactNode;
  className?: string;
}

export const Rotate = ({ children, className = '' }: RotateProps) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Bounce animation (for success indicators)
 */
interface BounceProps {
  children: ReactNode;
  className?: string;
}

export const Bounce = ({ children, className = '' }: BounceProps) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Pulse animation (for notifications)
 */
interface PulseProps {
  children: ReactNode;
  className?: string;
}

export const Pulse = ({ children, className = '' }: PulseProps) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
