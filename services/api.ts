// ============================================
// PlayNxt - API Service Layer
// ============================================

import {
  ApiResponse,
  Game,
  Venue,
  User,
  Booking,
  Slot,
  CreateGameForm,
  GameFilters,
  LoginForm,
  SignupForm,
} from '@/types';
import {
  mockGames,
  mockVenues,
  mockUser,
  mockBookings,
  generateMockSlots,
  mockWalletTransactions,
} from './mockData';
import { SPORTS } from '@/constants';

// Simulate network delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Error simulation (uncomment to test error handling)
// const shouldFail = () => Math.random() < 0.1;

// ============================================
// Auth API
// ============================================

export const authApi = {
  login: async (form: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(1000);

    // Simulate OTP verification
    if (form.otp && form.otp.length === 6) {
      return {
        success: true,
        data: {
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now(),
        },
        message: 'Login successful',
      };
    }

    // Send OTP
    return {
      success: true,
      message: 'OTP sent successfully',
    };
  },

  signup: async (form: SignupForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(1000);

    const newUser: User = {
      ...mockUser,
      id: 'user-' + Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
    };

    return {
      success: true,
      data: {
        user: newUser,
        token: 'mock-jwt-token-' + Date.now(),
      },
      message: 'Account created successfully',
    };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    await delay(500);
    return { success: true, message: 'Logged out successfully' };
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    await delay(600);
    return { success: true, data: mockUser };
  },

  updateProfile: async (updates: Partial<User>): Promise<ApiResponse<User>> => {
    await delay(800);
    return {
      success: true,
      data: { ...mockUser, ...updates },
      message: 'Profile updated successfully',
    };
  },
};

// ============================================
// Games API
// ============================================

export const gamesApi = {
  getGames: async (filters?: GameFilters): Promise<ApiResponse<Game[]>> => {
    await delay(800);

    let games = [...mockGames];

    if (filters) {
      if (filters.sport) {
        games = games.filter(g => g.sport.id === filters.sport);
      }
      if (filters.skillLevel) {
        games = games.filter(g => g.skillLevel === filters.skillLevel);
      }
      if (filters.date) {
        games = games.filter(g => g.date === filters.date);
      }
    }

    return { success: true, data: games };
  },

  getGameById: async (id: string): Promise<ApiResponse<Game>> => {
    await delay(600);

    const game = mockGames.find(g => g.id === id);

    if (!game) {
      return { success: false, error: 'Game not found' };
    }

    return { success: true, data: game };
  },

  createGame: async (form: CreateGameForm): Promise<ApiResponse<Game>> => {
    await delay(1000);

    const venue = mockVenues.find(v => v.id === form.venueId);
    const sport = SPORTS.find(s => s.id === form.sport);

    if (!venue || !sport) {
      return { success: false, error: 'Invalid venue or sport' };
    }

    const newGame: Game = {
      id: 'game-' + Date.now(),
      sport,
      title: form.title,
      description: form.description,
      venue,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      maxPlayers: form.maxPlayers,
      currentPlayers: 1,
      players: [{ id: mockUser.id, name: mockUser.name, skillLevel: mockUser.skillLevel }],
      pricePerPlayer: form.pricePerPlayer,
      skillLevel: form.skillLevel,
      hostId: mockUser.id,
      host: { id: mockUser.id, name: mockUser.name, skillLevel: mockUser.skillLevel },
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };

    mockGames.push(newGame);

    return {
      success: true,
      data: newGame,
      message: 'Game created successfully',
    };
  },

  joinGame: async (gameId: string): Promise<ApiResponse<Game>> => {
    await delay(800);

    const gameIndex = mockGames.findIndex(g => g.id === gameId);

    if (gameIndex === -1) {
      return { success: false, error: 'Game not found' };
    }

    const game = mockGames[gameIndex];

    if (game.currentPlayers >= game.maxPlayers) {
      return { success: false, error: 'Game is full' };
    }

    game.currentPlayers += 1;
    game.players.push({
      id: mockUser.id,
      name: mockUser.name,
      skillLevel: mockUser.skillLevel
    });

    return {
      success: true,
      data: game,
      message: 'Successfully joined the game',
    };
  },

  leaveGame: async (gameId: string): Promise<ApiResponse<null>> => {
    await delay(600);

    const game = mockGames.find(g => g.id === gameId);

    if (!game) {
      return { success: false, error: 'Game not found' };
    }

    game.currentPlayers -= 1;
    game.players = game.players.filter(p => p.id !== mockUser.id);

    return {
      success: true,
      message: 'Successfully left the game',
    };
  },

  getMyGames: async (): Promise<ApiResponse<Game[]>> => {
    await delay(600);

    // Return games where user is a player or host
    const myGames = mockGames.filter(
      g => g.hostId === mockUser.id || g.players.some(p => p.id === mockUser.id)
    );

    return { success: true, data: myGames };
  },
};

