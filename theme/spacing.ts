// ============================================
// PlayNxt - Spacing (Design Tokens)
// ============================================
// Consistent spacing scale based on 4px base unit

/**
 * Spacing scale (in pixels)
 * Based on 4px base unit for rhythm and consistency
 */
export const SPACING = {
  /** 0px */
  none: 0,
  /** 2px */
  xxs: 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  xxl: 24,
  /** 32px */
  xxxl: 32,
  /** 40px */
  xxxxl: 40,
  /** 48px */
  huge: 48,
  /** 64px */
  massive: 64,
} as const;

/**
 * Border radius scale
 */
export const BORDER_RADIUS = {
  /** 0px - No rounding */
  none: 0,
  /** 4px - Subtle rounding */
  sm: 4,
  /** 8px - Standard rounding */
  md: 8,
  /** 12px - Medium rounding */
  lg: 12,
  /** 16px - Large rounding */
  xl: 16,
  /** 24px - Extra large rounding */
  xxl: 24,
  /** 9999px - Full/pill rounding */
  full: 9999,
} as const;

/**
 * Common layout dimensions
 */
export const LAYOUT = {
  /** Screen horizontal padding */
  screenPadding: SPACING.lg,
  /** Card padding */
  cardPadding: SPACING.lg,
  /** List item height */
  listItemHeight: 56,
  /** Button height */
  buttonHeight: 48,
  /** Input height */
  inputHeight: 48,
  /** Header height */
  headerHeight: 56,
  /** Tab bar height */
  tabBarHeight: 80,
  /** Icon sizes */
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
  /** Avatar sizes */
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 56,
  avatarXl: 80,
} as const;

/**
 * Shadow presets for elevation
 */
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

