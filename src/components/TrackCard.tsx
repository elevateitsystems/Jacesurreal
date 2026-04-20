"use client";

import Image from "next/image";

interface Track {
  id: number;
  title: string;
  src: string;
  duration: number;
  plays: number;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  bpm: number;
  waveform: number[];
  thumbnail?: string;
}

interface TrackCardProps {
  track: Track;
  idx: number;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  onTogglePlay: (track: Track) => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>, trackId: number) => void;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
  onShare: (track: Track) => void;
  formatTime: (seconds: number) => string;
}

export default function TrackCard({
  track,
  idx,
  isPlaying,
  progress,
  currentTime,
  onTogglePlay,
  onSeek,
  onLike,
  onDislike,
  onShare,
  formatTime,
}: TrackCardProps) {
  return (
    <div className={`track-card compact ${isPlaying ? "playing" : ""}`}>
      <div className="track-inner">
        <div className="track-header">
          <div className="play-btn-container">
            <div className="vinyl"></div>
            <button
              className={`play-btn ${isPlaying ? "playing" : ""}`}
              onClick={() => onTogglePlay(track)}
            >
              {isPlaying ? (
                <svg className="pause-icon" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" fill="white" />
                  <rect x="14" y="4" width="4" height="16" fill="white" />
                </svg>
              ) : (
                <svg className="play-icon" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" fill="white" />
                </svg>
              )}
            </button>
          </div>
          
          {/* New Media Thumbnail Section */}
          <div className="track-thumbnail">
             <Image 
                src={track.thumbnail || "/dj.jpg"} 
                alt={track.title} 
                width={60} 
                height={60} 
                className="rounded-lg object-cover"
             />
          </div>

          <div className="track-info">
            <div className="track-number">
              TRACK {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="track-title">{track.title}</div>
            <div className="track-meta">
              <span className="time-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{formatTime(track.duration || 180)}</span>
              </span>
              <span className="bpm-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                {track.bpm} BPM
              </span>
            </div>
          </div>
        </div>

        <div className="waveform-container" onClick={(e) => onSeek(e, track.id)}>
          <div className="waveform">
            {track.waveform.map((h, i) => {
              const barProgress = (i / track.waveform.length) * 100;
              const isPlayed = progress > barProgress;
              return (
                <div
                  key={i}
                  className={`waveform-bar ${isPlayed ? "played" : ""}`}
                  style={{ height: `${h * 100}%`, "--i": i } as any}
                ></div>
              );
            })}
          </div>
          <div className="progress-time">
            <span className="current-time">
              {isPlaying ? formatTime(currentTime) : "0:00"}
            </span>
            <span>{formatTime(track.duration || 180)}</span>
          </div>
        </div>

        <div className="track-stats">
          <div className="stat-group">
            <button className="stat-btn plays-stat">
              <svg viewBox="0 0 24 24" stroke="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span className="plays-count">{track.plays.toLocaleString()}</span>
            </button>
            
            <button
              className={`stat-btn like-btn ${track.liked ? "active" : ""}`}
              onClick={() => onLike(track.id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{track.likes.toLocaleString()}</span>
            </button>
            
            <button
              className={`stat-btn dislike-btn ${track.disliked ? "active" : ""}`}
              onClick={() => onDislike(track.id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
              </svg>
              <span>{track.dislikes.toLocaleString()}</span>
            </button>
          </div>
          
          <button
            className="stat-btn share-btn"
            onClick={() => onShare(track)}
          >
            <svg viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
