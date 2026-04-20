"use client";

import { useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import DJSection from "@/components/DJSection";
import MusicSection from "@/components/MusicSection";
import SuperPhone from "@/components/SuperPhone";
import Visualizer from "@/components/Visualizer";
import useToast from "@/lib/useToast";

const initialTracks = [
  {
    id: 1,
    title: "Midnight Frequencies",
    src: "/audio/track1.mp3",
    duration: 0,
    plays: 1247,
    likes: 342,
    dislikes: 12,
    liked: false,
    disliked: false,
    bpm: 128,
    thumbnail: "/dj.jpg",
    waveform: Array.from({ length: 150 }, () => Math.random() * 0.7 + 0.2),
  },
  {
    id: 2,
    title: "Electric Dreams",
    src: "/audio/track1.mp3",
    duration: 0,
    plays: 892,
    likes: 215,
    dislikes: 8,
    liked: false,
    disliked: false,
    bpm: 124,
    thumbnail: "/dj.jpg",
    waveform: Array.from({ length: 150 }, () => Math.random() * 0.7 + 0.2),
  },
  {
    id: 3,
    title: "Neon Pulse",
    src: "/audio/track1.mp3",
    duration: 0,
    plays: 1583,
    likes: 478,
    dislikes: 15,
    liked: false,
    disliked: false,
    bpm: 130,
    thumbnail: "/dj.jpg",
    waveform: Array.from({ length: 150 }, () => Math.random() * 0.7 + 0.2),
  },
];

export default function Home() {
  const [tracks, setTracks] = useState(initialTracks);
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast, ToastContainer } = useToast();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.toLowerCase());
  }, []);

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) =>
      track.title.toLowerCase().includes(searchQuery),
    );
  }, [tracks, searchQuery]);

  const totalPlays = useMemo(
    () => tracks.reduce((s, t) => s + t.plays, 0).toLocaleString(),
    [tracks],
  );
  const totalLikes = useMemo(
    () => tracks.reduce((s, t) => s + t.likes, 0).toLocaleString(),
    [tracks],
  );

  return (
    <>
      <div className="container">
        <Header onSearch={handleSearch} />

        <div className="main-content">
          <DJSection totalPlays={totalPlays} totalLikes={totalLikes} />
          <MusicSection
            tracks={filteredTracks}
            allTracks={tracks}
            setTracks={setTracks}
            currentPlayingId={currentPlayingId}
            setCurrentPlayingId={setCurrentPlayingId}
            showToast={showToast}
          />
        </div>

        <SuperPhone />

        <footer>
          <div className="social-links">
            <a className="social-link" href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a className="social-link" href="#" aria-label="Twitter/X">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a className="social-link" href="#" aria-label="Spotify">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
            <a className="social-link" href="#" aria-label="SoundCloud">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.084-.1zm-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.226-1.308-.226-1.332c-.01-.057-.045-.094-.078-.094zm1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.104.106.104.061 0 .12-.044.12-.104l.24-2.458-.24-2.563c0-.061-.06-.104-.121-.104zm.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.138l.225-2.544-.225-2.64c-.015-.075-.06-.135-.135-.135l-.031-.001zm.96-.106c-.09 0-.149.075-.149.165l-.18 2.73.18 2.58c0 .09.06.164.149.164s.149-.074.165-.164l.21-2.58-.225-2.73c-.016-.09-.075-.165-.15-.165zm.989-.075c-.104 0-.179.09-.179.194l-.165 2.79.165 2.579c0 .104.075.18.179.18.105 0 .179-.076.195-.18l.18-2.579-.195-2.79c-.015-.104-.089-.194-.18-.194zm1.02-.045c-.12 0-.194.089-.21.209l-.149 2.82.149 2.549c.016.12.09.209.21.209.12 0 .194-.089.21-.209l.165-2.549-.165-2.82c-.016-.12-.09-.209-.21-.209zm1.005-.03c-.135 0-.224.105-.224.24l-.135 2.834.135 2.52c0 .149.089.254.224.254.134 0 .224-.105.239-.254l.15-2.52-.15-2.834c-.015-.135-.104-.24-.239-.24zm1.021.001c-.15 0-.239.12-.254.255l-.12 2.819.12 2.504c.016.135.105.255.255.255.15 0 .24-.12.255-.255l.135-2.504-.135-2.819c-.015-.135-.105-.255-.256-.255zm1.004.058c-.15 0-.254.12-.254.27l-.12 2.759.12 2.459c0 .164.104.284.254.284.149 0 .254-.12.269-.284l.135-2.459-.135-2.759c-.016-.15-.12-.27-.269-.27zm1.006.016c-.165 0-.284.135-.284.285l-.105 2.73.105 2.43c0 .165.119.3.284.3.166 0 .285-.135.3-.3l.12-2.43-.12-2.73c-.015-.15-.135-.285-.3-.285zm1.004.031c-.18 0-.3.149-.3.314l-.09 2.684.09 2.399c0 .18.12.315.3.315.18 0 .3-.135.315-.315l.105-2.399-.105-2.684c-.015-.165-.135-.314-.315-.314zm3.645-.584c-.27 0-.524.044-.765.134a4.62 4.62 0 00-4.595-4.185 4.64 4.64 0 00-1.725.329c-.165.06-.255.15-.255.3v8.433c0 .165.12.3.285.314h7.05a2.707 2.707 0 002.7-2.7 2.7 2.7 0 00-2.695-2.625z" />
              </svg>
            </a>
            <a className="social-link" href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
          <p className="footer-text">
            © 2025 DJ Surreal. All rights reserved. Powered by{" "}
            <a href="#">SuperPhone</a>
          </p>
        </footer>
      </div>
      <Visualizer isActive={!!currentPlayingId} />
      <ToastContainer />
    </>
  );
}
