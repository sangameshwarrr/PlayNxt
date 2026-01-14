// ============================================
// PlayNxt - Venue Card Component
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card } from './Card';
import { Venue } from '@/types';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  FONT_WEIGHT,
  formatPrice,
  getSportById,
} from '@/constants';

interface VenueCardProps {
  venue: Venue;
  onPress: () => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onPress }) => {
  return (
    <Card onPress={onPress} style={styles.card} padding="none">
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: venue.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingStar}>⭐</Text>
          <Text style={styles.ratingText}>{venue.rating}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{venue.name}</Text>

        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.location} numberOfLines={1}>
            {venue.area}, {venue.city}
          </Text>
        </View>

        {/* Sports */}
        <View style={styles.sportsRow}>
          {venue.sports.slice(0, 4).map((sportId) => {
            const sport = getSportById(sportId);
            return sport ? (
              <Text key={sportId} style={styles.sportIcon}>
                {sport.icon}
              </Text>
            ) : null;
          })}
          {venue.sports.length > 4 && (
            <Text style={styles.moreSports}>+{venue.sports.length - 4}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.amenities}>
            {venue.amenities.slice(0, 2).map((amenity) => (
              <View key={amenity} style={styles.amenityBadge}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>from</Text>
            <Text style={styles.price}>{formatPrice(venue.pricePerHour)}/hr</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },

  imageContainer: {
    position: 'relative',
    height: 140,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceSecondary,
  },

  ratingBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },

  ratingStar: {
    fontSize: FONT_SIZE.xs,
  },

  ratingText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },

  content: {
    padding: SPACING.md,
  },

  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },

  locationIcon: {
    fontSize: FONT_SIZE.sm,
  },

  location: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },

  sportsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  sportIcon: {
    fontSize: FONT_SIZE.xl,
  },

  moreSports: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  amenities: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flex: 1,
  },

  amenityBadge: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },

  amenityText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  priceContainer: {
    alignItems: 'flex-end',
  },

  priceLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },

  price: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
});

