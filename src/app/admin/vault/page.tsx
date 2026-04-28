"use client";

import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Search, Plus, Edit2, Trash2, Play, Calendar, BarChart2, Music, Loader2, Filter } from 'lucide-react';
import Link from 'next/link';

interface Track {
  _id: string;
  title: string;
  coverArt: string;
  plays: number;
  date: string;
  createdAt: string;
}

export default function VaultManagement() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortByDate, setSortByDate] = useState(false);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/music");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTracks(data);
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTracks = useMemo(() => {
    let result = tracks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortByDate) {
      result = [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return result;
  }, [searchQuery, tracks, sortByDate]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this track from the vault?')) {
      try {
        const response = await fetch(`/api/music/${id}`, { method: "DELETE" });
        if (response.ok) {
          setTracks(prev => prev.filter(t => t._id !== id));
        }
      } catch (error) {
        alert("Failed to delete track");
      }
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

        {/* Filters & Search */}
        <div className="flex gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={24} />
            <input 
              type="text" 
              placeholder="Search sonic artifacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/50 border border-border-subtle rounded-sm py-6 pl-16 pr-6 text-white text-xl font-bebas tracking-widest focus:outline-none focus:border-primary transition-all backdrop-blur-md"
            />
          </div>
          
          <button 
            onClick={() => setSortByDate(!sortByDate)}
            className={`px-8 flex items-center gap-3 rounded-sm border transition-all font-bebas tracking-widest text-lg ${
              sortByDate ? 'bg-primary border-primary text-white' : 'bg-surface/50 border-border-subtle text-white/40 hover:text-white'
            }`}
          >
            <Filter size={20} /> {sortByDate ? 'Sorted by Date' : 'Sort by Date'}
          </button>
        </div>

        {/* Vault List */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            filteredTracks.map((track) => (
              <div key={track._id} className="bg-surface/30 border border-border-subtle p-6 rounded-sm flex items-center justify-between group hover:bg-surface/50 transition-all">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-sm overflow-hidden border border-border-subtle shadow-lg bg-black">
                    {track.coverArt && <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bebas tracking-wider text-white mb-2 group-hover:text-primary transition-colors">{track.title}</h3>
                    <div className="flex items-center gap-6 text-white/30 text-xs font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Play size={12} className="text-primary" /> {track.plays?.toLocaleString() || 0} Plays</span>
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(track.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><BarChart2 size={12} /> ID: {track._id.slice(-6)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Link 
                    href={`/admin/vault/edit/${track._id}`}
                    className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(track._id)}
                    className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 text-white/50 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}

          {!isLoading && filteredTracks.length === 0 && (
            <div className="text-center py-20 bg-surface/10 border border-dashed border-border-subtle rounded-sm">
              <Music size={48} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/40 font-bebas tracking-widest text-2xl">No artifacts found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
