import React from 'react'

export default function AdminStats() {
  return (
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
  )
}
