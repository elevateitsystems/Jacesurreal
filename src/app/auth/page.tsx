"use client";

import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="auth-container min-h-screen flex items-center justify-center px-6 py-10 relative z-10">
      <div className="auth-card w-full max-w-[480px]">
        <div className="auth-header text-center mb-10">
          <Link href="/" className="auth-logo inline-block font-bebas text-2xl tracking-[4px] bg-primary-gradient bg-clip-text text-transparent no-underline mb-6 hover:scale-105 transition-transform">
            DJ SURREAL
          </Link>
          <h1 className="text-3xl font-bold mb-3 text-white">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-white/50 text-[0.95rem] leading-relaxed">
            {mode === "login"
              ? "Enter your credentials to access your studio"
              : "Join the Surreal community today"}
          </p>
        </div>

        <form className="auth-form flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          {mode === "register" && (
            <div className="input-group flex flex-col gap-2.5">
              <label className="flex items-center gap-2 text-[0.85rem] text-white/50 font-medium">
                <User size={16} /> Full Name
              </label>
              <input type="text" placeholder="Jace Surreal" className="bg-white/5 border border-white/10 rounded-sm px-4 py-3.5 text-white text-[0.95rem] transition-all focus:outline-none focus:bg-white/10 focus:border-primary" />
            </div>
          )}

          <div className="input-group flex flex-col gap-2.5">
            <label className="flex items-center gap-2 text-[0.85rem] text-white/50 font-medium">
              <Mail size={16} /> Email Address
            </label>
            <input type="email" placeholder="hello@jacesurreal.com" className="bg-white/5 border border-white/10 rounded-sm px-4 py-3.5 text-white text-[0.95rem] transition-all focus:outline-none focus:bg-white/10 focus:border-primary" />
          </div>

          <div className="input-group flex flex-col gap-2.5">
            <label className="flex items-center gap-2 text-[0.85rem] text-white/50 font-medium">
              <Lock size={16} /> Password
            </label>
            <input type="password" placeholder="••••••••" className="bg-white/5 border border-white/10 rounded-sm px-4 py-3.5 text-white text-[0.95rem] transition-all focus:outline-none focus:bg-white/10 focus:border-primary" />
          </div>

          <button className="submit-btn mt-3 bg-primary-gradient text-white border-none rounded-sm p-4 text-base font-semibold cursor-pointer flex items-center justify-center gap-2.5 transition-all shadow-[0_10px_30px_rgba(255,45,85,0.3)] hover:translate-y-[-2px]">
            {mode === "login" ? "Sign In" : "Register"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-divider my-8 relative text-center flex items-center justify-center">
          <span className="relative bg-[#0d0d12] px-4 text-white/50 text-[0.8rem] uppercase tracking-wider z-10">Or continue with</span>
        </div>
        
        <div className="social-auth-single flex justify-center mt-2">
          <button className="social-btn google-btn w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3.5 text-white text-[0.95rem] font-medium flex items-center justify-center gap-3 transition-all hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="auth-footer mt-8 text-center">
          {mode === "login" ? (
            <p className="text-white/50 text-[0.9rem]">
              Don&apos;t have an account?{" "}
              <button className="bg-none border-none text-primary font-semibold cursor-pointer ml-1 hover:underline" onClick={() => setMode("register")}>Register</button>
            </p>
          ) : (
            <p className="text-white/50 text-[0.9rem]">
              Already have an account?{" "}
              <button className="bg-none border-none text-primary font-semibold cursor-pointer ml-1 hover:underline" onClick={() => setMode("login")}>Sign In</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
