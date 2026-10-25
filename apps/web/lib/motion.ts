import type { Variants } from 'framer-motion';

const premiumEase = [0.16, 1, 0.3, 1] as const;

export const motionTokens = {
  page: {
    initial: { opacity: 0, y: 10, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
    transition: { duration: 0.28, ease: premiumEase },
  },
  card: {
    initial: { opacity: 0, y: 8, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.24, ease: premiumEase },
  },
  sidebar: {
    expanded: { width: 292 },
    collapsed: { width: 84 },
    transition: { duration: 0.28, ease: premiumEase },
  },
  modal: {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: 8 },
    transition: { duration: 0.2, ease: premiumEase },
  },
  drawer: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 24 },
    transition: { duration: 0.22, ease: premiumEase },
  },
  loading: {
    animate: { opacity: [0.42, 1, 0.42] },
    transition: { repeat: Infinity, duration: 1.45, ease: 'easeInOut' },
  },
} as const;

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: premiumEase } },
};
