// ============================================
// PlayNxt - Mock Data
// ============================================

import { Game, Venue, User, Booking, Player, Slot } from '@/types';
import { SPORTS } from '@/constants';

// Mock Players
export const mockPlayers: Player[] = [
  { id: '1', name: 'Rahul Kumar', avatar: undefined, skillLevel: 'intermediate' },
  { id: '2', name: 'Priya Singh', avatar: undefined, skillLevel: 'advanced' },
  { id: '3', name: 'Amit Sharma', avatar: undefined, skillLevel: 'beginner' },
  { id: '4', name: 'Sneha Patel', avatar: undefined, skillLevel: 'intermediate' },
  { id: '5', name: 'Vikram Reddy', avatar: undefined, skillLevel: 'pro' },
  { id: '6', name: 'Ananya Gupta', avatar: undefined, skillLevel: 'advanced' },
];

// Mock User
export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 9876543210',
  skillLevel: 'intermediate',
  preferredSports: [SPORTS[0], SPORTS[2]],
  location: {
    city: 'Bangalore',
    area: 'Koramangala',
  },
  createdAt: '2024-01-15T10:00:00Z',
};

// Mock Venues
export const mockVenues: Venue[] = [
  {
    id: 'venue-1',
    name: 'PlayZone Sports Arena',
    address: '123, 5th Cross, Koramangala',
    city: 'Bangalore',
    area: 'Koramangala',
    images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'],
    sports: ['football', 'cricket', 'badminton'],
    amenities: ['Parking', 'Changing Room', 'Drinking Water', 'Cafeteria'],
    rating: 4.5,
    reviewCount: 128,
    pricePerHour: 1200,
    openTime: '06:00',
    closeTime: '22:00',
  },
  {
    id: 'venue-2',
    name: 'Sports Hub HSR',
    address: '45, Sector 3, HSR Layout',
    city: 'Bangalore',
    area: 'HSR Layout',
    images: ['https://images.unsplash.com/photo-1568287556346-ca67883a7ab0?w=800'],
    sports: ['badminton', 'tennis', 'table-tennis'],
    amenities: ['Parking', 'Shower', 'AC', 'Equipment Rental'],
    rating: 4.7,
    reviewCount: 256,
    pricePerHour: 800,
    openTime: '05:00',
    closeTime: '23:00',
  },
  {
    id: 'venue-3',
    name: 'Champions Ground',
    address: '78, MG Road, Indiranagar',
    city: 'Bangalore',
    area: 'Indiranagar',
    images: ['https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800'],
    sports: ['football', 'basketball', 'volleyball'],
    amenities: ['Floodlights', 'Parking', 'First Aid', 'Changing Room'],
    rating: 4.3,
    reviewCount: 89,
    pricePerHour: 1500,
    openTime: '06:00',
    closeTime: '21:00',
  },
  {
    id: 'venue-4',
    name: 'Elite Sports Complex',
    address: '234, JP Nagar, 6th Phase',
    city: 'Bangalore',
    area: 'JP Nagar',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    sports: ['cricket', 'football', 'tennis'],
    amenities: ['Parking', 'Cafeteria', 'WiFi', 'AC', 'Shower'],
    rating: 4.8,
    reviewCount: 312,
    pricePerHour: 2000,
    openTime: '06:00',
    closeTime: '22:00',
  },
];

