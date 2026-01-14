// ============================================
// PlayNxt - Venue Detail Screen
// ============================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Loading } from '@/components';
import { useBookingStore } from '@/store/bookingStore';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  BORDER_RADIUS,
  formatTime,
  formatPrice,
  getSportById,
} from '@/constants';
import { Slot } from '@/types';

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    selectedVenue,
    fetchVenueById,
    slots,
    fetchSlots,
    selectedSlot,
    selectSlot,
    createBooking,
    isLoading,
  } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState<string>('');

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      full: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  useEffect(() => {
    if (id) {
      fetchVenueById(id);
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, [id]);

  useEffect(() => {
    if (id && selectedDate) {
      fetchSlots(id, selectedDate);
    }
  }, [id, selectedDate]);

  if (isLoading || !selectedVenue) {
    return <Loading fullScreen message="Loading venue details..." />;
  }

  const venue = selectedVenue;

  const handleSlotSelect = (slot: Slot) => {
    if (!slot.isAvailable) return;
    selectSlot(selectedSlot?.id === slot.id ? null : slot);
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    Alert.alert(
      'Confirm Booking',
      `Book ${venue.name} for ${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)} at ${formatPrice(selectedSlot.price)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay',
          onPress: async () => {
            const success = await createBooking('venue', venue.id, selectedSlot.id);
            if (success) {
              Alert.alert(
                'Booking Confirmed! 🎉',
                'Your slot has been booked successfully.',
                [
                  {
                    text: 'View Bookings',
                    onPress: () => router.push('/(tabs)/bookings'),
                  },
                ]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: venue.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.ratingText}>{venue.rating}</Text>
            <Text style={styles.reviewCount}>({venue.reviewCount} reviews)</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{venue.name}</Text>

          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>
              {venue.address}, {venue.area}, {venue.city}
            </Text>
          </View>

          {/* Sports Available */}
          <View style={styles.sportsRow}>
            {venue.sports.map((sportId) => {
              const sport = getSportById(sportId);
              return sport ? (
                <View key={sportId} style={[styles.sportBadge, { borderColor: sport.color }]}>
                  <Text>{sport.icon}</Text>
                  <Text style={[styles.sportBadgeText, { color: sport.color }]}>
                    {sport.name}
                  </Text>
                </View>
              ) : null;
            })}
          </View>

          {/* Timing */}
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🕐</Text>
              <View>
                <Text style={styles.infoLabel}>Operating Hours</Text>
                <Text style={styles.infoValue}>
                  {formatTime(venue.openTime)} - {formatTime(venue.closeTime)}
                </Text>
              </View>
            </View>
          </Card>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {venue.amenities.map((amenity) => (
                <View key={amenity} style={styles.amenityTag}>
                  <Text style={styles.amenityIcon}>
                    {amenity === 'Parking' ? '🅿️' :
                     amenity === 'Changing Room' ? '🚿' :
                     amenity === 'Drinking Water' ? '💧' :
                     amenity === 'Cafeteria' ? '☕' :
                     amenity === 'AC' ? '❄️' :
                     amenity === 'WiFi' ? '📶' :
                     amenity === 'First Aid' ? '🏥' :
                     amenity === 'Floodlights' ? '💡' : '✓'}
                  </Text>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dateScroll}
            >
              {dates.map((date) => (
                <TouchableOpacity
                  key={date.full}
                  style={[
                    styles.dateCard,
                    selectedDate === date.full && styles.dateCardSelected,
                  ]}
                  onPress={() => {
                    setSelectedDate(date.full);
                    selectSlot(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      selectedDate === date.full && styles.dateDaySelected,
                    ]}
                  >
                    {date.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateNum,
                      selectedDate === date.full && styles.dateNumSelected,
                    ]}
                  >
                    {date.date}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonth,
                      selectedDate === date.full && styles.dateMonthSelected,
                    ]}
                  >
                    {date.month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Slot Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Slots</Text>
            {isLoading ? (
              <Loading message="Loading slots..." />
            ) : (
              <View style={styles.slotsGrid}>
                {slots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotCard,
                      !slot.isAvailable && styles.slotUnavailable,
                      selectedSlot?.id === slot.id && styles.slotSelected,
                    ]}
                    onPress={() => handleSlotSelect(slot)}
                    disabled={!slot.isAvailable}
                  >
                    <Text
                      style={[
                        styles.slotTime,
                        !slot.isAvailable && styles.slotTimeUnavailable,
                        selectedSlot?.id === slot.id && styles.slotTimeSelected,
                      ]}
                    >
                      {formatTime(slot.startTime)}
                    </Text>
                    <Text
                      style={[
                        styles.slotPrice,
                        !slot.isAvailable && styles.slotPriceUnavailable,
                        selectedSlot?.id === slot.id && styles.slotPriceSelected,
                      ]}
                    >
                      {slot.isAvailable ? formatPrice(slot.price) : 'Booked'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <View style={styles.priceInfo}>
          {selectedSlot ? (
            <>
              <Text style={styles.priceLabel}>
                {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
              </Text>
              <Text style={styles.priceValue}>{formatPrice(selectedSlot.price)}</Text>
            </>
          ) : (
            <>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.priceValue}>{formatPrice(venue.pricePerHour)}/hr</Text>
            </>
          )}
        </View>

        <Button
          title={selectedSlot ? 'Book Now' : 'Select a Slot'}
          onPress={handleBooking}
          disabled={!selectedSlot}
          loading={isLoading}
          style={styles.actionButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  imageContainer: {
    position: 'relative',
    height: 220,
  },

  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceSecondary,
  },

  ratingBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  ratingStar: {
    fontSize: FONT_SIZE.md,
  },

  ratingText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },

  reviewCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  content: {
    padding: SPACING.lg,
  },

  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },

  locationIcon: {
    fontSize: FONT_SIZE.md,
  },

  location: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 22,
  },

  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    gap: SPACING.xs,
  },

  sportBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },

  infoCard: {
    marginBottom: SPACING.md,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  infoIcon: {
    fontSize: 24,
  },

  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },

  section: {
    marginTop: SPACING.xl,
  },

  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },

  amenityIcon: {
    fontSize: FONT_SIZE.md,
  },

  amenityText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },

  dateScroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },

  dateCard: {
    width: 70,
    paddingVertical: SPACING.md,
    marginRight: SPACING.sm,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  dateCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  dateDay: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },

  dateDaySelected: {
    color: COLORS.white,
  },

  dateNum: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginVertical: SPACING.xs,
  },

  dateNumSelected: {
    color: COLORS.white,
  },

  dateMonth: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  dateMonthSelected: {
    color: COLORS.white,
  },

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  slotCard: {
    width: '31%',
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  slotUnavailable: {
    backgroundColor: COLORS.surfaceSecondary,
    opacity: 0.6,
  },

  slotSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  slotTime: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },

  slotTimeUnavailable: {
    color: COLORS.textTertiary,
  },

  slotTimeSelected: {
    color: COLORS.white,
  },

  slotPrice: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  slotPriceUnavailable: {
    color: COLORS.textTertiary,
  },

  slotPriceSelected: {
    color: COLORS.white,
  },

  bottomPadding: {
    height: SPACING.xxl,
  },

  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.lg,
  },

  priceInfo: {
    alignItems: 'flex-start',
  },

  priceLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  priceValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },

  actionButton: {
    flex: 1,
  },
});

