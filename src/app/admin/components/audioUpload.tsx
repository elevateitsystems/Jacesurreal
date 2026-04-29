import { Upload, Music, Image as ImageIcon, X } from "lucide-react";
import React, { JSX } from "react";
import * as mm from "music-metadata-browser";
import Image from "next/image";

interface AudioUploadFieldProps {
  onAudioChange: (data: string | null, duration?: number) => void;
  onThumbnailChange: (data: string | null) => void;
  audioUrl: string | null;
  thumbnailUrl: string | null;
}

export default function AudioUploadField({
  onAudioChange,
  onThumbnailChange,
  audioUrl,
  thumbnailUrl
}: AudioUploadFieldProps): JSX.Element {
  const [thumbMode, setThumbMode] = React.useState<"link" | "local">("link");
  const [audioMode, setAudioMode] = React.useState<"link" | "local">("link");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPreviewUrl(thumbnailUrl);
  }, [thumbnailUrl]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const extractMetadata = async (file: File) => {
    try {
      const metadata = await mm.parseBlob(file);
      return { duration: metadata.format.duration || 0 };
    } catch {
      return { duration: 0 };
    }
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { duration } = await extractMetadata(file);
    const base64 = await convertFileToBase64(file);
    onAudioChange(base64, duration);
  };

  const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await convertFileToBase64(file);
    onThumbnailChange(base64);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Cover Art Section */}
      <div className="w-full md:w-[280px] flex flex-col gap-3">
        <div className="flex gap-4 mb-1">
          <button
            type="button"
            onClick={() => setThumbMode("link")}
            className={`text-[0.7rem] uppercase tracking-wider font-bold transition-colors ${thumbMode === "link" ? "text-primary border-b-2 border-primary" : "text-white/20 hover:text-white"}`}
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => setThumbMode("local")}
            className={`text-[0.7rem] uppercase tracking-wider font-bold transition-colors ${thumbMode === "local" ? "text-primary border-b-2 border-primary" : "text-white/20 hover:text-white"}`}
          >
            from local
          </button>
        </div>
        
        <label className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold">
          COVER ART URL
        </label>

        {thumbMode === "link" ? (
          <input
            type="text"
            value={thumbnailUrl || ""}
            onChange={(e) => onThumbnailChange(e.target.value)}
            placeholder="https://example.com/image."
            className="bg-black/30 border border-white/5 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-all text-xs font-mono"
          />
        ) : (
          <div 
            onClick={() => document.getElementById('thumb-file')?.click()}
            className="bg-black/30 border border-white/5 border-dashed rounded-sm py-3 px-4 text-xs text-white/40 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center gap-2"
          >
            <Upload size={14} />
            <span>{thumbnailUrl?.startsWith('data:') ? "Image Ready" : "Choose local image"}</span>
            <input id="thumb-file" type="file" accept="image/*" className="hidden" onChange={handleThumbnailFileChange} />
          </div>
        )}
        
        <div className="aspect-square w-full rounded-sm bg-surface border border-white/5 border-dashed overflow-hidden flex flex-col items-center justify-center group mt-2">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-10">
              <ImageIcon size={32} strokeWidth={1} />
              <span className="text-[0.5rem] uppercase font-bold tracking-[0.15em] text-center px-4">PREVIEW APPEARS WHEN URL IS VALID</span>
            </div>
          )}
        </div>
      </div>

      {/* Track Details & Audio Source Section */}
      <div className="flex-1 flex flex-col gap-8 pt-6 md:pt-0">
        {/* Title input will be in parent, so we just focus on Audio here */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-4 mb-1">
            <button
              type="button"
              onClick={() => setAudioMode("link")}
              className={`text-[0.7rem] uppercase tracking-wider font-bold transition-colors ${audioMode === "link" ? "text-primary border-b-2 border-primary" : "text-white/20 hover:text-white"}`}
            >
              Link
            </button>
            <button
              type="button"
              onClick={() => setAudioMode("local")}
              className={`text-[0.7rem] uppercase tracking-wider font-bold transition-colors ${audioMode === "local" ? "text-primary border-b-2 border-primary" : "text-white/20 hover:text-white"}`}
            >
              from local
            </button>
          </div>

          <label className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] font-bold">
            AUDIO SOURCE URL
          </label>

          {audioMode === "link" ? (
            <input
              type="text"
              value={audioUrl || ""}
              onChange={(e) => onAudioChange(e.target.value)}
              placeholder="https://example.com/audio.mp3"
              className="bg-black/30 border border-white/5 text-white px-4 py-4 rounded-sm focus:outline-none focus:border-primary transition-all text-xs font-mono"
            />
          ) : (
            <div 
              onClick={() => document.getElementById('audio-file')?.click()}
              className="bg-black/30 border border-white/5 border-dashed rounded-sm py-4 px-4 text-xs text-white/40 cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center gap-2"
            >
              <Music size={16} />
              <span>{audioUrl?.startsWith('data:') ? "Audio File Ready" : "Choose local audio file"}</span>
              <input id="audio-file" type="file" accept="audio/*" className="hidden" onChange={handleAudioFileChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
