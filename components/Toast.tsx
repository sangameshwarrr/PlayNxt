// ============================================
// PlayNxt - Toast Notification Component
// ============================================
// Animated toast notifications for user feedback
// Supports success, error, warning, and info states

import React, { memo, useEffect, useCallback } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '@/theme';
import { ANIMATION_DURATION, SPRING_CONFIG, EASING } from '@/utils/animations';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  /** Unique identifier for the toast */
  id: string;
  /** Type of toast (affects color and icon) */
  type: ToastType;
  /** Main message to display */
  message: string;
  /** Optional description text */
  description?: string;
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss: (id: string) => void;
}

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: {
    bg: COLORS.successLight,
    border: COLORS.success,
    icon: COLORS.success,
  },
  error: {
    bg: COLORS.errorLight,
    border: COLORS.error,
    icon: COLORS.error,
  },
  warning: {
    bg: COLORS.warningLight,
    border: COLORS.warning,
    icon: COLORS.warningDark,
  },
  info: {
    bg: COLORS.infoLight,
    border: COLORS.info,
    icon: COLORS.info,
  },
};

/**
 * Individual toast notification component
 * Animates in from top with spring physics
 */
export const Toast = memo(function Toast({
  id,
  type,
  message,
  description,
  duration = 4000,
  onDismiss,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const colors = TOAST_COLORS[type];

  // Animate in on mount
  useEffect(() => {
    translateY.value = withSpring(0, SPRING_CONFIG.snappy);
    opacity.value = withTiming(1, { duration: ANIMATION_DURATION.fast });

    // Auto-dismiss after duration
    if (duration > 0) {
      const timeout = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [duration, translateY, opacity]);

  // Animate out and dismiss
  const handleDismiss = useCallback(() => {
    translateY.value = withTiming(-100, {
      duration: ANIMATION_DURATION.normal,
      easing: EASING.accelerate,
    });
    opacity.value = withTiming(0, {
      duration: ANIMATION_DURATION.fast,
    }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)(id);
      }
    });
  }, [id, onDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { marginTop: insets.top + SPACING.sm },
        animatedStyle,
      ]}
    >
      <Pressable
        style={[
          styles.toast,
          { backgroundColor: colors.bg, borderLeftColor: colors.border },
        ]}
        onPress={handleDismiss}
      >
        {/* Icon */}
        <Text style={[styles.icon, { color: colors.icon }]}>
          {TOAST_ICONS[type]}
        </Text>

        {/* Content */}
        <Animated.View style={styles.content}>
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}
        </Animated.View>

        {/* Dismiss button */}
        <Text style={styles.dismiss}>✕</Text>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderLeftWidth: 4,
    ...SHADOWS.lg,
  },
  icon: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  dismiss: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
});

