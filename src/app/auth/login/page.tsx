"use client";

import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black overflow-x-hidden pt-32 pb-20">
      <Navbar />

      <div className="container mx-auto px-6 h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-[480px] bg-surface border border-border-subtle p-10 rounded-sm shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary opacity-50" />

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bebas tracking-widest text-white mb-4">
              Admin Login
            </h1>
            <p className="text-white/40 uppercase tracking-widest text-sm font-light">
              Management Portal Access
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-sm tracking-wider uppercase">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="void@jacesurreal.com"
                required
                className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[0.65rem] text-white/40 uppercase tracking-widest font-bold ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black/30 border border-border-subtle rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-white text-black font-bebas tracking-[0.2em] text-xl py-5 rounded-sm hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 mt-6"
            >
              {isLoading ? (
                <>
                  Authenticating <Loader2 className="animate-spin" size={20} />
                </>
              ) : (
                <>
                  Login <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
