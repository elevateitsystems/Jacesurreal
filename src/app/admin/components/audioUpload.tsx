import { CloudUpload, Music } from "lucide-react";
import React, { JSX } from "react";
import * as mm from "music-metadata-browser";
import Image from "next/image";

export default function AudioUploadField(): JSX.Element {
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);

  // store blob url for cleanup
  const blobUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const extractThumbnail = async (file: File): Promise<string | null> => {
    try {
      const metadata = await mm.parseBlob(file);
      const picture = metadata.common.picture?.[0];

      if (!picture?.data || !picture?.format) return null;

      const blob = new Blob([new Uint8Array(picture.data)], {
        type: picture.format,
      });

      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

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

    // reset state in a single render batch
    setFile(selectedFile);
    setProgress(0);
    setIsUploading(true);
    setThumbnail(null);

    // try embedded thumbnail
    const metaThumb = await extractThumbnail(selectedFile);

    // fallback preview only if needed
    let finalThumb = metaThumb;

    if (!finalThumb) {
      const fallbackUrl = URL.createObjectURL(selectedFile);
      blobUrlRef.current = fallbackUrl;
      finalThumb = fallbackUrl;
    }

    setThumbnail(finalThumb);

    // fake upload progress (UI simulation only)
    let current = 0;

    const interval = window.setInterval(() => {
      current += Math.floor(Math.random() * 10) + 8;

      if (current >= 100) {
        current = 100;
        window.clearInterval(interval);
        setIsUploading(false);
      }

      setProgress(current);
    }, 300);
  };

  return (
    <div className="input-group-admin flex-1 flex flex-col gap-2">
      {/* Header */}
      <div className="mb-1">
        <label className="text-[0.75rem] text-white/50 uppercase tracking-wider">
          Upload New
        </label>
        <p className="mt-1 text-[0.7rem] text-white/40">
          MP3, WAV, or M4A up to 20MB
        </p>
      </div>

      {/* Upload Box */}
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/30 px-6 py-8 transition-all hover:border-primary hover:bg-black/50 group">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden size-full"
        />

        <CloudUpload className="relative top-1" size={24} />

        <span className="text-[0.85rem] font-medium text-white/70 group-hover:text-white transition-all">
          Click to upload audio
        </span>
      </label>

      {/* File preview */}
      {file && (
        <div className="mt-2 rounded-xl bg-black/40 border border-white/5 p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="h-14 w-14 overflow-hidden rounded-lg bg-white/5 border border-white/10 shrink-0">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt="Audio thumbnail"
                  className="h-full w-full object-cover"
                  width={50}
                  height={50}
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

                <span className="text-[0.8rem] font-semibold text-primary font-mono">
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
