// ============================================
// PlayNxt - Skeleton Component
// ============================================
// Skeleton loading placeholder with shimmer effect
// Provides visual feedback during data loading

import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { COLORS, BORDER_RADIUS, SPACING } from '@/theme';
import { useShimmer } from '@/utils/animations';

interface SkeletonProps {
  /** Width of skeleton (number for pixels, string for percentage) */
  width?: number | string;
  /** Height of skeleton */
  height?: number;
  /** Border radius */
  borderRadius?: number;
  /** Make it circular (overrides borderRadius) */
  circle?: boolean;
  /** Additional style */
  style?: ViewStyle;
}

/**
 * Base skeleton component with shimmer animation
 * Use this for custom skeleton layouts
 */
export const Skeleton = memo(function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = BORDER_RADIUS.md,
  circle = false,
  style,
}: SkeletonProps) {
  const { animatedStyle } = useShimmer();

  const skeletonStyle: ViewStyle = {
    width,
    height,
    borderRadius: circle ? height / 2 : borderRadius,
  };

  return (
    <Animated.View
      style={[styles.skeleton, skeletonStyle, animatedStyle, style]}
    />
  );
});

/**
 * Skeleton for text lines
 */
export const SkeletonText = memo(function SkeletonText({
  lines = 1,
  lastLineWidth = '60%',
  lineHeight = 14,
  spacing = SPACING.sm,
}: {
  lines?: number;
  lastLineWidth?: string | number;
  lineHeight?: number;
  spacing?: number;
}) {
  return (
    <View style={{ gap: spacing }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
          height={lineHeight}
        />
      ))}
    </View>
  );
});

/**
 * Skeleton for avatar/profile images
 */
export const SkeletonAvatar = memo(function SkeletonAvatar({
  size = 40,
}: {
  size?: number;
}) {
  return <Skeleton width={size} height={size} circle />;
});

/**
 * Pre-built skeleton for card layouts
 */
export const SkeletonCard = memo(function SkeletonCard() {
  return (
    <View style={styles.card}>
      {/* Header with badge */}
      <View style={styles.cardHeader}>
        <Skeleton width={80} height={24} borderRadius={BORDER_RADIUS.full} />
        <Skeleton width={60} height={20} borderRadius={BORDER_RADIUS.full} />
      </View>

      {/* Title */}
      <Skeleton width="85%" height={20} style={{ marginTop: SPACING.md }} />

      {/* Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Skeleton width={16} height={16} circle />
          <Skeleton width="70%" height={14} />
        </View>
        <View style={styles.detailRow}>
          <Skeleton width={16} height={16} circle />
          <Skeleton width="50%" height={14} />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Skeleton width={80} height={24} />
        <Skeleton width={100} height={36} borderRadius={BORDER_RADIUS.lg} />
      </View>
    </View>
  );
});

/**
 * Pre-built skeleton for game card
 */
export const SkeletonGameCard = memo(function SkeletonGameCard() {
  return (
    <View style={styles.gameCard}>
      {/* Sport badge and skill level */}
      <View style={styles.cardHeader}>
        <Skeleton width={100} height={28} borderRadius={BORDER_RADIUS.full} />
        <Skeleton width={70} height={24} borderRadius={BORDER_RADIUS.full} />
      </View>

      {/* Title */}
      <Skeleton width="90%" height={22} style={{ marginTop: SPACING.md }} />

      {/* Location */}
      <View style={[styles.detailRow, { marginTop: SPACING.md }]}>
        <Skeleton width={16} height={16} circle />
        <Skeleton width="65%" height={14} />
      </View>

      {/* Date/Time */}
      <View style={[styles.detailRow, { marginTop: SPACING.sm }]}>
        <Skeleton width={16} height={16} circle />
        <Skeleton width="80%" height={14} />
      </View>

      {/* Footer with players and price */}
      <View style={styles.gameCardFooter}>
        <View style={styles.playersSection}>
          <View style={styles.avatarStack}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.stackedAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                <SkeletonAvatar size={28} />
              </View>
            ))}
          </View>
          <Skeleton width={60} height={12} />
        </View>
        <View style={styles.priceSection}>
          <Skeleton width={70} height={20} />
          <Skeleton width={50} height={12} style={{ marginTop: 4 }} />
        </View>
      </View>
    </View>
  );
});

/**
 * Pre-built skeleton for list items
 */
export const SkeletonListItem = memo(function SkeletonListItem() {
  return (
    <View style={styles.listItem}>
      <SkeletonAvatar size={48} />
      <View style={styles.listItemContent}>
        <Skeleton width="70%" height={16} />
        <Skeleton width="50%" height={12} style={{ marginTop: SPACING.xs }} />
      </View>
      <Skeleton width={60} height={14} />
    </View>
  );
});

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.border,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDetails: {
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  gameCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  gameCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  playersSection: {
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  stackedAvatar: {
    borderWidth: 2,
    borderColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  listItemContent: {
    flex: 1,
  },
});

