// ============================================
// PlayNxt - Home Screen (Play Tab - Playo Style)
// ============================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameCard, Loading, Card } from '@/components';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, SPORTS, BORDER_RADIUS } from '@/constants';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { games, fetchGames, isLoading } = useGameStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // Mock location - in production, use expo-location
  const userLocation = user?.location?.area || 'Koramangala';
  const userCity = user?.location?.city || 'Bangalore';

  useEffect(() => {
    fetchGames();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const filteredGames = selectedSport
    ? games.filter(game => game.sport.id === selectedSport)
    : games;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Location */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <View>
              <Text style={styles.locationLabel}>Your Location</Text>
              <Text style={styles.locationText}>{userLocation}, {userCity}</Text>
            </View>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.createGameButton}
            onPress={() => router.push('/(tabs)/create-game')}
          >
            <Text style={styles.createGameIcon}>⚡</Text>
            <Text style={styles.createGameText}>Create a Game</Text>
            <Text style={styles.createGameSubtext}>Host your own match</Text>
          </TouchableOpacity>
        </View>

        {/* Sports Filter */}
        <View style={styles.sportsSection}>
          <Text style={styles.sectionTitle}>Choose Sport</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sportsScroll}
          >
            <TouchableOpacity
              style={[styles.sportChip, !selectedSport && styles.sportChipActive]}
              onPress={() => setSelectedSport(null)}
            >
              <Text style={styles.sportChipIcon}>🎯</Text>
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
        </View>

        {/* Games List */}
        <View style={styles.gamesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Games Near You</Text>
            <Text style={styles.gameCount}>{filteredGames.length} available</Text>
          </View>

          {isLoading ? (
            <Loading message="Finding games..." />
          ) : filteredGames.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🎮</Text>
              <Text style={styles.emptyText}>No games found</Text>
              <Text style={styles.emptySubtext}>Be the first to create one!</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/(tabs)/create-game')}
              >
                <Text style={styles.emptyButtonText}>Create Game</Text>
              </TouchableOpacity>
            </Card>
          ) : (
            filteredGames.map((game) => (
              <GameCard
                key={`game-${game.id}`}
                game={game}
                onPress={() => router.push(`/game/${game.id}`)}
              />
            ))
          )}
        </View>

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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  locationIcon: {
    fontSize: 20,
  },
  locationLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  locationText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },
  dropdownIcon: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notificationIcon: {
    fontSize: 18,
  },
  quickActions: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  createGameButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  createGameIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  createGameText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  createGameSubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 2,
  },
  sportsSection: {
    marginTop: SPACING.xl,
    paddingLeft: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  sportsScroll: {
    paddingRight: SPACING.lg,
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
    fontSize: 16,
  },
  sportChipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text,
  },
  sportChipTextActive: {
    color: COLORS.white,
  },
  gamesSection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  gameCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  emptyButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});
