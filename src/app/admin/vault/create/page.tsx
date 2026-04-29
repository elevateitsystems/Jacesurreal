"use client";

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Music, Upload, Save, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as mm from "music-metadata-browser";

export default function CreateVault() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [coverArt, setCoverArt] = useState("");
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");

  const [thumbMode, setThumbMode] = useState<"link" | "local">("link");
  const [audioMode, setAudioMode] = useState<"link" | "local">("link");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioUrl || !title) {
      setError("Title and Audio Source are required");
      return;
    }

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
          duration
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

        <div className="max-w-5xl bg-surface/30 border border-white/5 p-12 rounded-sm">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-sm tracking-wider uppercase mb-8">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
              
              {/* Left Column: Cover Art Section */}
              <div className="flex flex-col gap-5">
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
                  <input 
                    type="text" 
                    placeholder="https://example.com/image.jpg" 
                    value={coverArt}
                    onChange={(e) => setCoverArt(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all text-xs font-mono"
                  />
                ) : (
                  <div 
                    onClick={() => document.getElementById('thumb-file')?.click()} 
                    className="bg-black/40 border border-white/5 border-dashed rounded-sm py-4 px-4 text-xs text-white/40 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center gap-3"
                  >
                    <Upload size={16} /> 
                    <span>{coverArt?.startsWith('data:') ? "Cover Art Selected" : "Choose local image"}</span>
                    <input id="thumb-file" type="file" accept="image/*" className="hidden" onChange={handleThumbnailFileChange} />
                  </div>
                )}

                <div className="aspect-square rounded-sm bg-black/50 border border-white/5 border-dashed flex flex-col items-center justify-center overflow-hidden">
                  {coverArt ? (
                    <img src={coverArt} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-10">
                      <ImageIcon size={32} />
                      <span className="text-[0.5rem] uppercase tracking-widest text-center px-4">Preview appears when URL is valid</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Details Section */}
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-3">
                  <label className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold">TRACK TITLE</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Midnight Waves" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm py-5 px-6 text-white text-lg focus:outline-none focus:border-primary transition-all" 
                  />
                </div>

                <div className="flex flex-col gap-5">
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
                    <input 
                      type="text" 
                      required
                      placeholder="https://example.com/audio.mp3" 
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-sm py-5 px-6 text-white focus:outline-none focus:border-primary transition-all font-mono text-xs" 
                    />
                  ) : (
                    <div 
                      onClick={() => document.getElementById('audio-file')?.click()} 
                      className="bg-black/40 border border-white/5 border-dashed rounded-sm py-5 px-6 text-xs text-white/40 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center gap-3"
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
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-sm py-5 px-6 text-white focus:outline-none focus:border-primary transition-all uppercase tracking-widest text-sm" 
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={isSaving}
              className="w-full bg-primary text-white font-bebas tracking-[0.3em] text-2xl py-6 rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(255,45,85,0.2)]"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={28} />
              ) : (
                <Save size={28} />
              )}
              Finalize Artifact
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