// Generate dates for the next 7 days
const generateDates = (): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Mock Games
export const mockGames: Game[] = [
  {
    id: 'game-1',
    sport: SPORTS[0], // Football
    title: 'Weekend Football Match',
    description: 'Friendly 5v5 football match. All skill levels welcome!',
    venue: mockVenues[0],
    date: generateDates()[1],
    startTime: '18:00',
    endTime: '20:00',
    maxPlayers: 10,
    currentPlayers: 7,
    players: mockPlayers.slice(0, 7),
    pricePerPlayer: 150,
    skillLevel: 'intermediate',
    hostId: '1',
    host: mockPlayers[0],
    status: 'upcoming',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'game-2',
    sport: SPORTS[2], // Badminton
    title: 'Badminton Doubles',
    description: 'Looking for players for doubles match',
    venue: mockVenues[1],
    date: generateDates()[0],
    startTime: '07:00',
    endTime: '08:00',
    maxPlayers: 4,
    currentPlayers: 2,
    players: mockPlayers.slice(0, 2),
    pricePerPlayer: 200,
    skillLevel: 'advanced',
    hostId: '2',
    host: mockPlayers[1],
    status: 'upcoming',
    createdAt: '2024-01-20T11:00:00Z',
  },
  {
    id: 'game-3',
    sport: SPORTS[1], // Cricket
    title: 'Sunday Cricket League',
    description: 'Weekly cricket match. 8 overs per side.',
    venue: mockVenues[3],
    date: generateDates()[2],
    startTime: '06:00',
    endTime: '09:00',
    maxPlayers: 16,
    currentPlayers: 12,
    players: mockPlayers,
    pricePerPlayer: 250,
    skillLevel: 'intermediate',
    hostId: '3',
    host: mockPlayers[2],
    status: 'upcoming',
    createdAt: '2024-01-20T12:00:00Z',
  },
  {
    id: 'game-4',
    sport: SPORTS[4], // Basketball
    title: 'Basketball 3v3',
    description: 'Casual basketball game',
    venue: mockVenues[2],
    date: generateDates()[3],
    startTime: '19:00',
    endTime: '21:00',
    maxPlayers: 6,
    currentPlayers: 4,
    players: mockPlayers.slice(0, 4),
    pricePerPlayer: 180,
    skillLevel: 'beginner',
    hostId: '4',
    host: mockPlayers[3],
    status: 'upcoming',
    createdAt: '2024-01-20T13:00:00Z',
  },
  {
    id: 'game-5',
    sport: SPORTS[3], // Tennis
    title: 'Tennis Singles',
    description: 'Looking for a tennis partner',
    venue: mockVenues[1],
    date: generateDates()[4],
    startTime: '17:00',
    endTime: '18:00',
    maxPlayers: 2,
    currentPlayers: 1,
    players: mockPlayers.slice(0, 1),
    pricePerPlayer: 300,
    skillLevel: 'advanced',
    hostId: '5',
    host: mockPlayers[4],
    status: 'upcoming',
    createdAt: '2024-01-20T14:00:00Z',
  },
];

// Generate mock slots for a venue
export const generateMockSlots = (venueId: string, date: string): Slot[] => {
  const slots: Slot[] = [];
  const startHour = 6;
  const endHour = 22;

  for (let hour = startHour; hour < endHour; hour++) {
    const isAvailable = Math.random() > 0.3; // 70% available
    slots.push({
      id: `slot-${venueId}-${date}-${hour}`,
      venueId,
      date,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      price: 800 + Math.floor(Math.random() * 400),
      isAvailable,
      court: `Court ${Math.floor(Math.random() * 3) + 1}`,
    });
  }

  return slots;
};

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    type: 'game',
    game: mockGames[0],
    userId: 'user-1',
    status: 'confirmed',
    totalAmount: 150,
    paymentStatus: 'paid',
    createdAt: '2024-01-21T10:00:00Z',
  },
  {
    id: 'booking-2',
    type: 'game',
    game: mockGames[2],
    userId: 'user-1',
    status: 'confirmed',
    totalAmount: 250,
    paymentStatus: 'paid',
    createdAt: '2024-01-22T11:00:00Z',
  },
];

// Mock Wallet Transactions
export const mockWalletTransactions = [
  {
    id: 'txn-1',
    type: 'credit' as const,
    amount: 1000,
    description: 'Added money to wallet',
    referenceType: 'topup' as const,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'txn-2',
    type: 'debit' as const,
    amount: 150,
    description: 'Booking - Weekend Football Match',
    referenceId: 'booking-1',
    referenceType: 'booking' as const,
    createdAt: '2024-01-21T10:00:00Z',
  },
  {
    id: 'txn-3',
    type: 'debit' as const,
    amount: 250,
    description: 'Booking - Sunday Cricket League',
    referenceId: 'booking-2',
    referenceType: 'booking' as const,
    createdAt: '2024-01-22T11:00:00Z',
  },
];

