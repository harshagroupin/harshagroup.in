import { useState, useCallback } from "react";
import { uploadImage } from "@/lib/cms";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatImageUrl } from "@/lib/utils";

interface Props {
  bucket: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  label?: string;
}

export default function ImageUploader({ bucket, currentUrl, onUpload, onRemove, label = "Upload Image" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setPreview(URL.createObjectURL(file));
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
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      
      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-border/30 bg-secondary/30">
          <img src={formatImageUrl(preview)} alt="Preview" className="w-full h-48 object-cover" />
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
            {onRemove && (
              <button
                onClick={() => { setPreview(null); onRemove(); }}
                className="p-1.5 rounded-lg bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border/40 hover:border-primary/50 hover:bg-secondary/20"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
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
    </div>
  );
}
