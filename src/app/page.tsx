"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MusicSection from "@/components/MusicSection";
import HeroCard from "@/components/HeroCard";
import MusicPlayer from "@/components/MusicPlayer";
import ContactUs from "@/components/ContactUs";
import useToast from "@/lib/useToast";
import { Disc, Loader2 } from "lucide-react";
import { Track } from "@/lib/mockData";

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { showToast, ToastContainer } = useToast();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchTracks();
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const fetchTracks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/music");
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Map _id to id and provide defaults for missing required fields
        const mappedTracks: Track[] = data.map(t => ({
          ...t,
          id: t._id,
          duration: t.duration || 0,
          createdAt: t.createdAt || new Date().toISOString(),
          plays: t.plays || 0,
          likes: t.likes || 0,
          dislikes: t.dislikes || 0,
          date: t.date || new Date().toISOString()
        }));
        setTracks(mappedTracks);

        const now = new Date().getTime();
        const sorted = [...mappedTracks].sort((a, b) => {
          const distA = Math.abs(new Date(a.date).getTime() - now);
          const distB = Math.abs(new Date(b.date).getTime() - now);
          return distA - distB;
        });

        if (sorted.length > 0) {
          setCurrentTrack(sorted[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching music:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tracks, searchQuery]);

  const togglePlay = useCallback(
    (track: Track) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          audio.play().catch(console.warn);
          setIsPlaying(true);
        }
      } else {
        audio.src = track.audioUrl;
        audio.load();
        audio.play().catch(console.warn);
        setCurrentTrack(track);
        setIsPlaying(true);
        setCurrentTime(0);
        
        setTracks((prev) =>
          prev.map((t) =>
            t.id === track.id ? { ...t, plays: t.plays + 1 } : t,
          ),
        );
      }
    },
    [currentTrack, isPlaying],
  );

  const toggleLike = useCallback(
    (id: string) => {
      setTracks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const isLiked = !t.isLiked;
            const updatedTrack: Track = {
              ...t,
              isLiked,
              isDisliked: false,
              likes: isLiked ? t.likes + 1 : Math.max(0, t.likes - 1),
            };
            if (currentTrack?.id === id) {
              setCurrentTrack(updatedTrack);
            }
            return updatedTrack;
          }
          return t;
        }),
      );
    },
    [currentTrack],
  );

  const toggleDislike = useCallback((id: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isDisliked = !t.isDisliked;
          return {
            ...t,
            isDisliked,
            isLiked: false,
            dislikes: isDisliked ? t.dislikes + 1 : Math.max(0, t.dislikes - 1),
            likes: t.isLiked ? Math.max(0, t.likes - 1) : t.likes,
          };
        }
        return t;
      }),
    );
  }, []);

  const skipTrack = useCallback(
    (direction: "next" | "prev") => {
      if (tracks.length === 0) return;
      const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
      if (currentIndex === -1) return;

      let nextIndex;
      if (direction === "next") {
        nextIndex = (currentIndex + 1) % tracks.length;
      } else {
        nextIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      }

      togglePlay(tracks[nextIndex]);
    },
    [currentTrack, tracks, togglePlay],
  );

  return (
    <main className="min-h-screen bg-black overflow-x-hidden font-sans pb-32">
      <Navbar />

      <div className="container mx-auto px-4 md:px-12 pt-32">
        {isLoading ? (
          <div className="h-[70vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={64} />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row w-full gap-12 lg:gap-20">
            {/* Left Side: Sticky Hero Card */}
            <section className="w-full lg:w-[45%] lg:sticky lg:top-24 lg:h-[calc(100vh-160px)] flex flex-col items-center lg:items-start justify-start">
              <header className="mb-8 text-center lg:text-left w-full">
                <h1 className="text-3xl md:text-5xl font-bebas text-white tracking-widest leading-none mb-2">
                  FEATURED <span className="text-primary">RELEASE</span>
                </h1>
                <p className="text-white/30 text-xs font-bold uppercase tracking-[0.4em]">
                  Upcoming frequency highlight
                </p>
              </header>

              <HeroCard
                track={currentTrack}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onLike={toggleLike}
              />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />
            </section>

            {/* Right Side: Scrollable Vault List */}
            <section className="w-full lg:w-[55%] py-12 lg:py-0">
              <div className="space-y-10">
                <header className="flex items-center justify-between border-b border-white/5 pb-8 sticky top-0 bg-black/80 backdrop-blur-md z-20">
                  <div>
                    <h2 className="text-2xl md:text-4xl font-bebas tracking-widest text-white">
                      THE ARCHIVE
                    </h2>
                    <p className="text-primary text-[0.6rem] uppercase tracking-[0.4em] font-bold mt-1">
                      Full Vault Catalog
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white text-xs font-bold font-mono">
                        {tracks.length}
                      </p>
                      <p className="text-white/20 text-[0.5rem] uppercase tracking-widest font-bold">
                        Artifacts
                      </p>
                    </div>
                    <Disc
                      className={`text-white/10 ${isPlaying ? "animate-spin-slow" : ""}`}
                      size={40}
                    />
                  </div>
                </header>

                <MusicSection
                  tracks={filteredTracks}
                  currentPlayingId={currentTrack?.id || null}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  onTogglePlay={togglePlay}
                  onLike={toggleLike}
                  onDislike={toggleDislike}
                  showToast={showToast}
                />
              </div>
            </section>
          </div>
        )}
      </div>

      <ContactUs />

      <footer className="py-12 border-t border-white/5 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/20 text-[0.6rem] tracking-[0.5em] uppercase font-bold">
            © 2025 JACE SURREAL • SONIC ARCHIVE • CONNECTED TO SUPERPHONE
          </p>
        </div>
      </footer>

      <MusicPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        onTogglePlay={() => currentTrack && togglePlay(currentTrack)}
        onSkipNext={() => skipTrack("next")}
        onSkipPrev={() => skipTrack("prev")}
        onLike={() => currentTrack && toggleLike(currentTrack.id)}
      />

      <ToastContainer />

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
