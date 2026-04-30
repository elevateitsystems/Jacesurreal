"use client";

import { mockMonthlyAnalytics, mockStats, mockTracks } from '@/lib/mockData';
import { Calendar, Heart, Music, Play, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(mockMonthlyAnalytics.length - 1); // Default to latest month
  
  const currentMonthData = useMemo(() => mockMonthlyAnalytics[selectedMonthIndex], [selectedMonthIndex]);
  const topPlayed = [...mockTracks].sort((a, b) => b.plays - a.plays).slice(0, 5);
  const topLiked = [...mockTracks].sort((a, b) => b.likes - a.likes).slice(0, 5);

  const stats = [
    { label: 'Total Songs', value: mockStats.totalSongs, icon: Music, color: 'text-blue-400' },
    { label: 'Total Plays', value: mockStats.totalPlays.toLocaleString(), icon: Play, color: 'text-green-400' },
    { label: 'Total Reacts', value: mockStats.totalReacts.toLocaleString(), icon: Heart, color: 'text-primary' },
    { label: 'Total Members', value: mockStats.totalMembers.toLocaleString(), icon: Users, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-bebas tracking-widest text-white mb-2">STUDIO OVERVIEW</h1>
            <p className="text-white/40 uppercase tracking-widest text-sm font-medium">Real-time sonic performance analytics</p>
          </div>
          <div className="flex gap-4">
            <div className="relative group">
              <select 
                value={selectedMonthIndex}
                onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
                className="appearance-none bg-surface border border-white/10 pl-12 pr-10 py-3 rounded-sm text-white font-bebas tracking-widest text-sm focus:outline-none focus:border-primary cursor-pointer hover:bg-surface-hover transition-all"
              >
                {mockMonthlyAnalytics.map((m, i) => (
                  <option key={`${m.month}-${m.year}`} value={i}>{m.month} {m.year}</option>
                ))}
              </select>
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-hover:text-white transition-colors">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-surface border border-white/5 p-6 rounded-sm hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-sm bg-black/40 border border-white/5 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[0.7rem] font-bold text-green-500 flex items-center gap-1 font-mono">
                  +12.5%
                </span>
              </div>
              <h3 className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold mb-1">{stat.label}</h3>
              <p className="text-3xl font-bebas text-white tracking-wider">{stat.value}</p>
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
              {topPlayed.map((track, i) => (
                <div key={track.id} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-sm group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-white/20 font-bebas text-2xl w-6">0{i+1}</span>
                    <div className="w-12 h-12 rounded-sm overflow-hidden border border-white/10">
                      <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">{track.title}</h4>
                      <p className="text-white/20 text-[0.6rem] uppercase tracking-widest">Master Record • {track.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono text-sm font-bold">{track.plays.toLocaleString()}</p>
                    <p className="text-white/20 text-[0.6rem] uppercase tracking-widest">Cumulative</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-white/5 p-8 rounded-sm">
            <h3 className="text-xl font-bebas tracking-widest text-white mb-8 flex items-center gap-3">
              <Heart size={20} className="text-primary" /> TOP PERFORMANCE (REACTS)
            </h3>
            <div className="flex flex-col gap-4">
              {topLiked.map((track, i) => (
                <div key={track.id} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-sm group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-white/20 font-bebas text-2xl w-6">0{i+1}</span>
                    <div className="w-12 h-12 rounded-sm overflow-hidden border border-white/10">
                      <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">{track.title}</h4>
                      <p className="text-white/20 text-[0.6rem] uppercase tracking-widest">{track.likes} High-Res Likes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono text-sm font-bold">{((track.likes / (track.likes + track.dislikes + 1)) * 100).toFixed(0)}%</p>
                    <p className="text-white/20 text-[0.6rem] uppercase tracking-widest">Affinity</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
