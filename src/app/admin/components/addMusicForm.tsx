"use client";

import { Music, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import AudioUploadField from './audioUpload';
import useToast from '@/lib/useToast';

export default function AddMusicForm() {
  const [title, setTitle] = useState('');
  const [initialPlays, setInitialPlays] = useState('0');
  const [initialLikes, setInitialLikes] = useState('0');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const { showToast, ToastContainer } = useToast();

  const handleAudioChange = (url: string | null, dur?: number) => {
    setAudioUrl(url);
    if (dur) setDuration(dur);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioUrl || !title) {
      showToast("Required Fields Missing", "Title and Audio Source are required", "error");
      return;
    }

    setIsPublishing(true);
    try {
      showToast("Finalizing track...", "info");
      const trackData = {
        title,
        audioUrl,
        coverArt: thumbnailUrl || undefined,
        duration,
        plays: parseInt(initialPlays) || 0,
        likes: parseInt(initialLikes) || 0,
        date: new Date(releaseDate).toISOString(),
      };

      const response = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save track");
      }

      showToast("Success", "Track published successfully!", "success");
      
      // Reset form
      setTitle('');
      setInitialPlays('0');
      setInitialLikes('0');
      setAudioUrl(null);
      setThumbnailUrl(null);
      setDuration(0);
      
    } catch (error: any) {
      console.error(error);
      showToast("Error", error.message, "error");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="admin-card track-creator bg-surface border border-border-subtle rounded-sm p-8">
      <ToastContainer />
      <div className="card-header mb-8 pb-4 border-b border-border-subtle">
        <h2 className="text-2xl mb-1 text-white font-bebas tracking-widest">Create New Artifact</h2>
        <p className="text-white/50 text-sm tracking-widest uppercase text-[0.6rem] font-bold">Add a new frequency to the vault</p>
      </div>
      <form className="admin-create-form flex flex-col gap-8" onSubmit={handleSubmit}>
        
        <AudioUploadField 
          audioUrl={audioUrl}
          thumbnailUrl={thumbnailUrl}
          onAudioChange={handleAudioChange}
          onThumbnailChange={setThumbnailUrl}
        />
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="input-group-admin flex-1 flex flex-col gap-2">
            <label className="text-[0.7rem] text-white/40 uppercase tracking-[0.3em] font-bold ml-1">
              Track Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Waves"
              required
              className="bg-black/30 border border-white/10 text-white px-4 py-4 rounded-sm focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="input-group-admin flex-1 flex flex-col gap-2">
            <label className="text-[0.7rem] text-white/40 uppercase tracking-[0.3em] font-bold ml-1">
              Release / Schedule Date
            </label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
              className="bg-black/30 border border-white/10 text-white px-4 py-4 rounded-sm focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="input-group-admin flex flex-col gap-2 w-full">
            <label className="text-[0.7rem] text-white/40 uppercase tracking-[0.3em] font-bold ml-1">
              Initial Plays
            </label>
            <input
              type="number"
              value={initialPlays}
              onChange={(e) => setInitialPlays(e.target.value)}
              placeholder="0"
              className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>
          <div className="input-group-admin flex flex-col gap-2 w-full">
            <label className="text-[0.7rem] text-white/40 uppercase tracking-[0.3em] font-bold ml-1">
              Initial Likes
            </label>
            <input
              type="number"
              value={initialLikes}
              onChange={(e) => setInitialLikes(e.target.value)}
              placeholder="0"
              className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={isPublishing}
          className="create-track-btn mt-4 bg-[image:var(--background-image-primary-gradient)] text-white rounded-sm p-5 font-bold tracking-[0.3em] flex items-center justify-center gap-2.5 transition-all hover:opacity-90 border-none disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm"
        >
          {isPublishing ? (
            <>
              <Loader2 size={18} className="animate-spin" /> PUBLISHING...
            </>
          ) : (
            <>
              <Save size={18} /> FINALIZE ARTIFACT
            </>
          )}
        </button>
      </form>
    </div>
  )
}
