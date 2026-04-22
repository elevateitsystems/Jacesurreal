"use client";

import { useState, useEffect, useRef } from "react";
import {
  Music,
  Play,
  Heart,
  Save,
  ArrowLeft,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import AddMusicForm from "./components/addMusicForm";
import AdminStats from "./components/adminStats";
import MusicTable from "./components/musicTable";

export default function AdminPage() {
  const [tracks, setTracks] = useState([
    { id: 1, title: "Midnight City", plays: 1250, likes: 450 },
    { id: 2, title: "Sonic Boom", plays: 890, likes: 320 },
    { id: 3, title: "Electric Dreams", plays: 2100, likes: 780 },
    { id: 4, title: "Virtual Insanity", plays: 540, likes: 120 },
    { id: 5, title: "Neon Nights", plays: 3200, likes: 1100 },
    { id: 6, title: "Cyberpunk 2077", plays: 15600, likes: 4200 },
    { id: 7, title: "Acid Rain", plays: 430, likes: 88 },
    { id: 8, title: "Deep Sea", plays: 210, likes: 45 },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Last Request Mechanism
  const lastRequestId = useRef(0);

  // Debouncing logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // "Last Request True" Mechanism (Search)
  useEffect(() => {
    const requestId = ++lastRequestId.current;

    const fetchResults = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Only update if this is the latest request
      if (requestId === lastRequestId.current) {
        const results = tracks.filter((t) =>
          t.title.toLowerCase().includes(debouncedQuery.toLowerCase()),
        );
        setFilteredTracks(results);
        setIsLoading(false);
        setCurrentPage(1);
      }
    };

    fetchResults();
  }, [debouncedQuery, tracks]);

  const handleUpdate = (
    id: number,
    field: "plays" | "likes",
    value: string,
  ) => {
    setTracks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, [field]: parseInt(value) || 0 } : t,
      ),
    );
  };

  const totalPages = Math.ceil(filteredTracks.length / itemsPerPage);
  const paginatedTracks = filteredTracks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="admin-container p-32 pt-[120px] pb-[60px] max-w-[1200px] mx-auto relative z-10">
      <div className="admin-header flex justify-between items-center mb-12">
        <div className="admin-header-left flex items-center gap-6">
          <Link
            href="/"
            className="back-btn w-12 h-12 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-white transition-all hover:bg-surface-hover hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-4xl font-bebas tracking-[2px] text-white">
            Admin Studio
          </h1>
        </div>
        <button className="refresh-btn flex items-center gap-3 bg-surface border border-border-subtle px-6 py-3 rounded-xl text-white/50 font-medium cursor-pointer transition-all hover:text-white hover:border-primary">
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Updating..." : "Sync"}
        </button>
      </div>

      <div className="admin-layout grid grid-cols-[400px_1fr] gap-10 items-start max-[1100px]:grid-cols-1">
        <aside className="admin-sidebar flex flex-col gap-8">
          {/* Top: Song Add Form */}
          <AddMusicForm />

          {/* Bottom: Overview Stats */}
          <AdminStats />
        </aside>

        {/* MUSIC TABLE*/}
        <MusicTable
          isLoading={isLoading}
          filteredTracks={filteredTracks}
          setSearchQuery={setSearchQuery}
          handleUpdate={handleUpdate}
          paginatedTracks={paginatedTracks}
          totalPages={totalPages}
          searchQuery={searchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
