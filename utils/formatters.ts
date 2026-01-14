// ============================================
// PlayNxt - Formatting Utilities
// ============================================
// Common formatting functions for display

import { ENV } from '@/config';

/**
 * Format currency amount
 * @param amount - Amount to format
 * @param currency - Currency code (default: from env)
 */
export const formatPrice = (amount: number, currency?: string): string => {
  const curr = currency || ENV.DEFAULT_CURRENCY;

  if (curr === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  return new Intl.NumberFormat(ENV.DEFAULT_LOCALE, {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date for display
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormat options
 */
export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(dateString);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };

  return date.toLocaleDateString(ENV.DEFAULT_LOCALE, options || defaultOptions);
};

/**
 * Format date as full date
 * @param dateString - ISO date string
 */
export const formatDateFull = (dateString: string): string => {
  const date = new Date(dateString);

  return date.toLocaleDateString(ENV.DEFAULT_LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format relative date (today, tomorrow, etc.)
 * @param dateString - ISO date string
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateOnly = dateString.split('T')[0];
  const todayOnly = today.toISOString().split('T')[0];
  const tomorrowOnly = tomorrow.toISOString().split('T')[0];

  if (dateOnly === todayOnly) {
    return 'Today';
  }
  if (dateOnly === tomorrowOnly) {
    return 'Tomorrow';
  }

  return formatDate(dateString);
};

/**
 * Format time from 24h to 12h format
 * @param timeString - Time in HH:MM format
 */
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Format duration in human readable format
 * @param minutes - Duration in minutes
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${mins} min`;
};

/**
 * Format distance
 * @param meters - Distance in meters
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
};

/**
 * Format player count
 * @param current - Current players
 * @param max - Maximum players
 */
export const formatPlayerCount = (current: number, max: number): string => {
  const remaining = max - current;

  if (remaining === 0) {
    return 'Full';
  }

  if (remaining === 1) {
    return '1 spot left';
  }

  return `${remaining} spots left`;
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
};

/**
 * Format timestamp as relative time
 * @param timestamp - ISO timestamp
 */
export const formatTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'Just now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(timestamp);
};

