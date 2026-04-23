"use client";

import { Track } from "@/lib/mockData";
import { Play, Pause, Heart, Users, Activity } from "lucide-react";

interface HeroCardProps {
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: (track: Track) => void;
  onLike: (id: string) => void;
}

export default function HeroCard({
  track,
  isPlaying,
  onTogglePlay,
}: HeroCardProps) {
  if (!track) return null;

  return (
    <div
      className={`group relative w-full aspect-[3/4] max-w-[420px] rounded-3xl overflow-hidden bg-[#050505] border ${
        isPlaying ? "border-primary/40 shadow-[0_0_50px_rgba(255,45,85,0.1)]" : "border-white/5"
      } transition-all duration-700 animate-in fade-in slide-in-from-left duration-700`}
    >
      {/* Large Background Title (Placeholder style) */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
        <span className="text-[12rem] font-bebas text-white/[0.03] leading-none whitespace-nowrap uppercase tracking-tighter transform -rotate-12">
          {track.title.split(' ')[track.title.split(' ').length - 1]}
        </span>
      </div>

      {/* Rhythmic Background Effect when playing */}
      {isPlaying && (
        <div className="absolute inset-0 bg-primary/[0.02] animate-pulse" />
      )}

      {/* Visualizer Effect when playing (Top Right) */}
      {isPlaying && (
        <div className="absolute top-10 right-10 flex items-end gap-1.5 h-10">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-1.5 bg-primary rounded-full"
              style={{ 
                height: '100%',
                animation: `pulse 0.6s ease-in-out infinite alternate ${i * 0.12}s` 
              }}
            />
          ))}
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-10 space-y-8 z-10">
        <div className="space-y-4">
          {isPlaying && (
            <div className="flex items-center gap-3 text-primary font-bold text-[0.7rem] uppercase tracking-[0.4em] animate-pulse">
              <Activity size={16} /> ANALYZING FREQUENCY
            </div>
          )}
          <h2 className="text-6xl font-bebas text-white tracking-widest leading-none">
            {track.title}
          </h2>
          <p className="text-white/30 text-sm font-light tracking-wide italic max-w-xs">
            "Authorized fragment from the Montauk Project archive."
          </p>
        </div>

        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-8 text-white/40 text-[0.7rem] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2.5">
              <Users size={18} className="text-primary/70" />
              <span className="font-mono">{track.plays.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Heart size={18} fill={track.isLiked ? "currentColor" : "none"} className={track.isLiked ? 'text-primary' : ''} />
              <span className="font-mono">{track.likes.toLocaleString()}</span>
            </div>
          </div>
          
          <button 
            onClick={() => onTogglePlay(track)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl ${
              isPlaying ? 'bg-primary text-white scale-110 shadow-primary/20' : 'bg-white text-black hover:scale-110'
            }`}
          >
            {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="black" className="translate-x-0.5" />}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          from { height: 20%; }
          to { height: 100%; }
        }
      `}</style>
    </div>
  );
}
