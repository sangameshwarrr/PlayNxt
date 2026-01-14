// ============================================
// PlayNxt - Type Definitions
// ============================================

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  skillLevel: SkillLevel;
  preferredSports: Sport[];
  location: Location;
  createdAt: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';

export interface Location {
  city: string;
  area: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Sport Types
export type SportType =
  | 'football'
  | 'cricket'
  | 'badminton'
  | 'tennis'
  | 'basketball'
  | 'volleyball'
  | 'table-tennis'
  | 'squash';

export interface Sport {
  id: SportType;
  name: string;
  icon: string;
  color: string;
}

// Game Types
export interface Game {
  id: string;
  sport: Sport;
  title: string;
  description?: string;
  venue: Venue;
  date: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  currentPlayers: number;
  players: Player[];
  pricePerPlayer: number;
  skillLevel: SkillLevel;
  hostId: string;
  host: Player;
  status: GameStatus;
  createdAt: string;
}

export type GameStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  skillLevel: SkillLevel;
}

// Venue Types
export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  images: string[];
  sports: SportType[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  openTime: string;
  closeTime: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Slot {
  id: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
  court?: string;
}

// Booking Types
export interface Booking {
  id: string;
  type: 'game' | 'venue';
  game?: Game;
  venue?: Venue;
  slot?: Slot;
  userId: string;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

// Wallet Types
export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: 'booking' | 'refund' | 'topup';
  createdAt: string;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

// Auth Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter Types
export interface GameFilters {
  sport?: SportType;
  date?: string;
  skillLevel?: SkillLevel;
  priceRange?: {
    min: number;
    max: number;
  };
  area?: string;
}

export interface VenueFilters {
  sport?: SportType;
  area?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  amenities?: string[];
}

// Form Types
export interface CreateGameForm {
  sport: SportType;
  title: string;
  description?: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  pricePerPlayer: number;
  skillLevel: SkillLevel;
}

export interface LoginForm {
  phone: string;
  otp?: string;
}

export interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

