"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Music, Users, ArrowLeft, LogOut, Loader2 } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const links = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/vault", icon: Music, label: "Vault Management" },
    { href: "/admin/members", icon: Users, label: "Members" },
    { href: "/admin/profile", icon: Users, label: "Profile" },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/");
        router.refresh(); // Clear any cached segments
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-72 bg-surface/50 backdrop-blur-xl border-r border-border-subtle flex flex-col fixed left-0 top-0 bottom-0 z-40">
      <div className="p-8 border-b border-border-subtle">
        <Link
          href="/"
          className="font-bebas text-2xl tracking-[4px] text-white flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} /> STUDIO
        </Link>
      </div>

      <nav className="flex-1 p-6 flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-4 rounded-sm transition-all group ${
                isActive
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(255,45,85,0.2)]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "text-white"
                    : "text-white/40 group-hover:text-primary transition-colors"
                }
              />
              <span className="font-bebas tracking-widest text-lg">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border-subtle">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-4 px-4 py-4 text-white/40 hover:text-white hover:bg-white/5 rounded-sm transition-all group disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <LogOut
              size={20}
              className="group-hover:text-primary transition-colors"
            />
          )}
          <span className="font-bebas tracking-widest text-lg">Log out</span>
        </button>
      </div>
    </aside>
  );
}
