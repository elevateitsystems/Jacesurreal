"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import AddMusicForm from "./components/addMusicForm";
import AdminStats from "./components/adminStats";
import MusicTable from "./components/musicTable";
import { mockTracks, mockStats, Track } from "@/lib/mockData";

export default function AdminPage() {
  const [tracks, setTracks] = useState<Track[]>(mockTracks);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const lastRequestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const requestId = ++lastRequestId.current;

    const fetchResults = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

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
    id: string,
    field: "plays" | "likes" | "dislikes",
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
    <div className="min-h-screen bg-dark pt-24 pb-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="w-12 h-12 rounded-sm bg-surface border border-border-subtle flex items-center justify-center text-white transition-all hover:bg-surface-hover hover:-translate-x-1"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-bebas tracking-widest text-white">
              ADMIN STUDIO
            </h1>
          </div>
          <button className="flex items-center gap-3 bg-surface border border-border-subtle px-6 py-3 rounded-sm text-white/50 text-sm font-medium cursor-pointer transition-all hover:text-white hover:bg-surface-hover">
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "SYNCING..." : "SYNC DATABASE"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">
          <aside className="flex flex-col gap-8">
            <AddMusicForm />
            <AdminStats stats={mockStats} />
          </aside>

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
    </div>
  );
}
