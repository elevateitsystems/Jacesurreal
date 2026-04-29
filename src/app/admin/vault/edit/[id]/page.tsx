"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AudioUploadField from '../../../components/audioUpload';
import { Save, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

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
        }
      }
    } catch (err) {
      setError("Failed to fetch track details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioChange = (url: string | null, dur?: number) => {
    setAudioUrl(url);
    if (dur) setDuration(dur);
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
          duration: duration || track?.plays // Placeholder if duration isn't set
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!track && !isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Track not found
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
            <AudioUploadField 
              audioUrl={audioUrl}
              thumbnailUrl={coverArt}
              onAudioChange={handleAudioChange}
              onThumbnailChange={setCoverArt}
            />

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Track Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white text-lg focus:outline-none focus:border-primary transition-all" 
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Release Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all" 
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                disabled={isSaving}
                className="flex-1 bg-primary text-white font-bebas tracking-[0.2em] text-xl py-6 rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(255,45,85,0.2)]"
              >
                {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />} 
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={handleDelete}
                className="w-20 bg-surface border border-border-subtle text-white/20 flex items-center justify-center rounded-sm hover:text-red-500 hover:border-red-500 transition-all"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
