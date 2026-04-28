"use client";

import { Track } from "@/lib/mockData";
import { Play, Pause, Heart, ThumbsDown } from "lucide-react";

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  progress: number; // 0 to 100
  currentTime: number; // in seconds
  onTogglePlay: (track: Track) => void;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
}

export default function TrackCard({
  track,
  isPlaying,
  progress,
  currentTime,
  onTogglePlay,
  onLike,
  onDislike,
}: TrackCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`relative rounded-sm overflow-hidden bg-surface border ${
        isPlaying ? "border-primary shadow-[0_0_15px_rgba(255,45,85,0.15)]" : "border-white/5"
      } transition-all duration-300 p-4 hover:border-white/20 cursor-pointer`}
      onClick={() => onTogglePlay(track)}
    >
      <div className="relative z-10 flex items-center gap-4">
        {/* Thumbnail & Play Overlay */}
        <div className="relative w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 border border-white/10 group">
          <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="translate-x-0.5" />}
          </div>
        </div>

        {/* Track Info & Progress */}
        <div className="flex-grow">
          <h3 className="text-white font-medium text-sm md:text-base truncate">{track.title}</h3>
          
          <div className="flex items-center justify-between text-white/30 text-[0.6rem] uppercase tracking-widest font-mono mt-1 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(track.duration || 0)}</span>
          </div>

          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-4 text-white/20 text-[0.65rem] font-bold uppercase tracking-widest">
           <div className="flex items-center gap-1">
             <Play size={10} className="text-primary" /> {track.plays.toLocaleString()}
           </div>
           <div className="flex items-center gap-1">
             <Heart size={10} fill={track.isLiked ? "currentColor" : "none"} className={track.isLiked ? 'text-primary' : ''} /> {track.likes.toLocaleString()}
           </div>
        </div>
      </div>
    </div>
  );
}
