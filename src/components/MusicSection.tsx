"use client";

import { useState, useRef, useEffect } from "react";
import TrackCard from "./TrackCard";
import { Track } from "@/lib/mockData";

interface Props {
  tracks: Track[];
  allTracks: Track[];
  setTracks: (tracks: Track[] | ((prev: Track[]) => Track[])) => void;
  currentPlayingId: string | null;
  setCurrentPlayingId: (id: string | null) => void;
  showToast: (title: string, message: string, type?: "success" | "info") => void;
}

export default function MusicSection({
  tracks,
  allTracks,
  setTracks,
  currentPlayingId,
  setCurrentPlayingId,
  showToast,
}: Props) {
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

    const handleEnded = () => {
      setCurrentPlayingId(null);
      setCurrentTime(0);
      showToast("Playback Finished", "Track ended", "info");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setCurrentPlayingId, showToast]);

  const togglePlay = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentPlayingId === track.id) {
      audio.pause();
      setCurrentPlayingId(null);
    } else {
      if (audio.getAttribute("src") !== track.audioUrl) {
        audio.src = track.audioUrl;
        audio.load();
      }
      audio.play().catch((err) => console.warn("Playback failed", err));
      setCurrentPlayingId(track.id);
      showToast("Now Playing", track.title, "info");

      // Increment play count locally
      setTracks((prev) =>
        prev.map((t) => (t.id === track.id ? { ...t, plays: t.plays + 1 } : t)),
      );
    }
  };

  const toggleLike = (id: string) => {
    const track = allTracks.find((t) => t.id === id);
    if (!track) return;
    
    showToast("Liked!", track.title, "success");

    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, likes: t.likes + 1 };
        }
        return t;
      }),
    );
  };

  const toggleDislike = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, dislikes: t.dislikes + 1 };
        }
        return t;
      }),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <h2 className="text-4xl font-bebas tracking-widest text-white flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
          Exclusive Vault
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            isPlaying={currentPlayingId === track.id}
            progress={
              currentPlayingId === track.id
                ? (currentTime / (track.duration || 1)) * 100
                : 0
            }
            currentTime={currentPlayingId === track.id ? currentTime : 0}
            onTogglePlay={togglePlay}
            onLike={toggleLike}
            onDislike={toggleDislike}
          />
        ))}
        {tracks.length === 0 && (
          <div className="text-center py-12 text-white/50 bg-surface rounded-sm border border-border-subtle">
            <p>No tracks found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
