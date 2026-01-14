// ============================================
// PlayNxt - Book Screen (Venues - Playo Style)
// ============================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VenueCard, Loading, EmptyState } from '@/components';
import { useBookingStore } from '@/store/bookingStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, SPORTS, BORDER_RADIUS } from '@/constants';
import { SportType } from '@/types';

export default function BookScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { venues, fetchVenues, isLoading } = useBookingStore();

  useEffect(() => {
    fetchVenues();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVenues();
    setRefreshing(false);
  };

  const filteredVenues = venues.filter(venue => {
    if (selectedSport && !venue.sports.includes(selectedSport)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return venue.name.toLowerCase().includes(query) || venue.area.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Venue</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search venues..."
            placeholderTextColor={COLORS.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sports Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sportsFilter}
        contentContainerStyle={styles.sportsFilterContent}
      >
        <TouchableOpacity
          style={[styles.sportChip, !selectedSport && styles.sportChipActive]}
          onPress={() => setSelectedSport(null)}
        >
          <Text style={[styles.sportChipText, !selectedSport && styles.sportChipTextActive]}>All</Text>
        </TouchableOpacity>
        {SPORTS.slice(0, 6).map((sport) => (
          <TouchableOpacity
            key={sport.id}
            style={[styles.sportChip, selectedSport === sport.id && styles.sportChipActive]}
            onPress={() => setSelectedSport(sport.id)}
          >
            <Text style={styles.sportChipIcon}>{sport.icon}</Text>
            <Text style={[styles.sportChipText, selectedSport === sport.id && styles.sportChipTextActive]}>
              {sport.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Venues List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>{filteredVenues.length} venues found</Text>
        </View>

        {isLoading ? (
          <Loading message="Loading venues..." />
        ) : filteredVenues.length === 0 ? (
          <EmptyState
            icon="🏟️"
            title="No venues found"
            message="Try a different search or filter"
          />
        ) : (
          filteredVenues.map((venue) => (
            <VenueCard
              key={`venue-${venue.id}`}
              venue={venue}
              onPress={() => router.push(`/venue/${venue.id}`)}
            />
          ))
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.textTertiary,
    padding: SPACING.xs,
  },
  sportsFilter: {
    maxHeight: 50,
    marginBottom: SPACING.md,
  },
  sportsFilterContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  sportChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sportChipIcon: {
    fontSize: 14,
  },
  sportChipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text,
  },
  sportChipTextActive: {
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  resultsHeader: {
    marginBottom: SPACING.md,
  },
  resultsCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});
