"use client";

import { Key, Menu, Shield, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (data.authenticated && data.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Auth check failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        setIsAdmin(false);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
          {isAdmin ? (
            <div className="flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em]"
              >
                <Shield size={14} /> Admin
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/30 hover:text-primary transition-colors text-xs font-bold uppercase tracking-[0.2em]"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em]"
            >
              <Key size={14} /> Login
            </Link>
          )}
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
            {isAdmin ? (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-white/70 font-bold uppercase tracking-widest text-sm"
                >
                  <Shield size={18} className="text-primary" /> Studio Admin
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center gap-4 text-white/40 font-bold uppercase tracking-widest text-sm text-left"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-white/70 font-bold uppercase tracking-widest text-sm"
              >
                <Key size={18} className="text-primary" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
