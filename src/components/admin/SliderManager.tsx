import { useState, useEffect } from "react";
import { fetchPageContent, updatePageContent } from "@/lib/cms";
import ImageUploader from "./ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save, Loader2, ImageIcon, GripVertical, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SliderManagerProps {
  /** The page_content key to store slider images under, e.g. "our_spaces_slides" or "gallery_slides" */
  pageKey: string;
  title: string;
  description: string;
}

export default function SliderManager({ pageKey, title, description }: SliderManagerProps) {
  const { toast } = useToast();
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await fetchPageContent(pageKey);
      if (data?.content && Array.isArray(data.content)) {
        setSlides(data.content);
      }
      setLoading(false);
    })();
  }, [pageKey]);

  const handleSave = async () => {
    setSaving(true);
    const validSlides = slides.filter((s) => s.trim().length > 0);
    const { error } = await updatePageContent(pageKey, validSlides);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${title} slider updated!` });
      setSlides(validSlides);
    }
    setSaving(false);
  };

  const addSlide = () => setSlides([...slides, ""]);
  const removeSlide = (i: number) => setSlides(slides.filter((_, idx) => idx !== i));
  const updateSlide = (i: number, val: string) => {
    const updated = [...slides];
    updated[i] = val;
    setSlides(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-5 glass rounded-xl border border-border/30 mb-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
          <ImageIcon size={18} className="text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold">{title} — Slider Images</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
        <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
        <span>
          These images appear in the hero slider on the <strong className="text-foreground">{title}</strong> page. Upload or paste image URLs. The slider auto-advances every 4 seconds.
        </span>
      </div>

      {/* Slides List */}
      <div className="space-y-3">
        {slides.length === 0 && (
          <div className="text-center py-8 text-muted-foreground/60 border border-dashed border-border/40 rounded-xl">
            <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No slider images added yet.</p>
            <p className="text-xs mt-1">Default images will be used if empty.</p>
          </div>
        )}
        {slides.map((slide, i) => (
          <div key={i} className="glass rounded-xl overflow-hidden border border-border/20">
            <div className="flex items-stretch gap-0">
              {/* Index */}
              <div className="flex flex-col items-center justify-center px-3 bg-secondary/20 border-r border-border/20 gap-1 min-w-[44px]">
                <GripVertical size={14} className="text-muted-foreground/40" />
                <span className="text-xs font-bold text-primary/70">{i + 1}</span>
              </div>

              {/* Preview */}
              {slide && slide.trim().length > 0 && (
                <div className="w-24 h-16 flex-shrink-0 border-r border-border/20">
                  <img
                    src={slide}
                    alt={`Slide ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}

              {/* Upload + URL */}
              <div className="flex-1 p-3 space-y-2">
                <ImageUploader
                  bucket="hero-images"
                  currentUrl={slide || null}
                  onUpload={(url) => updateSlide(i, url)}
                  onRemove={() => updateSlide(i, "")}
                  label=""
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border/30" />
                  <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">or paste URL</span>
                  <div className="flex-1 h-px bg-border/30" />
                </div>
                <Input
                  value={slide}
                  onChange={(e) => updateSlide(i, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-secondary/50 border-border/40 h-8 text-xs"
                />
              </div>

              {/* Delete */}
              <div className="flex items-center px-3 border-l border-border/20">
                <button
                  onClick={() => removeSlide(i)}
                  className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive text-destructive hover:text-white transition-colors"
                  title="Remove slide"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={addSlide}
          variant="outline"
          size="sm"
          className="gap-1.5 border-primary/30 text-xs"
        >
          <Plus size={14} /> Add Slide
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="gold-gradient text-primary-foreground gap-1.5 text-xs"
        >
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Slider"}
        </Button>
      </div>
    </div>
  );
}
