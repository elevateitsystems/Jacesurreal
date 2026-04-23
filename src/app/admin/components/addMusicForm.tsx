import { Music } from 'lucide-react'
import React from 'react'
import AudioUploadField from './audioUpload'

export default function AddMusicForm() {
  return (
    <div className="admin-card track-creator bg-surface border border-border-subtle rounded-sm p-8">
      <div className="card-header mb-8 pb-4 border-b border-border-subtle">
        <h2 className="text-2xl mb-1 text-white font-bebas tracking-widest">New Track</h2>
        <p className="text-white/50 text-sm">Add to exclusive library</p>
      </div>
      <form
        className="admin-create-form flex flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <AudioUploadField />
        
        <div className="input-group-admin flex-1 flex flex-col gap-2">
          <label className="text-xs text-white/50 uppercase tracking-wider">
            Title
          </label>
          <input
            type="text"
            placeholder="Track Name"
            className="bg-black/30 border border-border-subtle text-white px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="input-group-admin flex flex-col gap-2 w-full">
            <label className="text-xs text-white/50 uppercase tracking-wider">
              Initial Plays
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full bg-black/30 border border-border-subtle text-white px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="input-group-admin flex flex-col gap-2 w-full">
            <label className="text-xs text-white/50 uppercase tracking-wider">
              Initial Likes
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full bg-black/30 border border-border-subtle text-white px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
        
        <button className="create-track-btn mt-4 bg-[image:var(--background-image-primary-gradient)] text-white rounded-sm p-4 font-bold tracking-wider flex items-center justify-center gap-2.5 transition-all hover:opacity-90 border-none">
          <Music size={18} /> PUBLISH TRACK
        </button>
      </form>
    </div>
  )
}
