// ============================================
// PlayNxt - Typography (Design Tokens)
// ============================================
// Consistent typography scale for the app

import { Platform, TextStyle } from 'react-native';

/**
 * Font family configuration
 * Using system fonts for optimal performance
 */
export const FONT_FAMILY = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
} as const;

/**
 * Font size scale
 */
export const FONT_SIZE = {
  /** 10px - Tiny text (captions, labels) */
  xs: 10,
  /** 12px - Small text (secondary info) */
  sm: 12,
  /** 14px - Body text */
  md: 14,
  /** 16px - Large body */
  lg: 16,
  /** 18px - Small headings */
  xl: 18,
  /** 20px - Headings */
  xxl: 20,
  /** 24px - Large headings */
  xxxl: 24,
  /** 28px - Display small */
  display: 28,
  /** 32px - Display large */
  displayLg: 32,
  /** 40px - Hero text */
  hero: 40,
} as const;

/**
 * Font weight configuration
 * Using string values for React Native compatibility
 */
export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

/**
 * Line height multipliers
 */
export const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

/**
 * Letter spacing
 */
export const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

/**
 * Pre-defined text styles for consistency
 */
export const TEXT_STYLES: Record<string, TextStyle> = {
  // Display
  displayLarge: {
    fontSize: FONT_SIZE.displayLg,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.displayLg * LINE_HEIGHT.tight,
    letterSpacing: LETTER_SPACING.tight,
  },
  displaySmall: {
    fontSize: FONT_SIZE.display,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.display * LINE_HEIGHT.tight,
    letterSpacing: LETTER_SPACING.tight,
  },

  // Headings
  h1: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.xxxl * LINE_HEIGHT.tight,
  },
  h2: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.xxl * LINE_HEIGHT.tight,
  },
  h3: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.xl * LINE_HEIGHT.normal,
  },
  h4: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.lg * LINE_HEIGHT.normal,
  },

  // Body
  bodyLarge: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.lg * LINE_HEIGHT.relaxed,
  },
  body: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.md * LINE_HEIGHT.relaxed,
  },
  bodySmall: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.sm * LINE_HEIGHT.relaxed,
  },

  // Labels & Captions
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: FONT_SIZE.sm * LINE_HEIGHT.normal,
  },
  caption: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.xs * LINE_HEIGHT.normal,
  },

  // Buttons
  buttonLarge: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.lg * LINE_HEIGHT.tight,
  },
  button: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.md * LINE_HEIGHT.tight,
  },
  buttonSmall: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: FONT_SIZE.sm * LINE_HEIGHT.tight,
  },
} as const;

