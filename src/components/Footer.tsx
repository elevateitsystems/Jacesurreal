"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 pt-12 border-t border-[var(--border)] text-center">
      <div className="flex justify-center gap-8 text-[0.65rem] uppercase tracking-[0.2em] font-bold">
        <Link
          href="/terms"
          className="text-primary hover:text-white transition-colors duration-300"
        >
          Terms of Service
        </Link>
        <Link
          href="/privacy"
          className="text-[var(--text-muted)] hover:text-white transition-colors duration-300"
        >
          Privacy Policy
        </Link>
      </div>

      <p className="text-white/40 text-[0.85rem] mt-2">
        © 2026 JACE SURREAL • SONIC ARCHIVE • CONNECTED TO SUPERPHONE
      </p>
    </footer>
  );
}
