"use client";

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Music, Upload, Save, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateVault() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [coverArt, setCoverArt] = useState("");
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          audioUrl,
          coverArt: coverArt || undefined,
          date,
        }),
      });

      if (response.ok) {
        router.push("/admin/vault");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create track");
      }
    } catch (err) {
      setError("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12 flex items-center gap-6">
          <Link href="/admin/vault" className="w-12 h-12 rounded-sm bg-surface border border-border-subtle flex items-center justify-center text-white hover:bg-surface-hover transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-5xl font-bebas tracking-widest text-white mb-2">CREATE NEW ARTIFACT</h1>
            <p className="text-white/40 uppercase tracking-widest text-sm font-medium">Add a new frequency to the vault</p>
          </div>
        </header>

        <div className="max-w-4xl bg-surface/50 border border-border-subtle p-10 rounded-sm">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-sm tracking-wider uppercase mb-6">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
              {/* Cover Artwork Link */}
              <div className="flex flex-col gap-4">
                <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Cover Art URL</label>
                <input 
                  type="text" 
                  placeholder="https://example.com/image.jpg" 
                  value={coverArt}
                  onChange={(e) => setCoverArt(e.target.value)}
                  className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all"
                />
                <div className="aspect-square rounded-sm bg-black/50 border-2 border-dashed border-border-subtle flex flex-col items-center justify-center overflow-hidden">
                  {coverArt ? (
                    <img src={coverArt} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-white/20 mb-2" />
                      <span className="text-[0.6rem] text-white/20 uppercase tracking-tighter text-center px-4">Preview appears when URL is valid</span>
                    </>
                  )}
                </div>
              </div>

              {/* Basic Details */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Track Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Midnight Waves" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white text-lg focus:outline-none focus:border-primary transition-all" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Audio Source URL</label>
                  <input 
                    type="text" 
                    required
                    placeholder="https://example.com/audio.mp3" 
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Release / Schedule Date</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all" 
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={isSaving}
              className="w-full bg-primary text-white font-bebas tracking-[0.2em] text-xl py-6 rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(255,45,85,0.2)]"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <Save size={24} />
              )}
              Finalize Artifact
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
