"use client";

import { Track } from "@/lib/mockData";

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
        isPlaying ? "border-primary shadow-[0_0_15px_rgba(255,45,85,0.15)]" : "border-border-subtle"
      } transition-all duration-300 p-4 hover:border-white/20`}
    >
      {/* Background highlight when playing */}
      {isPlaying && (
        <div className="absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-300" />
      )}

      <div className="relative z-10 flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={() => onTogglePlay(track)}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* Track Info & Progress */}
        <div className="flex-grow">
          <h3 className="text-white font-medium text-lg truncate">{track.title}</h3>
          
          <div className="flex items-center justify-between text-zinc-400 text-sm mt-2 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>

          {/* Simple Progress Bar */}
          <div className="w-full h-1 bg-surface-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 relative z-10">
        <div className="text-zinc-500 text-sm flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {track.plays.toLocaleString()}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(track.id)}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-sm">{track.likes}</span>
          </button>
          
          <button
            onClick={() => onDislike(track.id)}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            </svg>
            <span className="text-sm">{track.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
