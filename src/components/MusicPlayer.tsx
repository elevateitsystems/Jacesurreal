"use client";

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Download } from 'lucide-react';
import { Track } from '@/lib/mockData';

interface MusicPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  onTogglePlay: () => void;
  onSkipNext: () => void;
  onSkipPrev: () => void;
  onLike: () => void;
}

export default function MusicPlayer({ 
  track, 
  isPlaying, 
  currentTime,
  onTogglePlay, 
  onSkipNext, 
  onSkipPrev,
  onLike
}: MusicPlayerProps) {
  if (!track) return null;

  const progress = (currentTime / (track.duration || 1)) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-xl border-t border-white/10 h-24 px-6 py-4 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto h-full flex items-center justify-between gap-8">
        
        {/* Track Info */}
        <div className="flex items-center gap-4 w-[25%] min-w-0">
          <div className="w-14 h-14 rounded-sm bg-surface border border-white/10 overflow-hidden flex-shrink-0">
            <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-medium truncate">{track.title}</h4>
            <p className="text-white/40 text-[0.6rem] uppercase tracking-[0.2em] font-bold">Jace Surreal</p>
          </div>
          <button 
            onClick={onLike}
            className={`transition-colors ml-2 flex-shrink-0 ${track.isLiked ? 'text-primary' : 'text-white/20 hover:text-white'}`}
          >
            <Heart size={18} fill={track.isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Controls & Progress */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl">
          <div className="flex items-center gap-8">
            <button 
              onClick={onSkipPrev}
              className="text-white/40 hover:text-white transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button 
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="translate-x-0.5" />}
            </button>
            <button 
              onClick={onSkipNext}
              className="text-white/40 hover:text-white transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="w-full flex items-center gap-4">
            <span className="text-[0.65rem] font-mono text-white/30 w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden group cursor-pointer relative">
              <div 
                className="h-full bg-primary relative transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-0 group-hover:scale-100 transition-transform" />
              </div>
            </div>
            <span className="text-[0.65rem] font-mono text-white/30 w-10">{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="flex items-center justify-end gap-6 w-[25%]">
          <button className="text-white/40 hover:text-white transition-colors">
            <Download size={18} />
          </button>
          <div className="flex items-center gap-3 w-32 group">
            <Volume2 size={18} className="text-white/40 group-hover:text-white transition-colors" />
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-white/40 w-3/4 group-hover:bg-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
