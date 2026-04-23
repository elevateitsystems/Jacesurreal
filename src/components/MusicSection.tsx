"use client";

import React from "react";
import TrackCard from "./TrackCard";
import { Track } from "@/lib/mockData";

interface Props {
  tracks: Track[];
  currentPlayingId: string | null;
  isPlaying: boolean;
  currentTime: number;
  onTogglePlay: (track: Track) => void;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  showToast: (title: string, message: string, type?: "success" | "info") => void;
}

export default function MusicSection({
  tracks,
  currentPlayingId,
  isPlaying,
  currentTime,
  onTogglePlay,
  onLike,
  onDislike,
}: Props) {
  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          isPlaying={currentPlayingId === track.id && isPlaying}
          progress={
            currentPlayingId === track.id
              ? (currentTime / (track.duration || 1)) * 100
              : 0
          }
          currentTime={currentPlayingId === track.id ? currentTime : 0}
          onTogglePlay={onTogglePlay}
          onLike={onLike}
          onDislike={onDislike}
        />
      ))}
      {tracks.length === 0 && (
        <div className="text-center py-20 text-white/20 bg-surface/10 rounded-sm border border-white/5 border-dashed">
          <p className="font-bold uppercase tracking-widest text-sm">The archive is empty.</p>
        </div>
      )}
    </div>
  );
}
