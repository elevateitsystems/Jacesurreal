export type Track = {
  id: string;
  title: string;
  audioUrl: string;
  coverArt: string;
  duration?: number; // in seconds
  plays: number;
  likes: number;
  dislikes: number;
  date: string; // The release/schedule date
  createdAt: string;
  isLiked?: boolean;
  isDisliked?: boolean;
};

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  zip: string;
  occupation: string;
  instagram: string;
  avatar?: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
};

export type DailyData = {
  day: number;
  plays: number;
};

export type MonthlyAnalytics = {
  month: string;
  year: number;
  data: DailyData[];
};

export const mockTracks: Track[] = [
  {
    id: 'track_1',
    title: 'Midnight in Montauk',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverArt: 'https://placehold.co/400x400/000000/FFFFFF?text=Montauk',
    duration: 372,
    plays: 1205,
    likes: 342,
    dislikes: 12,
    date: '2023-10-01T12:00:00Z',
    createdAt: '2023-10-01T12:00:00Z',
  },
  {
    id: 'track_2',
    title: 'Broome St. Echoes',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverArt: 'https://placehold.co/400x400/111111/FFFFFF?text=Broome+St',
    duration: 254,
    plays: 2890,
    likes: 210,
    dislikes: 5,
    date: '2023-10-15T14:30:00Z',
    createdAt: '2023-10-15T14:30:00Z',
  },
  {
    id: 'track_3',
    title: 'Surreal Awakening',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverArt: 'https://placehold.co/400x400/222222/FFFFFF?text=Surreal',
    duration: 310,
    plays: 540,
    likes: 480,
    dislikes: 2,
    date: '2023-11-02T09:15:00Z',
    createdAt: '2023-11-02T09:15:00Z',
  },
];

// Helper to generate mock daily data
const generateMonthlyData = (month: string, year: number): MonthlyAnalytics => {
  const days = month === 'Feb' ? 28 : ['Apr', 'Jun', 'Sep', 'Nov'].includes(month) ? 30 : 31;
  return {
    month,
    year,
    data: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      plays: Math.floor(Math.random() * 500) + 100,
    })),
  };
};

export const mockMonthlyAnalytics: MonthlyAnalytics[] = [
  generateMonthlyData('Jan', 2024),
  generateMonthlyData('Feb', 2024),
  generateMonthlyData('Mar', 2024),
  generateMonthlyData('Apr', 2024),
  generateMonthlyData('May', 2024),
  generateMonthlyData('Jun', 2024),
  generateMonthlyData('Jul', 2024),
  generateMonthlyData('Aug', 2024),
  generateMonthlyData('Sep', 2024),
  generateMonthlyData('Oct', 2024),
  generateMonthlyData('Nov', 2024),
  generateMonthlyData('Dec', 2024),
];

export const mockMembers: Member[] = [
  {
    id: 'mem_1',
    firstName: 'John',
    lastName: 'Doe',
    city: 'New York',
    zip: '10001',
    occupation: 'Creative Director',
    instagram: '@johndoe',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
  },
];

export const mockStats = {
  totalSongs: 42,
  totalReacts: 12804,
  totalPlays: 45620,
  totalMembers: 1250,
};

export const mockUser = {
  isLoggedIn: false,
};
