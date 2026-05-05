import { useState, useCallback, useEffect } from "react";
import { uploadImage } from "@/lib/cms";
import { Upload, X, ImageIcon, Loader2, Video, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MediaType = "image" | "video";

interface Props {
  bucket: string;
  currentImageUrl?: string | null;
  currentVideoUrl?: string | null;
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
  onVideoChange: (url: string | null) => void;
  label?: string;
}

export default function MediaUploader({
  bucket,
  currentImageUrl,
  currentVideoUrl,
  onImageUpload,
  onImageRemove,
  onVideoChange,
  label = "Property Media",
}: Props) {
  const [mediaType, setMediaType] = useState<MediaType>(
    currentVideoUrl ? "video" : "image"
  );
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const [videoUrl, setVideoUrl] = useState(currentVideoUrl || "");

  // Sync preview when currentImageUrl changes externally
  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  useEffect(() => {
    setVideoUrl(currentVideoUrl || "");
    if (currentVideoUrl) setMediaType("video");
  }, [currentVideoUrl]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setUploading(true);
      setPreview(URL.createObjectURL(file));
      const { url, error } = await uploadImage(bucket, file);
      if (url && !error) {
        onImageUpload(url);
        setPreview(url);
      } else {
        setPreview(currentImageUrl || null);
      }
      setUploading(false);
    },
    [bucket, onImageUpload, currentImageUrl]
  );

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

  const switchToImage = () => {
    setMediaType("image");
    // Clear video when switching to image
    setVideoUrl("");
    onVideoChange(null);
  };

  const switchToVideo = () => {
    setMediaType("video");
    // Clear image when switching to video
    setPreview(null);
    onImageRemove();
  };

  const handleVideoUrlChange = (value: string) => {
    setVideoUrl(value);
    onVideoChange(value || null);
  };

  // Convert YouTube URL to embed format for preview
  const getVideoPreviewUrl = (url: string): string | null => {
    if (!url) return null;
    // YouTube
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    return null;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>

      {/* Toggle: Image vs Video */}
      <div className="flex rounded-lg overflow-hidden border border-border/40">
        <button
          type="button"
          onClick={switchToImage}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
            mediaType === "image"
              ? "gold-gradient text-primary-foreground"
              : "bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
        >
          <ImageIcon size={15} />
          Image
        </button>
        <button
          type="button"
          onClick={switchToVideo}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
            mediaType === "video"
              ? "bg-blue-600 text-white"
              : "bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
        >
          <Video size={15} />
          Video
        </button>
      </div>

      {/* Image Upload Area */}
      {mediaType === "image" && (
        <>
          {preview ? (
            <div className="relative group rounded-xl overflow-hidden border border-border/30 bg-secondary/30">
              <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              {uploading && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer p-1.5 rounded-lg bg-background/80 hover:bg-background text-foreground transition-colors">
                  <Upload size={14} />
                  <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
                </label>
                <button
                  onClick={() => {
                    setPreview(null);
                    onImageRemove();
                  }}
                  className="p-1.5 rounded-lg bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <label
              className={`flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border/40 hover:border-primary/50 hover:bg-secondary/20"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <ImageIcon size={32} className="text-muted-foreground/50 mb-2" />
              <span className="text-sm text-muted-foreground">
                {uploading ? "Uploading..." : "Drop image here or click to browse"}
              </span>
              <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
            </label>
          )}
        </>
      )}

      {/* Video URL Input */}
      {mediaType === "video" && (
        <div className="space-y-3">
          <Input
            value={videoUrl}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or direct video link"
            className="bg-secondary/50 border-border/40"
          />
          <p className="text-[11px] text-muted-foreground/60">
            Paste YouTube URL or direct video file URL (.mp4, .webm)
          </p>

          {/* Video Preview */}
          {videoUrl && (
            <div className="relative rounded-xl overflow-hidden border border-border/30 bg-secondary/30 h-48 flex items-center justify-center">
              {getVideoPreviewUrl(videoUrl) ? (
                <>
                  <img
                    src={getVideoPreviewUrl(videoUrl)!}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                    <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center shadow-lg">
                      <Film size={24} className="text-primary-foreground ml-0.5" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
                  <Video size={40} />
                  <span className="text-xs">Video URL set</span>
                </div>
              )}
              <button
                onClick={() => handleVideoUrlChange("")}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
