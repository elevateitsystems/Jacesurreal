import React from "react";
import {
  Play,
  Heart,
  Music,
  Save,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
} from "lucide-react";
import { Track } from "@/lib/mockData";

interface MusicTableProps {
  isLoading?: boolean;
  filteredTracks?: Track[];
  setSearchQuery?: (query: string) => void;
  handleUpdate?: (id: string, field: "plays" | "likes" | "dislikes", value: string) => void;
  paginatedTracks?: Track[];
  totalPages?: number;
  searchQuery?: string;
  currentPage?: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function MusicTable({
  isLoading,
  filteredTracks,
  setSearchQuery,
  handleUpdate,
  paginatedTracks,
  totalPages,
  searchQuery,
  currentPage,
  setCurrentPage,
}: MusicTableProps) {
  return (
    <main className="admin-content min-h-[700px]">
      <div className="admin-card track-editor full-height bg-surface border border-border-subtle rounded-sm p-8 flex flex-col">
        <div className="content-header-row flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-border-subtle">
          <div className="card-header">
            <h2 className="text-3xl mb-1 text-white font-bebas tracking-widest">Manage Catalog</h2>
            <p className="text-white/50 text-sm">
              {isLoading
                ? "Searching..."
                : `${filteredTracks?.length} tracks found`}
            </p>
          </div>
          <div className="admin-search-wrapper relative w-full sm:w-[300px]">
            <Search size={20} className="absolute left-3 top-3 text-white/50" />
            <input
              type="text"
              placeholder="Filter tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-border-subtle px-10 py-3 rounded-sm text-white text-[0.9rem] focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* track list */}
        <div
          className={`track-list-admin scrollable flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-2.5 ${isLoading ? "opacity-50" : ""}`}
        >
          {paginatedTracks?.map((track) => (
            <div
              key={track.id}
              className="admin-track-item flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-black/30 p-6 rounded-sm border border-border-subtle transition-all hover:border-white/20"
            >
              <div className="track-info-simple flex items-center gap-5">
                <div className="track-icon w-12 h-12 bg-surface border border-border-subtle rounded-sm flex items-center justify-center overflow-hidden">
                  {track.coverArt && track.coverArt.trim() !== "" && track.coverArt !== "/images/default-cover.jpg" ? (
                    <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="text-white/20" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-[1.1rem] font-medium text-white truncate max-w-[200px]">
                    {track.title}
                  </h3>
                  <span className="track-id text-xs text-white/50 font-mono">
                    ID: {track.id}
                  </span>
                </div>
              </div>

              <div className="track-inputs flex flex-wrap items-end gap-4 w-full lg:w-auto">
                <div className="input-field-admin flex flex-col gap-2 flex-1 min-w-[100px]">
                  <label className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-wider">
                    <Play size={12} /> Plays
                  </label>
                  <input
                    type="number"
                    value={track.plays}
                    onChange={(e) =>
                      handleUpdate &&
                      handleUpdate(track.id, "plays", e.target.value)
                    }
                    className="bg-black/30 border border-border-subtle text-white px-4 py-2.5 rounded-sm w-full focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="input-field-admin flex flex-col gap-2 flex-1 min-w-[100px]">
                  <label className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-wider">
                    <Heart size={12} /> Likes
                  </label>
                  <input
                    type="number"
                    value={track.likes}
                    onChange={(e) =>
                      handleUpdate &&
                      handleUpdate(track.id, "likes", e.target.value)
                    }
                    className="bg-black/30 border border-border-subtle text-white px-4 py-2.5 rounded-sm w-full focus:outline-none focus:border-primary"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    className="save-track-btn w-[42px] h-[42px] rounded-sm bg-white border border-transparent text-black flex items-center justify-center cursor-pointer transition-all hover:bg-zinc-200"
                    title="Save Changes"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    className="w-[42px] h-[42px] rounded-sm bg-surface border border-border-subtle text-primary flex items-center justify-center cursor-pointer transition-all hover:bg-primary/10 hover:border-primary/30"
                    title="Delete Track"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && filteredTracks?.length === 0 && (
            <div className="empty-state text-center py-16 text-white/50">
              <p>No tracks found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* pagination */}
        {totalPages && totalPages > 1 && (
          <div className="admin-pagination mt-8 flex justify-center items-center gap-5 pt-6 border-t border-border-subtle">
            <button
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="page-btn bg-black/30 border border-border-subtle text-white px-4 py-2 rounded-sm text-sm cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-surface-hover"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <div className="page-numbers flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`page-number w-9 h-9 flex items-center justify-center rounded-sm bg-black/30 border border-border-subtle text-white/50 text-sm cursor-pointer transition-all disabled:opacity-30 ${currentPage === i + 1 ? "!bg-white !border-white !text-black" : "hover:bg-surface-hover"}`}
                  disabled={isLoading}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages || isLoading}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="page-btn bg-black/30 border border-border-subtle text-white px-4 py-2 rounded-sm text-sm cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-surface-hover"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
