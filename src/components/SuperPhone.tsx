"use client";

import { useState } from "react";
import { Sparkles, Image as ImageIcon } from "lucide-react";

export default function SuperPhone() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulate API call for mock data
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  if (status === "success") {
    return (
      <section className="max-w-2xl mx-auto my-20 p-8 rounded-sm bg-surface border border-border-subtle text-center">
        <Sparkles className="w-12 h-12 text-white/50 mx-auto mb-4" />
        <h2 className="text-3xl font-bebas tracking-widest text-white mb-2">Request Received</h2>
        <p className="text-white/50 font-light">
          We will review your application. If selected, you will receive an invite within 24 hours.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto my-20">
      <div className="rounded-sm bg-surface border border-border-subtle p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-light to-primary opacity-50" />
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bebas text-white mb-4 tracking-widest">JOIN THE INNER CIRCLE</h2>
          <div className="space-y-2 text-white/50 text-sm font-light">
            <p>We keep a small circle for a reason.</p>
            <p>Direct access to Broome St, Montauk Project, private events, priority tables, and curated nights.</p>
            <p className="text-white font-medium mt-4">Not everyone gets in fr.</p>
            <p>If you feel like you should be part of it, request membership below.</p>
            <p className="text-primary text-xs tracking-widest uppercase mt-4">Invite expires in 24 hours.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Upload Placeholder */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-sm p-6 hover:bg-surface-hover transition-colors cursor-pointer group">
            <ImageIcon className="w-8 h-8 text-white/50 mb-2 group-hover:text-white/80 transition-colors" />
            <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">Upload Photo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs text-white/50 uppercase tracking-wider">First & Last Name</label>
              <input 
                required 
                className="w-full bg-black/30 border border-border-subtle rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="John Doe" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-white/50 uppercase tracking-wider">IG Handle</label>
              <input 
                required 
                className="w-full bg-black/30 border border-border-subtle rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="@username" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs text-white/50 uppercase tracking-wider">City</label>
              <input 
                required 
                className="w-full bg-black/30 border border-border-subtle rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="New York" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-white/50 uppercase tracking-wider">Zip Code</label>
              <input 
                required 
                className="w-full bg-black/30 border border-border-subtle rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="10001" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-white/50 uppercase tracking-wider">Occupation</label>
            <input 
              required 
              className="w-full bg-black/30 border border-border-subtle rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="What do you do?" 
            />
          </div>

          <button 
            type="submit" 
            disabled={status === "submitting"}
            className="w-full bg-white text-black font-bold tracking-wider rounded-sm py-4 mt-4 hover:bg-white/80 transition-colors disabled:opacity-50"
          >
            {status === "submitting" ? "PROCESSING..." : "REQUEST ACCESS"}
          </button>
        </form>
      </div>
    </section>
  );
}
