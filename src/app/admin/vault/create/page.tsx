"use client";

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Music, Upload, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateVault() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
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
          <form className="flex flex-col gap-10" onSubmit={(e) => { e.preventDefault(); router.push('/admin/vault'); }}>
            
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
              {/* Cover Upload */}
              <div className="flex flex-col gap-4">
                <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold">Cover Artwork</label>
                <div className="relative group">
                  <div className="aspect-square rounded-sm bg-black/50 border-2 border-dashed border-border-subtle flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-primary cursor-pointer">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-white/20 mb-2" />
                        <span className="text-[0.6rem] text-white/20 uppercase tracking-tighter">400x400 recommended</span>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" id="cover-upload" accept="image/*" onChange={handleCoverChange} />
                  <button type="button" onClick={() => document.getElementById('cover-upload')?.click()} className="absolute bottom-4 right-4 bg-white text-black p-2 rounded-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload size={16} />
                  </button>
                </div>
              </div>

              {/* Basic Details */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Track Title</label>
                  <input type="text" placeholder="e.g. Midnight Waves" className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white text-lg focus:outline-none focus:border-primary transition-all" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Audio Source</label>
                  <div className="relative border border-border-subtle bg-black/40 rounded-sm p-6 flex flex-col items-center justify-center border-dashed group hover:border-primary transition-all cursor-pointer">
                    <Music size={24} className="text-white/20 group-hover:text-primary mb-2" />
                    <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Upload Master File (WAV/MP3)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Genre / Tag</label>
                <select className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white/70 focus:outline-none focus:border-primary transition-all appearance-none">
                  <option>Ambient</option>
                  <option>Techno</option>
                  <option>House</option>
                  <option>Experimental</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[0.7rem] uppercase tracking-widest font-bold ml-1">Visibility</label>
                <select className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white/70 focus:outline-none focus:border-primary transition-all appearance-none">
                  <option>Exclusive Vault (Members Only)</option>
                  <option>Public Release</option>
                  <option>Private Link Only</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-primary text-white font-bebas tracking-[0.2em] text-xl py-6 rounded-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(255,45,85,0.2)]">
              <Save size={24} /> Finalize Artifact
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
