"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import { Music, Upload, Save, ArrowLeft, Image as ImageIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { mockTracks, Track } from '@/lib/mockData';

export default function EditVault() {
  const router = useRouter();
  const params = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    const foundTrack = mockTracks.find(t => t.id === params.id);
    if (foundTrack) {
      setTrack(foundTrack);
      setCoverPreview(foundTrack.coverArt);
    }
  }, [params.id]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  if (!track) return null;

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12 flex items-center gap-6">
          <Link href="/admin/vault" className="w-12 h-12 rounded-sm bg-surface border border-border-subtle flex items-center justify-center text-white hover:bg-surface-hover transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-5xl font-bebas tracking-widest text-white mb-2">EDIT ARTIFACT</h1>
            <p className="text-white/40 uppercase tracking-widest text-sm font-medium">Modifying: {track.title}</p>
          </div>
        </header>

        <div className="max-w-4xl bg-surface/50 border border-border-subtle p-10 rounded-sm">
          <form className="flex flex-col gap-10" onSubmit={(e) => { e.preventDefault(); router.push('/admin/vault'); }}>
            
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
              {/* Cover Upload / Change */}
              <div className="flex flex-col gap-4">
                <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold">Thumbnail / Cover</label>
                <div className="relative group">
                  <div className="aspect-square rounded-sm bg-black/50 border-2 border-border-subtle flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-primary cursor-pointer shadow-2xl">
                    <img src={coverPreview || track.coverArt} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                    </div>
                  </div>
                  <input type="file" className="hidden" id="cover-edit" accept="image/*" onChange={handleCoverChange} />
                  <button type="button" onClick={() => document.getElementById('cover-edit')?.click()} className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload size={16} />
                  </button>
                </div>
              </div>

              {/* Basic Details */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Track Title</label>
                  <input 
                    type="text" 
                    defaultValue={track.title}
                    className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white text-lg focus:outline-none focus:border-primary transition-all" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Update Master File</label>
                  <div className="relative border border-border-subtle bg-black/40 rounded-sm p-6 flex items-center justify-between group hover:border-primary transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Music size={20} className="text-primary" />
                      <span className="text-white/70 text-sm font-mono truncate max-w-[200px]">current_file.wav</span>
                    </div>
                    <span className="text-white/20 text-[0.6rem] uppercase tracking-widest font-bold">Click to Replace</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Plays (Manual Sync)</label>
                <input 
                  type="number" 
                  defaultValue={track.plays}
                  className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white/70 focus:outline-none focus:border-primary transition-all" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Status</label>
                <select className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white/70 focus:outline-none focus:border-primary transition-all appearance-none">
                  <option>Live In Vault</option>
                  <option>Draft / Hidden</option>
                  <option>Archived</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-primary text-white font-bebas tracking-[0.2em] text-xl py-6 rounded-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(255,45,85,0.2)]">
                <Save size={24} /> Save Changes
              </button>
              <button type="button" className="w-20 bg-surface border border-border-subtle text-white/20 flex items-center justify-center rounded-sm hover:text-red-500 hover:border-red-500 transition-all">
                <Trash2 size={24} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
