"use client";

import { useEffect, useState } from 'react';
import { Heart, Music, Play, Users } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

interface DashboardTrack {
  _id: string;
  title: string;
  coverArt: string;
  plays: number;
  likes: number;
  dislikes: number;
}

interface DashboardData {
  totalSongs: number;
  totalPlays: number;
  totalReacts: number;
  totalMembers: number;
  topByPlays: DashboardTrack[];
  topByLikes: DashboardTrack[];
}

const TrackImage = ({ src, title }: { src: string; title: string }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return <Music className="text-white/10" size={20} />;
  }
  return (
    <img 
      src={src} 
      alt={title} 
      onError={() => setError(true)}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
    />
  );
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const stats = [
    { label: 'Total Songs', value: data?.totalSongs ?? 0, icon: Music, color: 'text-blue-400' },
    { label: 'Total Plays', value: (data?.totalPlays ?? 0).toLocaleString(), icon: Play, color: 'text-green-400' },
    { label: 'Total Reacts', value: (data?.totalReacts ?? 0).toLocaleString(), icon: Heart, color: 'text-primary' },
    { label: 'Total Members', value: (data?.totalMembers ?? 0).toLocaleString(), icon: Users, color: 'text-purple-400' },
  ];

  const topPlayed = data?.topByPlays || [];
  const topLiked = data?.topByLikes || [];

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12">
          <h1 className="text-5xl font-bebas tracking-widest text-white mb-2">STUDIO OVERVIEW</h1>
          <p className="text-white/40 uppercase tracking-widest text-sm font-medium">Real-time sonic performance analytics</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-surface border border-white/5 p-6 rounded-sm hover:border-white/10 transition-colors ${isLoading ? 'animate-pulse' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-sm bg-black/40 border border-white/5 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <h3 className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold mb-1">{stat.label}</h3>
              <p className="text-3xl font-bebas text-white tracking-wider">{isLoading ? '--' : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Rankings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface border border-white/5 p-8 rounded-sm">
            <h3 className="text-xl font-bebas tracking-widest text-white mb-8 flex items-center gap-3">
              <Play size={20} className="text-primary" /> TOP PERFORMANCE (PLAYS)
            </h3>
            <div className="flex flex-col gap-4">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-black/20 border border-white/5 rounded-sm animate-pulse" />
                ))
              ) : topPlayed.length === 0 ? (
                <p className="text-white/20 text-sm uppercase tracking-widest text-center py-8">No data available</p>
              ) : (
                topPlayed.map((track, i) => (
                  <div key={track._id} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-sm group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-white/20 font-bebas text-2xl w-6">0{i+1}</span>
                      <div className="w-12 h-12 rounded-sm overflow-hidden border border-white/10 flex items-center justify-center bg-black/30">
                        <TrackImage src={track.coverArt} title={track.title} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">{track.title || '--'}</h4>
                        <p className="text-white/20 text-[0.6rem] uppercase tracking-widest">Master Record • {track._id.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono text-sm font-bold">{(track.plays || 0).toLocaleString()}</p>
                      <p className="text-white/20 text-[0.6rem] uppercase tracking-widest">Cumulative</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-surface border border-white/5 p-8 rounded-sm">
            <h3 className="text-xl font-bebas tracking-widest text-white mb-8 flex items-center gap-3">
              <Heart size={20} className="text-primary" /> TOP PERFORMANCE (REACTS)
            </h3>
            <div className="flex flex-col gap-4">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-black/20 border border-white/5 rounded-sm animate-pulse" />
                ))
              ) : topLiked.length === 0 ? (
                <p className="text-white/20 text-sm uppercase tracking-widest text-center py-8">No data available</p>
              ) : (
                topLiked.map((track, i) => (
                  <div key={track._id} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-sm group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-white/20 font-bebas text-2xl w-6">0{i+1}</span>
                      <div className="w-12 h-12 rounded-sm overflow-hidden border border-white/10 flex items-center justify-center bg-black/30">
                        <TrackImage src={track.coverArt} title={track.title} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">{track.title || '--'}</h4>
                        <p className="text-white/20 text-[0.6rem] uppercase tracking-widest">{track.likes || 0} High-Res Likes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono text-sm font-bold">{((track.likes / (track.likes + track.dislikes + 1)) * 100).toFixed(0)}%</p>
                      <p className="text-white/20 text-[0.6rem] uppercase tracking-widest">Affinity</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
