// ============================================
// PlayNxt - Color Palette (Design Tokens)
// ============================================
// Modern, accessible color palette following WCAG guidelines
// Primary: Indigo (energetic, professional)
// Secondary: Emerald (success, sports/health)

/**
 * Core color palette
 * Based on TailwindCSS color system for consistency
 */
export const PALETTE = {
  // Indigo (Primary)
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Emerald (Secondary)
  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Neutral (Gray scale)
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Slate (Cool grays for text)
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Status colors
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  // Pure colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

/**
 * Semantic colors - Use these throughout the app
 * These map to specific use cases for consistency
 */
export const COLORS = {
  // Brand
  primary: PALETTE.indigo[600],
  primaryLight: PALETTE.indigo[400],
  primaryDark: PALETTE.indigo[700],
  primarySurface: PALETTE.indigo[50],

  secondary: PALETTE.emerald[500],
  secondaryLight: PALETTE.emerald[400],
  secondaryDark: PALETTE.emerald[600],
  secondarySurface: PALETTE.emerald[50],

  // Backgrounds
  background: PALETTE.slate[50],
  surface: PALETTE.white,
  surfaceSecondary: PALETTE.slate[100],
  surfaceElevated: PALETTE.white,

  // Text
  text: PALETTE.slate[800],
  textSecondary: PALETTE.slate[500],
  textTertiary: PALETTE.slate[400],
  textInverse: PALETTE.white,

  // Borders
  border: PALETTE.slate[200],
  borderLight: PALETTE.slate[100],
  borderFocus: PALETTE.indigo[500],

  // Status
  success: PALETTE.emerald[500],
  successLight: PALETTE.emerald[50],
  successDark: PALETTE.emerald[600],

  warning: PALETTE.amber[500],
  warningLight: PALETTE.amber[50],
  warningDark: PALETTE.amber[600],

  error: PALETTE.red[500],
  errorLight: PALETTE.red[50],
  errorDark: PALETTE.red[600],

  info: PALETTE.blue[500],
  infoLight: PALETTE.blue[50],
  infoDark: PALETTE.blue[600],

  // Utility
  white: PALETTE.white,
  black: PALETTE.black,
  transparent: PALETTE.transparent,
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Interactive states
  disabled: PALETTE.slate[300],
  disabledText: PALETTE.slate[400],
  pressed: PALETTE.indigo[700],
  hover: PALETTE.indigo[50],
} as const;

/**
 * Helper to add opacity to hex colors
 */
export const withOpacity = (color: string, opacity: number): string => {
  const opacityHex = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${color}${opacityHex}`;
};

