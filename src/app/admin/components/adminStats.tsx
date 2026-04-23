import React from 'react'

interface AdminStatsProps {
  stats: {
    totalPlays: number | string;
    totalLikes: number | string;
  }
}

export default function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="admin-card stats-overview bg-surface border border-border-subtle rounded-sm p-8">
      <h2 className="text-2xl mb-6 text-white font-bebas tracking-widest border-b border-border-subtle pb-2">Overview</h2>
      <div className="mini-stats flex flex-col gap-4">
        <div className="mini-stat bg-black/30 p-5 rounded-sm flex flex-col gap-1 border border-border-subtle">
          <span className="label text-xs text-white/50 uppercase tracking-widest">
            Total Plays
          </span>
          <span className="value text-4xl font-bold text-primary">
            {stats.totalPlays.toLocaleString()}
          </span>
        </div>
        <div className="mini-stat bg-black/30 p-5 rounded-sm flex flex-col gap-1 border border-border-subtle">
          <span className="label text-xs text-white/50 uppercase tracking-widest">
            Total Likes
          </span>
          <span className="value text-4xl font-bold text-primary">
            {stats.totalLikes.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
