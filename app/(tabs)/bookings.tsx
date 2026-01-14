// ============================================
// PlayNxt - Activity Screen (Bookings & Games)
// ============================================
// Production-ready activity screen with proper architecture
// Uses custom hooks for state management and memoized components

import React, { useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loading, EmptyState, ActivityTabs, ActivityCard } from '@/components';
import { useActivity } from '@/hooks';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/theme';

/**
 * Activity Screen
 * Displays user's bookings and game participations
 * Split into upcoming and past tabs
 */
export default function ActivityScreen() {
  // Use custom hook for all state management
  const {
    activeTab,
    setActiveTab,
    refreshing,
    onRefresh,
    currentList,
    isLoading,
    loadData,
    upcomingCount,
    pastCount,
  } = useActivity();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Navigate to home for finding games
  const handleFindGames = useCallback(() => {
    router.push('/(tabs)/home');
  }, []);

  // Memoized empty state props based on active tab
  const emptyStateProps = useMemo(() => ({
    icon: activeTab === 'upcoming' ? '📅' : '📋',
    title: activeTab === 'upcoming' ? 'No upcoming activities' : 'No past activities',
    message: activeTab === 'upcoming'
      ? 'Join a game or book a venue to get started'
      : 'Your completed activities will appear here',
    actionLabel: activeTab === 'upcoming' ? 'Find Games' : undefined,
    onAction: activeTab === 'upcoming' ? handleFindGames : undefined,
  }), [activeTab, handleFindGames]);

  // Render content based on state
  const renderContent = () => {
    if (isLoading) {
      return <Loading message="Loading activities..." />;
    }

    if (currentList.length === 0) {
      return <EmptyState {...emptyStateProps} />;
    }

    return currentList.map((booking, index) => (
      <ActivityCard
        key={`activity-${booking.id}-${index}`}
        booking={booking}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Activity</Text>
        <Text style={styles.headerSubtitle}>
          Your games and venue bookings
        </Text>
      </View>

      {/* Tabs with counts */}
      <ActivityTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        upcomingCount={upcomingCount}
        pastCount={pastCount}
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {renderContent()}
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
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
});
