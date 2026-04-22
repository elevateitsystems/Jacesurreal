import { Music } from "lucide-react";
import React, { JSX } from "react";
import * as mm from "music-metadata-browser";

export default function AudioUploadField(): JSX.Element {
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);

  // cleanup blob URL
  React.useEffect(() => {
    return () => {
      if (thumbnail) URL.revokeObjectURL(thumbnail);
    };
  }, [thumbnail]);

  // validate image before setting it
  const isValidImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);

      img.src = url;
    });
  };

  const extractThumbnail = async (file: File): Promise<string | null> => {
    try {
      const metadata = await mm.parseBlob(file);
      const picture = metadata.common.picture?.[0];

      if (!picture?.data || !picture?.format) return null;

      const blob = new Blob([new Uint8Array(picture.data)], {
        type: picture.format,
      });

      const url = URL.createObjectURL(blob);

      // 🔥 validate before accepting
      const valid = await isValidImage(url);

      if (!valid) {
        URL.revokeObjectURL(url);
        return null;
      }

      return url;
    } catch {
      return null;
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setProgress(0);
    setIsUploading(true);
    setThumbnail(null);

    // 1️⃣ try embedded thumbnail
    const metaThumb = await extractThumbnail(selectedFile);

    // 2️⃣ fallback preview (optional)
    let fallbackUrl: string | null = null;

    if (!metaThumb) {
      fallbackUrl = URL.createObjectURL(selectedFile);
      const valid = await isValidImage(fallbackUrl);

      if (!valid) {
        URL.revokeObjectURL(fallbackUrl);
        fallbackUrl = null;
      }
    }

    setThumbnail(metaThumb || fallbackUrl);

    // fake upload progress
    let currentProgress = 0;

    const interval = window.setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 8;

      if (currentProgress >= 100) {
        currentProgress = 100;
        window.clearInterval(interval);
        setIsUploading(false);
      }

      setProgress(currentProgress);
    }, 300);
  };

  console.log({ thumbnail });   

  return (
    <div className="input-group-admin flex-1 flex flex-col gap-2">
      <div className="mb-1">
        <label className="text-[0.75rem] text-white/50 uppercase tracking-wider">
          Upload New
        </label>
        <p className="mt-1 text-[0.7rem] text-white/40">
          MP3, WAV, or M4A up to 20MB
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/30 px-6 py-8 transition-all hover:border-primary hover:bg-black/50 group">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mb-3 rounded-full bg-white/5 p-4 group-hover:bg-primary/20 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-6 w-6 text-white/70 group-hover:text-primary transition-all"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9l10.5-3m0 0L13.5 21M19.5 6l-7.846 7.846a2.121 2.121 0 11-3 3L3 21V15.5a2.121 2.121 0 013-3l7.846-7.846"
            />
          </svg>
        </div>

        <span className="text-[0.85rem] font-medium text-white/70 group-hover:text-white transition-all">
          Click to upload audio
        </span>
      </label>

      {file && (
        <div className="mt-2 rounded-xl bg-black/40 border border-white/5 p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="h-14 w-14 overflow-hidden rounded-lg bg-white/5 border border-white/10 shrink-0">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Audio Thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary-gradient flex items-center justify-center text-white">
                  <Music size={20} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-2 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-[0.9rem] font-medium text-white">
                    {file.name}
                  </p>
                  <p className="text-[0.75rem] text-white/50 font-mono">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <span className="text-[0.8rem] font-semibold text-primary font-mono shrink-0">
                  {progress}%
                </span>
              </div>

              {/* Progress */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-primary-gradient transition-all duration-300 shadow-[0_0_10px_rgba(255,45,85,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-1.5 text-[0.7rem] text-white/50 uppercase tracking-wider">
                {isUploading ? "Uploading..." : "Upload complete"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
