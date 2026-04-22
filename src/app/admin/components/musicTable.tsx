import React from "react";
import {
  Play,
  Heart,
  Music,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface musicTableProps {
  isLoading?: boolean;
  filteredTracks?: any[];
  setSearchQuery?: (query: string) => void;
  handleUpdate?: (id: number, field: "plays" | "likes", value: string) => void;
  paginatedTracks?: any[];
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
}: musicTableProps) {
  return (
    <main className="admin-content min-h-[700px]">
      <div className="admin-card track-editor full-height bg-[#0a0a0f]/60 backdrop-blur-[20px] border border-white/5 rounded-[24px] p-8 flex flex-col">
        <div className="content-header-row flex justify-between items-center mb-8 pb-6 border-b border-white/5">
          <div className="card-header">
            <h2 className="text-xl mb-1 text-white">Manage Catalog</h2>
            <p className="text-white/50 text-[0.95rem]">
              {isLoading
                ? "Searching..."
                : `${filteredTracks?.length} tracks found`}
            </p>
          </div>
          <div className="admin-search-wrapper relative w-[300px]">
            <input
              type="text"
              placeholder="Filter tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-white/3 border border-white/1 px-4 py-3 rounded-xl text-white text-[0.9rem] focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(255,45,85,0.1)] transition-all"
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
                      handleUpdate &&
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
                      handleUpdate &&
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

          {!isLoading && filteredTracks?.length === 0 && (
            <div className="empty-state text-center py-16 text-white/50">
              <p>No tracks found matching your search.</p>
            </div>
          )}
        </div>
        {/* pagination */}
        {totalPages && totalPages > 1 && (
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
  );
}