// ============================================
// Venues API
// ============================================

export const venuesApi = {
  getVenues: async (): Promise<ApiResponse<Venue[]>> => {
    await delay(800);
    return { success: true, data: mockVenues };
  },

  getVenueById: async (id: string): Promise<ApiResponse<Venue>> => {
    await delay(600);

    const venue = mockVenues.find(v => v.id === id);

    if (!venue) {
      return { success: false, error: 'Venue not found' };
    }

    return { success: true, data: venue };
  },

  getVenueSlots: async (venueId: string, date: string): Promise<ApiResponse<Slot[]>> => {
    await delay(600);

    const slots = generateMockSlots(venueId, date);
    return { success: true, data: slots };
  },
};

// ============================================
// Bookings API
// ============================================

export const bookingsApi = {
  getBookings: async (): Promise<ApiResponse<Booking[]>> => {
    await delay(800);
    return { success: true, data: mockBookings };
  },

  createBooking: async (
    type: 'game' | 'venue',
    itemId: string,
    slotId?: string
  ): Promise<ApiResponse<Booking>> => {
    await delay(1000);

    let booking: Booking;

    if (type === 'game') {
      const game = mockGames.find(g => g.id === itemId);
      if (!game) {
        return { success: false, error: 'Game not found' };
      }

      booking = {
        id: 'booking-' + Date.now(),
        type: 'game',
        game,
        userId: mockUser.id,
        status: 'confirmed',
        totalAmount: game.pricePerPlayer,
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };
    } else {
      const venue = mockVenues.find(v => v.id === itemId);
      if (!venue) {
        return { success: false, error: 'Venue not found' };
      }

      booking = {
        id: 'booking-' + Date.now(),
        type: 'venue',
        venue,
        userId: mockUser.id,
        status: 'confirmed',
        totalAmount: venue.pricePerHour,
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };
    }

    mockBookings.push(booking);

    return {
      success: true,
      data: booking,
      message: 'Booking confirmed',
    };
  },

  cancelBooking: async (bookingId: string): Promise<ApiResponse<null>> => {
    await delay(800);

    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) {
      return { success: false, error: 'Booking not found' };
    }

    mockBookings[bookingIndex].status = 'cancelled';
    mockBookings[bookingIndex].paymentStatus = 'refunded';

    return {
      success: true,
      message: 'Booking cancelled and refund initiated',
    };
  },
};

// ============================================
// Wallet API
// ============================================

export const walletApi = {
  getBalance: async (): Promise<ApiResponse<{ balance: number }>> => {
    await delay(500);

    const balance = mockWalletTransactions.reduce((acc, txn) => {
      return txn.type === 'credit' ? acc + txn.amount : acc - txn.amount;
    }, 0);

    return { success: true, data: { balance } };
  },

  getTransactions: async (): Promise<ApiResponse<typeof mockWalletTransactions>> => {
    await delay(600);
    return { success: true, data: mockWalletTransactions };
  },

  addMoney: async (amount: number): Promise<ApiResponse<{ balance: number }>> => {
    await delay(1000);

    mockWalletTransactions.unshift({
      id: 'txn-' + Date.now(),
      type: 'credit',
      amount,
      description: 'Added money to wallet',
      referenceType: 'topup',
      createdAt: new Date().toISOString(),
    });

    const balance = mockWalletTransactions.reduce((acc, txn) => {
      return txn.type === 'credit' ? acc + txn.amount : acc - txn.amount;
    }, 0);

    return {
      success: true,
      data: { balance },
      message: `₹${amount} added to wallet`,
    };
  },
};

