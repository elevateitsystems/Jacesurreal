export type Track = {
  id: string;
  title: string;
  audioUrl: string; // Placeholder for now
  coverArt: string; // Placeholder
  duration: number; // in seconds
  plays: number;
  likes: number;
  dislikes: number;
  createdAt: string;
};

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  zip: string;
  occupation: string;
  instagram: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export const mockTracks: Track[] = [
  {
    id: 'track_1',
    title: 'Midnight in Montauk',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Example royalty-free mp3
    coverArt: 'https://placehold.co/400x400/000000/FFFFFF?text=Montauk',
    duration: 372, // 6:12
    plays: 1205,
    likes: 342,
    dislikes: 12,
    createdAt: '2023-10-01T12:00:00Z',
  },
  {
    id: 'track_2',
    title: 'Broome St. Echoes',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverArt: 'https://placehold.co/400x400/111111/FFFFFF?text=Broome+St',
    duration: 254, // 4:14
    plays: 890,
    likes: 210,
    dislikes: 5,
    createdAt: '2023-10-15T14:30:00Z',
  },
  {
    id: 'track_3',
    title: 'Surreal Awakening',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverArt: 'https://placehold.co/400x400/222222/FFFFFF?text=Surreal',
    duration: 310, // 5:10
    plays: 540,
    likes: 180,
    dislikes: 2,
    createdAt: '2023-11-02T09:15:00Z',
  },
];

export const mockStats = {
  totalPlays: 2635,
  totalLikes: 734,
  activeMembers: 142,
  pendingRequests: 18,
};

export const mockUser = {
  isLoggedIn: false, // Start as false, can be toggled
};
