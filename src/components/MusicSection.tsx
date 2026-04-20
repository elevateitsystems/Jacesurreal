"use client";

import { useState, useRef, useEffect } from "react";
import TrackCard from "./TrackCard";

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
}

interface Props {
  tracks: Track[];
  allTracks: Track[];
  setTracks: (tracks: Track[] | ((prev: Track[]) => Track[])) => void;
  currentPlayingId: number | null;
  setCurrentPlayingId: (id: number | null) => void;
  showToast: (
    title: string,
    message: string,
    type?: "success" | "info",
  ) => void;
}

export default function MusicSection({
  tracks,
  allTracks,
  setTracks,
  currentPlayingId,
  setCurrentPlayingId,
  showToast,
}: Props) {
  const [view, setView] = useState("list");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      const trackIdx = allTracks.findIndex(
        (t) => t.src === audio.getAttribute("src"),
      );
      if (trackIdx !== -1) {
        setTracks((prev) =>
          prev.map((t, idx) =>
            idx === trackIdx ? { ...t, duration: audio.duration } : t,
          ),
        );
      }
    };

    const handleEnded = () => {
      setCurrentPlayingId(null);
      setCurrentTime(0);
      showToast("Playback Finished", "Track ended", "info");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [allTracks, setTracks, setCurrentPlayingId, showToast]);

  const togglePlay = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentPlayingId === track.id) {
      audio.pause();
      setCurrentPlayingId(null);
    } else {
      if (audio.getAttribute("src") !== track.src) {
        audio.src = track.src;
        audio.load();
      }
      audio.play().catch((err) => console.warn("Playback failed", err));
      setCurrentPlayingId(track.id);
      showToast("Now Playing", track.title, "info");

      setTracks((prev) =>
        prev.map((t) => (t.id === track.id ? { ...t, plays: t.plays + 1 } : t)),
      );
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>, trackId: number) => {
    if (
      currentPlayingId !== trackId ||
      !audioRef.current ||
      isNaN(audioRef.current.duration)
    )
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleLike = (id: number) => {
    const track = allTracks.find((t) => t.id === id);
    if (!track) return;

    const newLiked = !track.liked;
    if (newLiked) showToast("Liked!", track.title, "success");

    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            liked: newLiked,
            likes: newLiked ? t.likes + 1 : t.likes - 1,
            disliked: false,
            dislikes: t.disliked ? t.dislikes - 1 : t.dislikes,
          };
        }
        return t;
      }),
    );
  };

  const toggleDislike = (id: number) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newDisliked = !t.disliked;
          return {
            ...t,
            disliked: newDisliked,
            dislikes: newDisliked ? t.dislikes + 1 : t.dislikes - 1,
            liked: false,
            likes: t.liked ? t.likes - 1 : t.likes,
          };
        }
        return t;
      }),
    );
  };

  const shareTrack = (track: Track) => {
    if (navigator.share) {
      navigator.share({
        title: `${track.title} by DJ Surreal`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.host);
      showToast("Link Copied!", "Share with friends", "success");
    }
  };

  return (
    <div className="music-section">
      {/* New Hero Image on the Right */}

      <div className="section-header mt-8">
        <h2 className="section-title">
          <span className="live-dot"></span>Latest Tracks
        </h2>
        <div className="view-toggle">
          <button
            className={`view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button
            className={`view-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
        </div>
      </div>

      <div
        className={`tracks-container ${view === "grid" ? "grid-view" : ""}`}
        id="tracksContainer"
      >
        {tracks.map((track, idx) => (
          <TrackCard
            key={track.id}
            track={track}
            idx={idx}
            isPlaying={currentPlayingId === track.id}
            progress={
              currentPlayingId === track.id
                ? (currentTime / (track.duration || 1)) * 100
                : 0
            }
            currentTime={currentTime}
            onTogglePlay={togglePlay}
            onSeek={handleSeek}
            onLike={toggleLike}
            onDislike={toggleDislike}
            onShare={shareTrack}
            formatTime={formatTime}
          />
        ))}
        {tracks.length === 0 && (
          <div className="no-results">
            <p>No tracks found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
