// ============================================
// PlayNxt - Booking Store (Zustand)
// ============================================

import { create } from 'zustand';
import { Booking, Venue, Slot } from '@/types';
import { bookingsApi, venuesApi, walletApi } from '@/services/api';

interface BookingState {
  bookings: Booking[];
  venues: Venue[];
  selectedVenue: Venue | null;
  slots: Slot[];
  selectedSlot: Slot | null;
  walletBalance: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBookings: () => Promise<void>;
  fetchVenues: () => Promise<void>;
  fetchVenueById: (id: string) => Promise<void>;
  fetchSlots: (venueId: string, date: string) => Promise<void>;
  createBooking: (type: 'game' | 'venue', itemId: string, slotId?: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  selectSlot: (slot: Slot | null) => void;
  fetchWalletBalance: () => Promise<void>;
  addMoney: (amount: number) => Promise<boolean>;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  venues: [],
  selectedVenue: null,
  slots: [],
  selectedSlot: null,
  walletBalance: 0,
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await bookingsApi.getBookings();

      if (response.success && response.data) {
        set({ bookings: response.data, isLoading: false });
      } else {
        set({ error: response.error || 'Failed to fetch bookings', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
    }
  },

  fetchVenues: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await venuesApi.getVenues();

      if (response.success && response.data) {
        set({ venues: response.data, isLoading: false });
      } else {
        set({ error: response.error || 'Failed to fetch venues', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
    }
  },

  fetchVenueById: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await venuesApi.getVenueById(id);

      if (response.success && response.data) {
        set({ selectedVenue: response.data, isLoading: false });
      } else {
        set({ error: response.error || 'Venue not found', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
    }
  },

  fetchSlots: async (venueId: string, date: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await venuesApi.getVenueSlots(venueId, date);

      if (response.success && response.data) {
        set({ slots: response.data, isLoading: false });
      } else {
        set({ error: response.error || 'Failed to fetch slots', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
    }
  },

  createBooking: async (type, itemId, slotId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await bookingsApi.createBooking(type, itemId, slotId);

      if (response.success && response.data) {
        const bookings = get().bookings;
        set({
          bookings: [response.data, ...bookings],
          isLoading: false,
          selectedSlot: null,
        });
        return true;
      } else {
        set({ error: response.error || 'Booking failed', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
      return false;
    }
  },

  cancelBooking: async (bookingId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await bookingsApi.cancelBooking(bookingId);

      if (response.success) {
        const bookings = get().bookings.map(b =>
          b.id === bookingId
            ? { ...b, status: 'cancelled' as const, paymentStatus: 'refunded' as const }
            : b
        );
        set({ bookings, isLoading: false });
        return true;
      } else {
        set({ error: response.error || 'Cancellation failed', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
      return false;
    }
  },

  selectSlot: (slot: Slot | null) => {
    set({ selectedSlot: slot });
  },

  fetchWalletBalance: async () => {
    try {
      const response = await walletApi.getBalance();

      if (response.success && response.data) {
        set({ walletBalance: response.data.balance });
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance');
    }
  },

  addMoney: async (amount: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await walletApi.addMoney(amount);

      if (response.success && response.data) {
        set({ walletBalance: response.data.balance, isLoading: false });
        return true;
      } else {
        set({ error: response.error || 'Failed to add money', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

