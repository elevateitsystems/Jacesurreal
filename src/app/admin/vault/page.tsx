"use client";

import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import { Search, Plus, Edit2, Trash2, Play, Calendar, BarChart2, Music, Filter } from 'lucide-react';
import { TableRowSkeleton } from '@/components/Skeleton';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Track {
  _id: string;
  title: string;
  coverArt: string;
  plays: number;
  date: string;
  duration?: number;
  createdAt: string;
}

const VaultImage = ({ src, title }: { src: string; title: string }) => {
  const [error, setError] = useState(false);
  
  if (!src || error) {
    return <Music className="text-white/10" size={32} />;
  }

  return (
    <img 
      src={src} 
      alt={title} 
      onError={() => setError(true)}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
    />
  );
};

export default function VaultManagement() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortByDate, setSortByDate] = useState(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Delete Confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    
    const id = deleteId;
    setDeleteId(null);
    setShowDeleteDialog(false);

    const deletePromise = fetch(`/api/music/${id}`, { method: "DELETE" });
    
    toast.promise(deletePromise, {
      loading: 'Deleting artifact...',
      success: () => {
        setTracks(prev => prev.filter(t => t._id !== id));
        return 'Artifact purged from the vault';
      },
      error: 'Failed to delete artifact',
    });
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
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} />)}
            </div>
          ) : (
            filteredTracks.map((track) => (
              <div key={track._id} className="bg-surface/30 border border-border-subtle p-6 rounded-sm flex items-center justify-between group hover:bg-surface/50 transition-all">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-sm overflow-hidden border border-border-subtle shadow-lg bg-black/50 flex items-center justify-center">
                    <VaultImage src={track.coverArt} title={track.title} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bebas tracking-wider text-white mb-2 group-hover:text-primary transition-colors">{track.title}</h3>
                    <div className="flex items-center gap-6 text-white/30 text-xs font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Play size={12} className="text-primary" /> {track.plays?.toLocaleString() || 0} Plays</span>
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(track.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5">
                        <Music size={12} /> {formatDuration(track.duration)}
                        {(!track.duration || track.duration === 0) && (
                          <span className="ml-1 text-primary text-[0.6rem] animate-pulse">(MISSING)</span>
                        )}
                      </span>
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

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-surface border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-3xl font-bebas tracking-widest">DELETE ARTIFACT?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/40 font-medium tracking-wide uppercase text-xs">
                This action is permanent. This artifact will be purged from the sonic archive forever.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 gap-4">
              <AlertDialogCancel className="bg-transparent border-white/5 text-white/40 hover:bg-white/5 hover:text-white rounded-sm font-bebas tracking-widest uppercase transition-all">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={executeDelete}
                className="bg-primary text-white hover:bg-opacity-90 rounded-sm font-bebas tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,45,85,0.2)]"
              >
                Purge Artifact
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
