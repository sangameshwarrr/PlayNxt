// ============================================
// PlayNxt - ActivityCard Component
// ============================================
// Card component for displaying booking/activity items

import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '@/theme';
import { Booking, Game } from '@/types';
import { formatDate, formatTime, formatPrice } from '@/constants';

interface ActivityCardProps {
  booking: Booking;
}

/**
 * Get status badge styling based on booking status
 */
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { bg: COLORS.successLight, text: COLORS.success };
    case 'completed':
      return { bg: COLORS.infoLight, text: COLORS.info };
    case 'cancelled':
      return { bg: COLORS.errorLight, text: COLORS.error };
    case 'pending':
      return { bg: COLORS.warningLight, text: COLORS.warning };
    default:
      return { bg: COLORS.surfaceSecondary, text: COLORS.textSecondary };
  }
};

/**
 * Activity card component for displaying booking information
 * Memoized to prevent unnecessary re-renders
 */
export const ActivityCard = memo(function ActivityCard({
  booking,
}: ActivityCardProps) {
  const isGame = booking.type === 'game';
  const item = isGame ? booking.game : booking.venue;

  // Navigate to detail screen
  const handlePress = useCallback(() => {
    if (isGame && booking.game) {
      router.push(`/game/${booking.game.id}`);
    } else if (booking.venue) {
      router.push(`/venue/${booking.venue.id}`);
    }
  }, [isGame, booking]);

  // Don't render if no item data
  if (!item) return null;

  const statusStyle = getStatusStyle(booking.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${isGame ? 'Game' : 'Venue'} booking: ${isGame ? (booking.game as Game).title : booking.venue?.name}`}
    >
      {/* Header with type and status badges */}
      <View style={styles.header}>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: isGame ? COLORS.primarySurface : COLORS.secondarySurface },
          ]}
        >
          <Text style={styles.typeIcon}>{isGame ? '🎮' : '🏟️'}</Text>
          <Text
            style={[
              styles.typeText,
              { color: isGame ? COLORS.primary : COLORS.secondary },
            ]}
          >
            {isGame ? 'Game' : 'Venue'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {booking.status}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {isGame ? (booking.game as Game).title : booking.venue?.name}
      </Text>

      {/* Game-specific details */}
      {isGame && booking.game && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {booking.game.venue.name}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>
              {formatDate(booking.game.date)} • {formatTime(booking.game.startTime)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👥</Text>
            <Text style={styles.detailText}>
              {booking.game.currentPlayers}/{booking.game.maxPlayers} players
            </Text>
          </View>
        </View>
      )}

      {/* Venue-specific details */}
      {!isGame && booking.venue && booking.slot && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {booking.venue.address}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>
              {formatDate(booking.slot.date)} • {formatTime(booking.slot.startTime)}
            </Text>
          </View>
        </View>
      )}

      {/* Footer with amount */}
      <View style={styles.footer}>
        <Text style={styles.amount}>{formatPrice(booking.totalAmount)}</Text>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
  },
  typeIcon: {
    fontSize: FONT_SIZE.sm,
  },
  typeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  details: {
    gap: SPACING.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailIcon: {
    fontSize: FONT_SIZE.sm,
    width: 20,
  },
  detailText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  amount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
  },
});

