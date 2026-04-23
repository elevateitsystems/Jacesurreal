"use client";

import { useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import DJSection from "@/components/DJSection";
import MusicSection from "@/components/MusicSection";
import SuperPhone from "@/components/SuperPhone";
import useToast from "@/lib/useToast";
import { mockTracks } from "@/lib/mockData";

export default function Home() {
  const [tracks, setTracks] = useState(mockTracks);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
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

  return (
    <>
      <div className="container mx-auto px-4 max-w-5xl">
        <Header onSearch={handleSearch} />

        <div className="main-content py-12">
          <DJSection />
          <MusicSection
            tracks={filteredTracks}
            allTracks={tracks}
            setTracks={setTracks as any}
            currentPlayingId={currentPlayingId as any}
            setCurrentPlayingId={setCurrentPlayingId as any}
            showToast={showToast}
          />
        </div>

        <SuperPhone />

        <footer className="py-8 mt-12 border-t border-border-subtle text-center">
          <p className="text-white/50 text-sm">
            © 2025 DJ Surreal. All rights reserved. Powered by{" "}
            <a href="#" className="text-white hover:underline">SuperPhone</a>
          </p>
        </footer>
      </div>
      <ToastContainer />
    </>
  );
}
