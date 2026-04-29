"use client";

import { Music, Loader2, Upload, Image as ImageIcon, Save } from 'lucide-react';
import React, { useState } from 'react';
import * as mm from "music-metadata-browser";
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
  
  const [thumbMode, setThumbMode] = useState<"link" | "local">("link");
  const [audioMode, setAudioMode] = useState<"link" | "local">("link");

  const { showToast, ToastContainer } = useToast();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const extractMetadata = async (file: File) => {
    try {
      const metadata = await mm.parseBlob(file);
      return { duration: metadata.format.duration || 0 };
    } catch {
      return { duration: 0 };
    }
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { duration } = await extractMetadata(file);
    const base64 = await convertFileToBase64(file);
    setAudioUrl(base64);
    setDuration(duration);
  };

  const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await convertFileToBase64(file);
    setThumbnailUrl(base64);
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
    <div className="admin-card track-creator bg-[#0a0a0a] border border-white/5 rounded-sm p-10 max-w-5xl mx-auto">
      <ToastContainer />
      
      <div className="mb-10">
        <h2 className="text-4xl text-white font-bebas tracking-[0.2em]">CREATE NEW ARTIFACT</h2>
        <p className="text-white/30 text-[0.65rem] tracking-[0.3em] font-bold uppercase mt-1">Add a new frequency to the vault</p>
      </div>

      <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => setThumbMode("link")}
                className={`text-[0.7rem] uppercase font-bold tracking-widest pb-1 transition-all ${thumbMode === "link" ? "text-primary border-b-2 border-primary" : "text-white/20 hover:text-white"}`}
              >
                Link
              </button>
              <button 
                type="button"
                onClick={() => setThumbMode("local")}
                className={`text-[0.7rem] uppercase font-bold tracking-widest pb-1 transition-all ${thumbMode === "local" ? "text-primary border-b-2 border-primary" : "text-white/20 hover:text-white"}`}
              >
                from local
              </button>
            </div>
            
            <label className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold">COVER ART URL</label>
            
            {thumbMode === "link" ? (
              <input
                type="text"
                value={thumbnailUrl || ""}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://example.com/image."
                className="bg-black/40 border border-white/5 text-white px-4 py-4 rounded-sm focus:outline-none focus:border-primary transition-all text-xs font-mono"
              />
            ) : (
              <div 
                onClick={() => document.getElementById('thumb-file')?.click()}
                className="bg-black/40 border border-white/5 border-dashed rounded-sm py-4 px-4 text-xs text-white/40 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center gap-3"
              >
                <Upload size={16} />
                <span>{thumbnailUrl?.startsWith('data:') ? "Cover Art Selected" : "Choose local image"}</span>
                <input id="thumb-file" type="file" accept="image/*" className="hidden" onChange={handleThumbnailFileChange} />
              </div>
            )}

            <div className="aspect-square w-full rounded-sm bg-black border border-white/5 border-dashed flex items-center justify-center overflow-hidden relative group">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-10">
                  <ImageIcon size={48} strokeWidth={1} />
                  <p className="text-[0.55rem] uppercase font-bold tracking-[0.2em] text-center px-6">Preview appears when url is valid</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            
            <div className="flex flex-col gap-3">
              <label className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold">TRACK TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Waves"
                required
                className="bg-black/40 border border-white/5 text-white px-5 py-5 rounded-sm focus:outline-none focus:border-primary transition-all text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setAudioMode("link")}
                  className={`text-[0.7rem] uppercase font-bold tracking-widest pb-1 transition-all ${audioMode === "link" ? "text-primary border-b-2 border-primary" : "text-white/20 hover:text-white"}`}
                >
                  Link
                </button>
                <button 
                  type="button"
                  onClick={() => setAudioMode("local")}
                  className={`text-[0.7rem] uppercase font-bold tracking-widest pb-1 transition-all ${audioMode === "local" ? "text-primary border-b-2 border-primary" : "text-white/20 hover:text-white"}`}
                >
                  from local
                </button>
              </div>
              
              <label className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold">AUDIO SOURCE URL</label>
              
              {audioMode === "link" ? (
                <input
                  type="text"
                  value={audioUrl || ""}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  className="bg-black/40 border border-white/5 text-white px-5 py-5 rounded-sm focus:outline-none focus:border-primary transition-all text-xs font-mono"
                />
              ) : (
                <div 
                  onClick={() => document.getElementById('audio-file')?.click()}
                  className="bg-black/40 border border-white/5 border-dashed rounded-sm py-5 px-5 text-xs text-white/40 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center gap-3"
                >
                  <Music size={18} />
                  <span>{audioUrl?.startsWith('data:') ? (title || "Audio Selected") : "Choose local audio file"}</span>
                  <input id="audio-file" type="file" accept="audio/*" className="hidden" onChange={handleAudioFileChange} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold">RELEASE / SCHEDULE DATE</label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
                className="bg-black/40 border border-white/5 text-white px-5 py-5 rounded-sm focus:outline-none focus:border-primary transition-all text-sm uppercase tracking-widest"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] text-white/20 uppercase tracking-widest font-bold">INITIAL PLAYS</label>
                <input
                  type="number"
                  value={initialPlays}
                  onChange={(e) => setInitialPlays(e.target.value)}
                  className="bg-black/20 border border-white/5 text-white/40 px-4 py-3 rounded-sm text-xs"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] text-white/20 uppercase tracking-widest font-bold">INITIAL LIKES</label>
                <input
                  type="number"
                  value={initialLikes}
                  onChange={(e) => setInitialLikes(e.target.value)}
                  className="bg-black/20 border border-white/5 text-white/40 px-4 py-3 rounded-sm text-xs"
                />
              </div>
            </div>

          </div>
        </div>

        <button 
          type="submit"
          disabled={isPublishing}
          className="w-full bg-primary text-white py-6 rounded-sm font-bold tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-opacity-90 transition-all disabled:opacity-50 shadow-[0_10px_40px_rgba(255,45,85,0.15)] uppercase text-lg"
        >
          {isPublishing ? (
            <>
              <Loader2 size={24} className="animate-spin" /> PUBLISHING...
            </>
          ) : (
            <>
              <Save size={24} /> FINALIZE ARTIFACT
            </>
          )}
        </button>

      </form>
    </div>
  );
}
