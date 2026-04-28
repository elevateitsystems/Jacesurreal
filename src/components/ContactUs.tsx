"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Loader2, Phone, User, Mail } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", email: "" });
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to submit.");
        setStatus("error");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section id="contact" className="py-24 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto bg-surface border border-primary/20 p-12 rounded-sm">
            <CheckCircle2 size={64} className="text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bebas tracking-widest text-white mb-4">TRANSMISSION RECEIVED</h2>
            <p className="text-white/40 uppercase tracking-[0.2em] text-sm">You've been added to the frequency. Expect a signal soon.</p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-8 text-primary font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
            >
              Send another message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 border-t border-white/5 bg-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-6xl font-bebas tracking-[0.2em] text-white mb-6">
              CONNECT WITH <span className="text-primary">THE VOID</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-lg">
              Join the inner circle for exclusive unreleased frequencies, private event coordinates, and direct communication from the studio.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white/60">
                <div className="w-10 h-10 rounded-sm bg-surface flex items-center justify-center border border-white/5">
                  <Phone size={18} className="text-primary" />
                </div>
                <span className="uppercase tracking-widest text-sm font-bold">Direct SMS Updates</span>
              </div>
              <div className="flex items-center gap-4 text-white/60">
                <div className="w-10 h-10 rounded-sm bg-surface flex items-center justify-center border border-white/5">
                  <Mail size={18} className="text-primary" />
                </div>
                <span className="uppercase tracking-widest text-sm font-bold">Private Frequency List</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-white/5 p-10 rounded-sm relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-30" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[0.65rem] py-3 px-4 rounded-sm tracking-widest uppercase font-bold">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-sm py-4 pl-12 pr-6 text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">Phone Number (Required)</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="tel" 
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-sm py-4 pl-12 pr-6 text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="email" 
                    placeholder="void@jacesurreal.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-sm py-4 pl-12 pr-6 text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button 
                disabled={status === "loading"}
                className="w-full bg-white text-black font-bebas tracking-[0.3em] text-xl py-5 rounded-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 mt-8 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>SUBMIT SIGNAL <Send size={20} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
