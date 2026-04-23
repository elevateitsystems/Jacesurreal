"use client";

import React, { useState } from 'react';
import { Camera, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  return (
    <main className="min-h-screen bg-black overflow-x-hidden pt-32 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-surface border border-border-subtle p-10 rounded-sm shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary opacity-50" />

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bebas tracking-widest text-white mb-4">JOIN THE INNER CIRCLE</h1>
            <div className="space-y-2 text-white/50 text-sm font-light">
              <p>We keep a small circle for a reason.</p>
              <p>Direct access to sonic artifacts, private events, and curated nights.</p>
              <p className="text-white font-medium mt-4 italic">Not everyone gets in.</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Photo Upload */}
            <div 
              onClick={() => document.getElementById('avatar-upload')?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-sm p-8 hover:bg-surface-hover transition-colors cursor-pointer group"
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-32 h-32 object-cover rounded-sm border border-white/10" />
              ) : (
                <>
                  <ImageIcon size={32} className="text-white/20 mb-2 group-hover:text-white/50 transition-colors" />
                  <span className="text-xs text-white/40 uppercase tracking-widest">Upload Profile Identity</span>
                </>
              )}
              <input 
                type="file" 
                id="avatar-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">First & Last Name</label>
                <input type="text" placeholder="Jace Surreal" className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">IG Handle</label>
                <input type="text" placeholder="@jacesurreal" className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>

              <div className="space-y-1">
                <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">City</label>
                <input type="text" placeholder="New York" className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">Zip Code</label>
                <input type="text" placeholder="10001" className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">Occupation</label>
              <input type="text" placeholder="What do you do?" className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div className="space-y-1">
              <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">Email Address</label>
              <input type="email" placeholder="void@jacesurreal.com" className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>

            <button className="w-full bg-white text-black font-bebas tracking-[0.2em] text-xl py-5 rounded-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 mt-6">
              Request Access <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-border-subtle">
            <p className="text-white/30 text-xs tracking-widest uppercase font-medium">
              Already verified? <Link href="/auth/login" className="text-white hover:text-primary transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
