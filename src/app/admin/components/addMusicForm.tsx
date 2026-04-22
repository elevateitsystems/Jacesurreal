import { Music } from 'lucide-react'
import React from 'react'
import AudioUploadField from './audioUpload'

export default function AddMusicForm() {
  return (
    <div className="admin-card track-creator bg-[#0a0a0f]/60 backdrop-blur-[20px] border border-white/5 rounded-[24px] p-8">
            <div className="card-header mb-8">
              <h2 className="text-xl mb-1 text-white">New Track</h2>
              <p className="text-white/50 text-[0.95rem]">Add to library</p>
            </div>
             <form
              className="admin-create-form flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <AudioUploadField />
              <div className="input-group-admin flex-1 flex flex-col gap-2">
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
                    className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="input-group-admin flex flex-col gap-2">
                  <label className="text-[0.75rem] text-white/50 uppercase tracking-wider">
                    Likes
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
              <button className="create-track-btn mt-2 bg-primary-gradient text-white rounded-xl p-4 font-semibold flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_15px_rgba(255,45,85,0.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,45,85,0.3)]">
                <Music size={18} /> Publish
              </button>
            </form>
            </div>
  )
}
