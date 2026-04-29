"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import { Save, ArrowLeft, Trash2, Upload, ImageIcon, Music, Loader2 } from 'lucide-react';
import { Skeleton, FormSkeleton } from '@/components/Skeleton';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import * as mm from "music-metadata-browser";

interface Track {
  _id: string;
  title: string;
  audioUrl: string;
  coverArt: string;
  plays: number;
  likes?: number;
  dislikes?: number;
  date: string;
}

export default function EditVault() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [track, setTrack] = useState<Track | null>(null);
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [coverArt, setCoverArt] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [thumbMode, setThumbMode] = useState<"link" | "local">("link");
  const [audioMode, setAudioMode] = useState<"link" | "local">("link");

  useEffect(() => {
    fetchTrack();
  }, [id]);

  const fetchTrack = async () => {
    try {
      const response = await fetch("/api/music");
      const data = await response.json();
      if (Array.isArray(data)) {
        const found = data.find(t => t._id === id);
        if (found) {
          setTrack(found);
          setTitle(found.title);
          setAudioUrl(found.audioUrl);
          setCoverArt(found.coverArt);
          setDate(new Date(found.date).toISOString().split('T')[0]);
          if (found.audioUrl?.startsWith('data:')) setAudioMode("local");
          if (found.coverArt?.startsWith('data:')) setThumbMode("local");
        }
      }
    } catch (err) {
      setError("Failed to fetch track details");
    } finally {
      setIsLoading(false);
    }
  };

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
    setCoverArt(base64);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioUrl || !title) {
      setError("Title and Audio Source are required");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/music/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          audioUrl,
          coverArt: coverArt || undefined,
          date,
          duration: duration || track?.plays // Placeholder fallback
        }),
      });

      if (response.ok) {
        router.push("/admin/vault");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update track");
      }
    } catch (err) {
      setError("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this track?')) {
      try {
        const response = await fetch(`/api/music/${id}`, { method: "DELETE" });
        if (response.ok) {
          router.push("/admin/vault");
        }
      } catch (err) {
        alert("Failed to delete track");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex">
        <AdminSidebar />
        <main className="flex-1 ml-72 p-12">
          <header className="mb-12 flex items-center gap-6">
            <Skeleton className="w-12 h-12" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-64 h-12" />
              <Skeleton className="w-48 h-4" />
            </div>
          </header>
          <FormSkeleton />
        </main>
      </div>
    );
  }

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
            <p className="text-white/40 uppercase tracking-widest text-sm font-medium">Modifying Frequency Record</p>
          </div>
        </header>

        <div className="max-w-4xl bg-surface/50 border border-border-subtle p-10 rounded-sm">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-sm tracking-wider uppercase mb-6">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-10" onSubmit={handleSave}>
            
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-sm w-fit mb-2">
                  <button 
                    type="button" 
                    onClick={() => setThumbMode("link")} 
                    className={`text-[0.6rem] uppercase font-bold tracking-widest px-4 py-1.5 rounded-sm transition-all ${thumbMode === "link" ? "bg-[#FF2D55] text-white" : "text-white/40 hover:text-white"}`}
                  >
                    Link
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setThumbMode("local")} 
                    className={`text-[0.6rem] uppercase font-bold tracking-widest px-4 py-1.5 rounded-sm transition-all ${thumbMode === "local" ? "bg-[#FF2D55] text-white" : "text-white/40 hover:text-white"}`}
                  >
                    from local
                  </button>
                </div>
                <label className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold">COVER ART URL</label>
                {thumbMode === "link" ? (
                  <input type="text" value={coverArt || ""} onChange={(e) => setCoverArt(e.target.value)} className="bg-black/40 border border-white/5 text-white px-4 py-4 rounded-sm focus:outline-none focus:border-primary transition-all text-xs font-mono" />
                ) : (
                  <div onClick={() => document.getElementById('thumb-file')?.click()} className="bg-black/40 border border-white/5 border-dashed rounded-sm py-4 px-4 text-xs text-white/40 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center gap-3">
                    <Upload size={16} /> <span>{coverArt?.startsWith('data:') ? "Cover Art Selected" : "Choose local image"}</span>
                    <input id="thumb-file" type="file" accept="image/*" className="hidden" onChange={handleThumbnailFileChange} />
                  </div>
                )}
                <div className="aspect-square rounded-sm bg-black/50 border border-white/5 border-dashed flex items-center justify-center overflow-hidden">
                  {coverArt ? <img src={coverArt} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-white/10" />}
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Track Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white text-lg focus:outline-none focus:border-primary transition-all" />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-sm w-fit mb-2">
                    <button 
                      type="button" 
                      onClick={() => setAudioMode("link")} 
                      className={`text-[0.6rem] uppercase font-bold tracking-widest px-4 py-1.5 rounded-sm transition-all ${audioMode === "link" ? "bg-[#FF2D55] text-white" : "text-white/40 hover:text-white"}`}
                    >
                      Link
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAudioMode("local")} 
                      className={`text-[0.6rem] uppercase font-bold tracking-widest px-4 py-1.5 rounded-sm transition-all ${audioMode === "local" ? "bg-[#FF2D55] text-white" : "text-white/40 hover:text-white"}`}
                    >
                      from local
                    </button>
                  </div>
                  <label className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold">AUDIO SOURCE URL</label>
                  {audioMode === "link" ? (
                    <input type="text" required value={audioUrl || ""} onChange={(e) => setAudioUrl(e.target.value)} className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all font-mono text-xs" />
                  ) : (
                    <div onClick={() => document.getElementById('audio-file')?.click()} className="bg-black/40 border border-white/5 border-dashed rounded-sm py-5 px-5 text-xs text-white/40 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center gap-3">
                      <Music size={18} /> <span>{audioUrl?.startsWith('data:') ? (title || "Audio Selected") : "Choose local audio file"}</span>
                      <input id="audio-file" type="file" accept="audio/*" className="hidden" onChange={handleAudioFileChange} />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Release Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button disabled={isSaving} className="flex-1 bg-primary text-white font-bebas tracking-[0.2em] text-xl py-6 rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(255,45,85,0.2)]">
                {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />} 
                Save Changes
              </button>
              <button type="button" onClick={handleDelete} className="w-20 bg-surface border border-border-subtle text-white/20 flex items-center justify-center rounded-sm hover:text-red-500 hover:border-red-500 transition-all">
                <Trash2 size={24} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
