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
          <div className="admin-card track-creator bg-[#0a0a0f]/60 backdrop-blur-[20px] border border-white/5 rounded-[24px] p-8">
            <div className="card-header mb-8">
              <h2 className="text-xl mb-1 text-white">New Track</h2>
              <p className="text-white/50 text-[0.95rem]">Add to library</p>
            </div>
            <form
              className="admin-create-form flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="input-group-admin flex flex-col gap-2">
                <label className="text-[0.75rem] text-white/50 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Track Name"
                  className="bg-black/30 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="input-group-admin flex flex-col gap-2">
                  <label className="text-[0.75rem] text-white/50 uppercase tracking-wider">
                    Plays
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="bg-black/30 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="input-group-admin flex flex-col gap-2">
                  <label className="text-[0.75rem] text-white/50 uppercase tracking-wider">
                    Likes
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="bg-black/30 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
              <button className="create-track-btn mt-2 bg-primary-gradient text-white rounded-xl p-4 font-semibold flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_15px_rgba(255,45,85,0.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,45,85,0.3)]">
                <Music size={18} /> Publish
              </button>
            </form>
          </div>

          {/* Bottom: Overview Stats */}
          <div className="admin-card stats-overview bg-[#0a0a0f]/60 backdrop-blur-[20px] border border-white/5 rounded-[24px] p-8">
            <h2 className="text-xl mb-6 text-white text-center">Overview</h2>
            <div className="mini-stats flex flex-col gap-5">
              <div className="mini-stat bg-white/3 p-5 rounded-2xl flex flex-col gap-1">
                <span className="label text-[0.8rem] text-white/50 uppercase tracking-widest">
                  Total Plays
                </span>
                <span className="value text-3xl font-bold text-primary">
                  23.5K
                </span>
              </div>
              <div className="mini-stat bg-white/3 p-5 rounded-2xl flex flex-col gap-1">
                <span className="label text-[0.8rem] text-white/50 uppercase tracking-widest">
                  Total Likes
                </span>
                <span className="value text-3xl font-bold text-primary">
                  6.8K
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="admin-content min-h-[700px]">
          <div className="admin-card track-editor full-height bg-[#0a0a0f]/60 backdrop-blur-[20px] border border-white/5 rounded-[24px] p-8 flex flex-col">
            <div className="content-header-row flex justify-between items-center mb-8 pb-6 border-b border-white/5">
              <div className="card-header">
                <h2 className="text-xl mb-1 text-white">Manage Catalog</h2>
                <p className="text-white/50 text-[0.95rem]">
                  {isLoading
                    ? "Searching..."
                    : `${filteredTracks.length} tracks found`}
                </p>
              </div>
              <div className="admin-search-wrapper relative w-[300px]">
                {isLoading ? (
                  <Loader2
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 animate-spin"
                  />
                ) : (
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
                  />
                )}
                <input
                  type="text"
                  placeholder="Filter tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/3 border border-white/1 px-4 py-3 pl-12 rounded-xl text-white text-[0.9rem] focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(255,45,85,0.1)] transition-all"
                />
              </div>
            </div>

            <div
              className={`track-list-admin scrollable flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-2.5 ${isLoading ? "opacity-50" : ""}`}
            >
              {paginatedTracks.map((track) => (
                <div
                  key={track.id}
                  className="admin-track-item flex justify-between items-center bg-white/2 p-6 rounded-2xl border border-transparent transition-all hover:bg-white/4 hover:border-white/10"
                >
                  <div className="track-info-simple flex items-center gap-5">
                    <div className="track-icon w-11 h-11 bg-primary-gradient rounded-xl flex items-center justify-center text-white">
                      <Music size={20} />
                    </div>
                    <div>
                      <h3 className="text-[1.1rem] font-semibold text-white">
                        {track.title}
                      </h3>
                      <span className="track-id text-[0.75rem] text-white/50 font-mono">
                        ID: #{track.id}
                      </span>
                    </div>
                  </div>

                  <div className="track-inputs flex items-end gap-5">
                    <div className="input-field-admin flex flex-col gap-2">
                      <label className="flex items-center gap-1.5 text-[0.75rem] text-white/50 uppercase">
                        <Play size={12} /> Plays
                      </label>
                      <input
                        type="number"
                        value={track.plays}
                        onChange={(e) =>
                          handleUpdate(track.id, "plays", e.target.value)
                        }
                        className="bg-black/30 border border-white/10 text-white px-4 py-2.5 rounded-lg w-24 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="input-field-admin flex flex-col gap-2">
                      <label className="flex items-center gap-1.5 text-[0.75rem] text-white/50 uppercase">
                        <Heart size={12} /> Likes
                      </label>
                      <input
                        type="number"
                        value={track.likes}
                        onChange={(e) =>
                          handleUpdate(track.id, "likes", e.target.value)
                        }
                        className="bg-black/30 border border-white/10 text-white px-4 py-2.5 rounded-lg w-24 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <button
                      className="save-track-btn w-[42px] h-[42px] rounded-lg bg-surface border border-border-subtle text-white/50 flex items-center justify-center cursor-pointer transition-all hover:bg-primary hover:text-white hover:border-primary hover:scale-105"
                      title="Save Changes"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {!isLoading && filteredTracks.length === 0 && (
                <div className="empty-state text-center py-16 text-white/50">
                  <p>No tracks found matching your search.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="admin-pagination mt-8 flex justify-center items-center gap-5">
                <button
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="page-btn bg-surface border border-border-subtle text-white px-4 py-2 rounded-lg text-[0.85rem] cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-surface-hover hover:not-disabled:border-primary"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <div className="page-numbers flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`page-number w-9 h-9 flex items-center justify-center rounded-lg bg-surface border border-border-subtle text-white/50 text-[0.9rem] cursor-pointer transition-all disabled:opacity-30 ${currentPage === i + 1 ? "active !bg-primary !border-primary !text-white shadow-[0_4px_15px_rgba(255,45,85,0.3)]" : ""}`}
                      disabled={isLoading}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages || isLoading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="page-btn bg-surface border border-border-subtle text-white px-4 py-2 rounded-lg text-[0.85rem] cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-surface-hover hover:not-disabled:border-primary"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
