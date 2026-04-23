"use client";

import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { mockTracks, Track } from '@/lib/mockData';
import { Search, Plus, Edit2, Trash2, Play, Calendar, BarChart2, Music } from 'lucide-react';
import Link from 'next/link';

export default function VaultManagement() {
  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  
  const lastRequestId = useRef(0);

  useEffect(() => {
    const requestId = ++lastRequestId.current;
    
    const timer = setTimeout(async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (requestId === lastRequestId.current) {
        const results = tracks.filter(t => 
          t.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTracks(results);
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, tracks]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this track from the vault?')) {
      setTracks(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-bebas tracking-widest text-white mb-2">VAULT MANAGEMENT</h1>
            <p className="text-white/40 uppercase tracking-widest text-sm font-medium">Control the unreleased archive</p>
          </div>
          <Link href="/admin/vault/create" className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-sm font-bebas tracking-widest text-lg hover:bg-opacity-90 transition-all shadow-[0_0_30px_rgba(255,45,85,0.2)]">
            <Plus size={20} /> Create New Entry
          </Link>
        </header>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={24} />
          <input 
            type="text" 
            placeholder="Search sonic artifacts by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/50 border border-border-subtle rounded-sm py-6 pl-16 pr-6 text-white text-xl font-bebas tracking-widest focus:outline-none focus:border-primary transition-all backdrop-blur-md"
          />
          {isLoading && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Vault List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTracks.map((track) => (
            <div key={track.id} className="bg-surface/30 border border-border-subtle p-6 rounded-sm flex items-center justify-between group hover:bg-surface/50 transition-all">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-sm overflow-hidden border border-border-subtle shadow-lg">
                  <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bebas tracking-wider text-white mb-2 group-hover:text-primary transition-colors">{track.title}</h3>
                  <div className="flex items-center gap-6 text-white/30 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Play size={12} className="text-primary" /> {track.plays.toLocaleString()} Plays</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(track.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><BarChart2 size={12} /> ID: {track.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link 
                  href={`/admin/vault/edit/${track.id}`}
                  className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <Edit2 size={18} />
                </Link>
                <button 
                  onClick={() => handleDelete(track.id)}
                  className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 text-white/50 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {filteredTracks.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-surface/10 border border-dashed border-border-subtle rounded-sm">
              <Music size={48} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/40 font-bebas tracking-widest text-2xl">No artifacts found matching your search</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
