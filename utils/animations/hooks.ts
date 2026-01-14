// ============================================
// PlayNxt - Animation Hooks
// ============================================
// Reusable animation hooks for consistent micro-interactions
// All animations respect accessibility settings

import { useCallback, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolation,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import { useReducedMotion } from 'react-native-reanimated';
import {
  ANIMATION_DURATION,
  SCALE,
  SPRING_CONFIG,
  EASING,
  SHIMMER_CONFIG,
  PULSE_CONFIG,
} from './config';

/**
 * Hook for press scale animation
 * Creates a subtle scale effect on press for better tactile feedback
 *
 * @param scaleValue - The scale to animate to on press (default: 0.97)
 * @returns Object with animated style and press handlers
 */
export const usePressAnimation = (scaleValue: number = SCALE.pressed) => {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    if (reduceMotion) return;
    scale.value = withSpring(scaleValue, SPRING_CONFIG.snappy);
  }, [reduceMotion, scaleValue, scale]);

  const onPressOut = useCallback(() => {
    if (reduceMotion) return;
    scale.value = withSpring(SCALE.default, SPRING_CONFIG.snappy);
  }, [reduceMotion, scale]);

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
};

/**
 * Hook for shimmer/skeleton loading effect
 * Creates a smooth shimmer animation for loading states
 *
 * @returns Object with animated style for shimmer effect
 */
export const useShimmer = () => {
  const reduceMotion = useReducedMotion();
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      shimmerValue.value = 0.5; // Static middle value for reduced motion
      return;
    }

    shimmerValue.value = withRepeat(
      withTiming(1, {
        duration: SHIMMER_CONFIG.duration,
        easing: EASING.standard,
      }),
      -1, // Infinite repeat
      false // No reverse
    );

    return () => {
      cancelAnimation(shimmerValue);
    };
  }, [reduceMotion, shimmerValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      shimmerValue.value,
      [0, 0.5, 1],
      [SHIMMER_CONFIG.baseOpacity, SHIMMER_CONFIG.highlightOpacity, SHIMMER_CONFIG.baseOpacity],
      Extrapolation.CLAMP
    ),
  }));

  return { animatedStyle, shimmerValue };
};

/**
 * Hook for pulse animation (used for highlights/deals)
 * Creates a subtle pulsing effect to draw attention
 *
 * @param enabled - Whether the pulse animation is active
 * @returns Object with animated style for pulse effect
 */
export const usePulse = (enabled: boolean = true) => {
  const reduceMotion = useReducedMotion();
  const pulseValue = useSharedValue(0);

  useEffect(() => {
    if (!enabled || reduceMotion) {
      pulseValue.value = 0;
      return;
    }

    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: PULSE_CONFIG.duration / 2, easing: EASING.standard }),
        withTiming(0, { duration: PULSE_CONFIG.duration / 2, easing: EASING.standard })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(pulseValue);
    };
  }, [enabled, reduceMotion, pulseValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          pulseValue.value,
          [0, 1],
          [PULSE_CONFIG.minScale, PULSE_CONFIG.maxScale],
          Extrapolation.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      pulseValue.value,
      [0, 1],
      [PULSE_CONFIG.maxOpacity, PULSE_CONFIG.minOpacity],
      Extrapolation.CLAMP
    ),
  }));

  return { animatedStyle, pulseValue };
};

/**
 * Hook for success animation (checkmark, bounce effect)
 * Used after successful actions like joining a game
 *
 * @param onComplete - Callback when animation completes
 * @returns Object with animated style and trigger function
 */
export const useSuccessAnimation = (onComplete?: () => void) => {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const trigger = useCallback(() => {
    if (reduceMotion) {
      // Instant show for reduced motion
      scale.value = 1;
      opacity.value = 1;
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
      return;
    }

    // Reset values
    scale.value = 0;
    opacity.value = 0;

    // Animate in with bounce
    opacity.value = withTiming(1, { duration: ANIMATION_DURATION.fast });
    scale.value = withSpring(1, SPRING_CONFIG.bouncy, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });
  }, [reduceMotion, scale, opacity, onComplete]);

  const reset = useCallback(() => {
    scale.value = withTiming(0, { duration: ANIMATION_DURATION.fast });
    opacity.value = withTiming(0, { duration: ANIMATION_DURATION.fast });
  }, [scale, opacity]);

  return { animatedStyle, trigger, reset };
};

/**
 * Hook for fade in animation
 * Used for smooth entry of elements
 *
 * @param delay - Delay before animation starts (in ms)
 * @returns Object with animated style
 */
export const useFadeIn = (delay: number = 0) => {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (reduceMotion) {
        opacity.value = 1;
        translateY.value = 0;
        return;
      }

      opacity.value = withTiming(1, {
        duration: ANIMATION_DURATION.normal,
        easing: EASING.decelerate,
      });
      translateY.value = withTiming(0, {
        duration: ANIMATION_DURATION.normal,
        easing: EASING.decelerate,
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, reduceMotion, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle };
};

/**
 * Hook for staggered list item animation
 * Creates a cascading fade-in effect for list items
 *
 * @param index - Index of the item in the list
 * @param baseDelay - Base delay for each item (multiplied by index)
 * @returns Object with animated style
 */
export const useStaggeredFadeIn = (index: number, baseDelay: number = 50) => {
  return useFadeIn(index * baseDelay);
};

/**
 * Hook for progress bar animation
 * Animates progress bar fill from 0 to target value
 *
 * @param targetProgress - Target progress value (0-1)
 * @param delay - Delay before animation starts
 * @returns Object with animated style and current progress value
 */
export const useProgressAnimation = (targetProgress: number, delay: number = 0) => {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (reduceMotion) {
        progress.value = targetProgress;
        return;
      }

      progress.value = withTiming(targetProgress, {
        duration: ANIMATION_DURATION.slow,
        easing: EASING.decelerate,
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [targetProgress, delay, reduceMotion, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return { animatedStyle, progress };
};

