// ============================================
// PlayNxt - Animation Configuration
// ============================================
// Centralized animation constants and configurations
// All animation values are production-safe and respect accessibility

import { Easing } from 'react-native-reanimated';

/**
 * Animation duration presets (in milliseconds)
 * Fast animations for better perceived performance
 */
export const ANIMATION_DURATION = {
  /** 100ms - Micro-interactions like button press */
  instant: 100,
  /** 150ms - Quick feedback */
  fast: 150,
  /** 200ms - Standard transitions */
  normal: 200,
  /** 300ms - Emphasized animations */
  slow: 300,
  /** 500ms - Complex animations */
  slower: 500,
} as const;

/**
 * Scale values for press animations
 * Subtle scale to indicate interactivity without being distracting
 */
export const SCALE = {
  /** Standard button press scale */
  pressed: 0.97,
  /** More pronounced press for emphasis */
  pressedEmphasis: 0.95,
  /** Subtle press for cards */
  pressedSubtle: 0.98,
  /** Default/resting scale */
  default: 1,
  /** Slight scale up for hover/focus */
  hover: 1.02,
} as const;

/**
 * Opacity values for various states
 */
export const OPACITY = {
  disabled: 0.5,
  pressed: 0.85,
  default: 1,
  overlay: 0.5,
  shimmer: 0.6,
} as const;

/**
 * Spring configuration presets
 * Tuned for natural, responsive feel
 */
export const SPRING_CONFIG = {
  /** Snappy spring for button presses */
  snappy: {
    damping: 15,
    stiffness: 400,
    mass: 0.5,
  },
  /** Bouncy spring for success animations */
  bouncy: {
    damping: 10,
    stiffness: 180,
    mass: 1,
  },
  /** Gentle spring for layout animations */
  gentle: {
    damping: 20,
    stiffness: 120,
    mass: 1,
  },
  /** Default spring */
  default: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
} as const;

/**
 * Easing presets for timing-based animations
 */
export const EASING = {
  /** Standard ease for most animations */
  standard: Easing.bezier(0.4, 0, 0.2, 1),
  /** Ease out for entering elements */
  decelerate: Easing.bezier(0, 0, 0.2, 1),
  /** Ease in for exiting elements */
  accelerate: Easing.bezier(0.4, 0, 1, 1),
  /** Sharp ease for emphasized motion */
  sharp: Easing.bezier(0.4, 0, 0.6, 1),
} as const;

/**
 * Shimmer animation configuration
 */
export const SHIMMER_CONFIG = {
  duration: 1500,
  delay: 0,
  baseOpacity: 0.3,
  highlightOpacity: 0.7,
} as const;

/**
 * Pulse animation configuration for highlights
 */
export const PULSE_CONFIG = {
  duration: 2000,
  minScale: 1,
  maxScale: 1.05,
  minOpacity: 0.7,
  maxOpacity: 1,
} as const;

