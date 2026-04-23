"use client";

import Image from "next/image";

export default function DJSection() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
      <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-sm overflow-hidden border border-border-subtle shadow-xl">
        <Image
          src="https://placehold.co/600x600/111111/FFFFFF?text=Jace+Surreal"
          alt="Jace Surreal Placeholder"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      
      <div className="flex-1 text-center md:text-left space-y-4">
        <h1 className="text-6xl md:text-8xl font-bebas tracking-widest text-white">
          JACE SURREAL
        </h1>
        <p className="text-xl text-white/50 font-light tracking-wide max-w-lg">
          Not released. Not streamed. Not for everyone.
          <br />
          If you have this… you’re already inside.
        </p>
        <div className="pt-4 flex items-center justify-center md:justify-start gap-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface border border-border-subtle text-sm text-white/50">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Underground Privé
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface border border-border-subtle text-sm text-white/50">
            The Surrealist Movement
          </span>
        </div>
      </div>
    </div>
  );
}

