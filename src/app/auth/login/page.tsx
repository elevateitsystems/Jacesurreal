"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden pt-32 pb-20">
      <Navbar />

      <div className="container mx-auto px-6 h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-[480px] bg-surface border border-border-subtle p-10 rounded-sm shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary opacity-50" />

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bebas tracking-widest text-white mb-4">
              Login
            </h1>
            <p className="text-white/40 uppercase tracking-widest text-sm font-light">
              Resume your sonic exploration
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1">
              <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="void@jacesurreal.com"
                className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button className="w-full bg-white text-black font-bebas tracking-[0.2em] text-xl py-5 rounded-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 mt-6">
              Enter the Void <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-border-subtle">
            <p className="text-white/30 text-xs tracking-widest uppercase font-medium">
              Not a member?{" "}
              <Link
                href="/auth/register"
                className="text-white hover:text-primary transition-colors"
              >
                Apply for Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
