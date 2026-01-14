// ============================================
// PlayNxt - Constants
// ============================================

import { Sport, SportType } from '@/types';

export const COLORS = {
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  primaryLight: '#818CF8',
  secondary: '#10B981',
  secondaryDark: '#059669',
  accent: '#F59E0B',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display: 32,
};

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const SPORTS: Sport[] = [
  { id: 'football', name: 'Football', icon: '⚽', color: '#22C55E' },
  { id: 'cricket', name: 'Cricket', icon: '🏏', color: '#3B82F6' },
  { id: 'badminton', name: 'Badminton', icon: '🏸', color: '#8B5CF6' },
  { id: 'tennis', name: 'Tennis', icon: '🎾', color: '#EAB308' },
  { id: 'basketball', name: 'Basketball', icon: '🏀', color: '#F97316' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', color: '#EC4899' },
  { id: 'table-tennis', name: 'Table Tennis', icon: '🏓', color: '#14B8A6' },
  { id: 'squash', name: 'Squash', icon: '🎯', color: '#6366F1' },
];

export const SKILL_LEVELS = [
  { id: 'beginner', name: 'Beginner', description: 'Just starting out' },
  { id: 'intermediate', name: 'Intermediate', description: 'Play regularly' },
  { id: 'advanced', name: 'Advanced', description: 'Competitive player' },
  { id: 'pro', name: 'Pro', description: 'Professional level' },
];

export const AMENITIES = [
  'Parking',
  'Changing Room',
  'Shower',
  'Drinking Water',
  'First Aid',
  'Equipment Rental',
  'Cafeteria',
  'Floodlights',
  'AC',
  'WiFi',
];

export const getSportById = (id: SportType): Sport | undefined => {
  return SPORTS.find(sport => sport.id === id);
};

export const formatPrice = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const getSkillLevelColor = (level: string): string => {
  switch (level) {
    case 'beginner':
      return COLORS.success;
    case 'intermediate':
      return COLORS.info;
    case 'advanced':
      return COLORS.warning;
    case 'pro':
      return COLORS.error;
    default:
      return COLORS.textSecondary;
  }
};

