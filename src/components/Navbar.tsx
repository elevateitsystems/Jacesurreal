"use client";

import { Key, Menu, Music, Shield, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4 md:px-12 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bebas">
            SURREAL<span className="text-primary">JACE</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8"> 
          <Link
            href="/auth/register"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em]"
          >
            <User size={14} /> Join Circle
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Key size={14} /> Login
          </Link>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Shield size={14} /> Admin
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/5 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-6">
            <Link
              href="/auth/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-white/70 font-bold uppercase tracking-widest text-sm"
            >
              <User size={18} className="text-primary" /> Join Circle
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-white/70 font-bold uppercase tracking-widest text-sm"
            >
              <Music size={18} className="text-primary" /> Member Access
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-white/70 font-bold uppercase tracking-widest text-sm"
            >
              <Shield size={18} className="text-primary" /> Studio Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
