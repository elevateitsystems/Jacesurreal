"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroCard from "@/components/HeroCard";
import MusicSection from "@/components/MusicSection";
import MusicPlayer from "@/components/MusicPlayer";
import ContactUs from "@/components/ContactUs";
import useToast from "@/lib/useToast";
import { Disc, Search } from "lucide-react";
import { HeroCardSkeleton, MusicCardSkeleton } from "@/components/Skeleton";
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
    
    const handleLoadedMetadata = () => {
      setCurrentTrack(prev => {
        if (prev && !prev.duration && audio.duration) {
          const newDur = audio.duration;
          setTracks(tPrev => tPrev.map(t => t.id === prev.id ? { ...t, duration: newDur } : t));
          return { ...prev, duration: newDur };
        }
        return prev;
      });
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const fetchTracks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/music");
      const data = await response.json();
      
      if (Array.isArray(data)) {
        let likedIds: string[] = [];
        let dislikedIds: string[] = [];
        try {
          likedIds = JSON.parse(localStorage.getItem('jace_liked_tracks') || '[]');
          dislikedIds = JSON.parse(localStorage.getItem('jace_disliked_tracks') || '[]');
        } catch (e) {
          console.error("Error reading localStorage", e);
        }

        const mappedTracks: Track[] = data.map(t => ({
          ...t,
          id: t._id,
          isLiked: likedIds.includes(t._id),
          isDisliked: dislikedIds.includes(t._id),
          duration: t.duration || 0,
          createdAt: t.createdAt || new Date().toISOString(),
          plays: t.plays || 0,
          likes: t.likes || 0,
          dislikes: t.dislikes || 0,
          date: t.date || new Date().toISOString()
        }));
        
        setTracks(mappedTracks);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        // Find tracks that are from today onwards
        const eligibleTracks = mappedTracks.filter(t => new Date(t.date).getTime() >= todayStart.getTime());
        
        if (eligibleTracks.length > 0) {
          // Sort to find the earliest one among them
          const sortedEligible = [...eligibleTracks].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          const nearestDateStr = new Date(sortedEligible[0].date).toDateString();
          
          // Filter to only those on that exact nearest date
          const filteredByNearestDate = mappedTracks.filter(t => 
            new Date(t.date).toDateString() === nearestDateStr
          );
          
          setTracks(filteredByNearestDate);
          if (filteredByNearestDate.length > 0) {
            setCurrentTrack(filteredByNearestDate[0]);
          }
        } else {
          setTracks([]);
          setCurrentTrack(null);
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
        // Fix for first play issue: ensure src is set
        if (!audio.src || audio.src === "" || !audio.src.includes(track.audioUrl)) {
          audio.src = track.audioUrl;
          audio.load();
        }

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

        // Backend sync for play count
        try {
          fetch(`/api/music/${track.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'play' }),
          });
        } catch (err) {
          console.error("Failed to sync play:", err);
        }
      }
    },
    [currentTrack, isPlaying],
  );

  const toggleLike = useCallback(
    async (id: string) => {
      let action = 'like';
      setTracks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const isLiked = !t.isLiked;
            action = isLiked ? 'like' : 'unlike';
            const updatedTrack: Track = {
              ...t,
              isLiked,
              isDisliked: false,
              likes: isLiked ? t.likes + 1 : Math.max(0, t.likes - 1),
            };

            // Sync localStorage
            try {
              const savedLikes = JSON.parse(localStorage.getItem('jace_liked_tracks') || '[]');
              if (isLiked) {
                if (!savedLikes.includes(id)) savedLikes.push(id);
              } else {
                const index = savedLikes.indexOf(id);
                if (index > -1) savedLikes.splice(index, 1);
              }
              localStorage.setItem('jace_liked_tracks', JSON.stringify(savedLikes));
            } catch (e) {
              console.error("LocalStorage error:", e);
            }

            if (currentTrack?.id === id) {
              setCurrentTrack(updatedTrack);
            }
            return updatedTrack;
          }
          return t;
        }),
      );

      // Backend sync
      try {
        await fetch(`/api/music/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
      } catch (err) {
        console.error("Failed to sync like:", err);
      }
    },
    [currentTrack],
  );

  const toggleDislike = useCallback(
    async (id: string) => {
      let action = 'dislike';
      setTracks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const isDisliked = !t.isDisliked;
            action = isDisliked ? 'dislike' : 'undislike';
            const updatedTrack: Track = {
              ...t,
              isDisliked,
              isLiked: false,
              dislikes: isDisliked ? t.dislikes + 1 : Math.max(0, t.dislikes - 1),
              likes: t.isLiked ? Math.max(0, t.likes - 1) : t.likes,
            };

            // Sync localStorage
            try {
              const savedDislikes = JSON.parse(localStorage.getItem('jace_disliked_tracks') || '[]');
              if (isDisliked) {
                if (!savedDislikes.includes(id)) savedDislikes.push(id);
                // Also remove from likes if it was liked
                const savedLikes = JSON.parse(localStorage.getItem('jace_liked_tracks') || '[]');
                const likeIndex = savedLikes.indexOf(id);
                if (likeIndex > -1) {
                  savedLikes.splice(likeIndex, 1);
                  localStorage.setItem('jace_liked_tracks', JSON.stringify(savedLikes));
                }
              } else {
                const index = savedDislikes.indexOf(id);
                if (index > -1) savedDislikes.splice(index, 1);
              }
              localStorage.setItem('jace_disliked_tracks', JSON.stringify(savedDislikes));
            } catch (e) {
              console.error("LocalStorage error:", e);
            }

            if (currentTrack?.id === id) {
              setCurrentTrack(updatedTrack);
            }
            return updatedTrack;
          }
          return t;
        }),
      );

      // Backend sync
      try {
        await fetch(`/api/music/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
      } catch (err) {
        console.error("Failed to sync dislike:", err);
      }
    },
    [currentTrack],
  );

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

  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden font-sans pb-32">
      <Navbar />

      <div className="container mx-auto px-4 md:px-12 pt-32">
        {isLoading ? (
          <div className="flex flex-col lg:flex-row w-full gap-12 lg:gap-20">
            <section className="w-full lg:w-[45%]">
              <div className="h-12 w-48 bg-white/5 animate-pulse mb-8 rounded-sm" />
              <HeroCardSkeleton />
            </section>
            <section className="w-full lg:w-[55%]">
              <div className="h-20 bg-white/5 animate-pulse mb-10 rounded-sm" />
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <MusicCardSkeleton key={i} />
                ))}
              </div>
            </section>
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
        onSeek={handleSeek}
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
