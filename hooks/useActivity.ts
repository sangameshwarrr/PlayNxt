// ============================================
// PlayNxt - useActivity Hook
// ============================================
// Custom hook for activity screen state management
// Separates business logic from UI components

import { useState, useCallback, useMemo } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { useGameStore } from '@/store/gameStore';
import { Booking } from '@/types';

/**
 * Tab types for activity filtering
 */
export type ActivityTab = 'upcoming' | 'past';

/**
 * Return type for useActivity hook
 */
interface UseActivityReturn {
  // State
  activeTab: ActivityTab;
  refreshing: boolean;
  isLoading: boolean;
  currentList: Booking[];
  upcomingCount: number;
  pastCount: number;

  // Actions
  setActiveTab: (tab: ActivityTab) => void;
  onRefresh: () => Promise<void>;
  loadData: () => Promise<void>;
}

/**
 * Custom hook for managing activity/bookings screen state
 * Handles data fetching, filtering, and refresh logic
 */
export function useActivity(): UseActivityReturn {
  // Local state
  const [activeTab, setActiveTab] = useState<ActivityTab>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  // Store state
  const { bookings, fetchBookings, isLoading: bookingsLoading } = useBookingStore();
  const { fetchMyGames, isLoading: gamesLoading } = useGameStore();

  // Get today's date for filtering (memoized to prevent recalculation)
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  /**
   * Load all activity data
   */
  const loadData = useCallback(async () => {
    await Promise.all([fetchBookings(), fetchMyGames()]);
  }, [fetchBookings, fetchMyGames]);

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  /**
   * Filter bookings into upcoming and past
   * Memoized to prevent unnecessary recalculations
   */
  const { upcomingBookings, pastBookings } = useMemo(() => {
    const upcoming: Booking[] = [];
    const past: Booking[] = [];

    bookings.forEach((booking) => {
      // Determine if booking is upcoming based on type and date
      const isUpcoming =
        booking.type === 'game' && booking.game
          ? booking.game.date >= today
          : booking.status === 'confirmed';

      if (isUpcoming) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });

    // Sort by date (most recent first for upcoming, most recent activity for past)
    upcoming.sort((a, b) => {
      const dateA = a.game?.date || a.createdAt;
      const dateB = b.game?.date || b.createdAt;
      return dateA.localeCompare(dateB);
    });

    past.sort((a, b) => {
      const dateA = a.game?.date || a.createdAt;
      const dateB = b.game?.date || b.createdAt;
      return dateB.localeCompare(dateA); // Reversed for past
    });

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [bookings, today]);

  // Computed values
  const currentList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;
  const isLoading = bookingsLoading || gamesLoading;

  return {
    activeTab,
    refreshing,
    isLoading,
    currentList,
    upcomingCount: upcomingBookings.length,
    pastCount: pastBookings.length,
    setActiveTab,
    onRefresh,
    loadData,
  };
}

