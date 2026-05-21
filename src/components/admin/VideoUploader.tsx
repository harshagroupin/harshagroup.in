import { useState, useCallback } from "react";
import { uploadImage } from "@/lib/cms";
import { Upload, X, Video, Loader2, Film } from "lucide-react";

interface Props {
  bucket: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  label?: string;
}

export default function VideoUploader({ bucket, currentUrl, onUpload, onRemove, label = "Upload Video" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please select a video file (mp4, mov, webm, etc.)");
      return;
    }
    setUploading(true);
    setPreview(URL.createObjectURL(file)); // local blob preview
    const { url, error } = await uploadImage(bucket, file);
    if (url && !error) {
      onUpload(url);
      setPreview(url);
    } else {
      setPreview(currentUrl || null);
    }
    setUploading(false);
  }, [bucket, onUpload, currentUrl]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}

      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-border/30 bg-secondary/30">
          <video
            src={preview}
            className="w-full h-48 object-cover"
            muted
            playsInline
            onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
            onMouseLeave={(e) => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
          />
          {uploading && (
            <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-primary" size={32} />
              <span className="text-xs text-muted-foreground">Uploading video...</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="cursor-pointer p-1.5 rounded-lg bg-background/80 hover:bg-background text-foreground transition-colors">
              <Upload size={14} />
              <input type="file" accept="video/*" onChange={handleChange} className="hidden" />
            </label>
            {onRemove && (
              <button
                onClick={() => { setPreview(null); onRemove(); }}
                className="p-1.5 rounded-lg bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-md">
            <Film size={11} className="text-blue-400" />
            <span className="text-[10px] text-muted-foreground">Hover to preview • Upload to replace</span>
          </div>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragActive
              ? "border-blue-400 bg-blue-500/5"
              : "border-border/40 hover:border-blue-400/50 hover:bg-secondary/20"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <Video size={28} className="text-blue-400/60 mb-2" />
          <span className="text-sm text-muted-foreground text-center px-4">
            {uploading ? "Uploading..." : "Drop video here or click to browse"}
          </span>
          <span className="text-[10px] text-muted-foreground/50 mt-1">MP4, MOV, WebM supported</span>
          <input type="file" accept="video/*" onChange={handleChange} className="hidden" />
        </label>
      )}
    </div>
  );
}
