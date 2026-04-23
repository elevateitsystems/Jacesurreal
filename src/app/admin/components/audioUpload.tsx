import { Upload, Music } from "lucide-react";
import React, { JSX } from "react";
import * as mm from "music-metadata-browser";
import Image from "next/image";

export default function AudioUploadField(): JSX.Element {
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);
  const [isDragActive, setIsDragActive] = React.useState<boolean>(false);

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
    e: any,
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

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = (e: React.DragEvent) => { 
    e.preventDefault(); 
    setIsDragActive(false); 
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } }); 
    }
  };

  return (
    <div className="track-uploader flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-[0.8rem] uppercase tracking-wider font-medium ml-1 flex items-center gap-2">
          <Music size={14} className="text-primary" /> Audio File
        </label>
        <div 
          className={`relative border-2 border-dashed transition-all duration-300 rounded-sm p-10 flex flex-col items-center justify-center cursor-pointer group ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border-subtle bg-black/30 hover:border-white/20'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('audio-upload-input')?.click()}
        >
          <input 
            id="audio-upload-input"
            type="file" 
            accept="audio/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-sm bg-surface border border-border-subtle flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <Upload className="text-white/30 group-hover:text-primary transition-colors" size={28} />
          </div>
          <p className="text-white font-medium text-lg mb-1">Upload Audio Track</p>
          <p className="text-white/40 text-sm">Drag & drop or click to browse</p>
        </div>
      </div>

      {file && (
        <div className="file-info bg-surface border border-border-subtle rounded-sm p-5 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-12 h-12 rounded-sm bg-black/30 flex items-center justify-center text-primary border border-primary/20 shrink-0 overflow-hidden">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt="Audio thumbnail"
                className="h-full w-full object-cover"
                width={50}
                height={50}
              />
            ) : (
              <Music size={20} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-[0.9rem] font-medium text-white">
                  {file.name}
                </p>
                <p className="text-[0.75rem] text-white/40 font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <span className="text-[0.8rem] font-semibold text-primary font-mono">
                {progress}%
              </span>
            </div>

            <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-[0.7rem] text-white/40 uppercase tracking-wider">
              {isUploading ? "Uploading..." : "Ready to publish"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
