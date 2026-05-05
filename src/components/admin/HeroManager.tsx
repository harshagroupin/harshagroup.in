import { useState, useEffect } from "react";
import { fetchHeroContent, updateHeroContent, uploadImage, type HeroContent } from "@/lib/cms";
import ImageUploader from "./ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Sparkles, ImageIcon, Film, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HeroManager() {
  const { toast } = useToast();
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await fetchHeroContent();
      setHero(data);
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!hero) return;
    setSaving(true);
    const { error } = await updateHeroContent(hero.id, {
      heading: hero.heading,
      subheading: hero.subheading,
      image_url: hero.image_url,
      video_url: hero.video_url,
      media_type: hero.media_type,
      cta_primary_text: hero.cta_primary_text,
      cta_secondary_text: hero.cta_secondary_text,
    });
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Hero section updated!" });
    }
    setSaving(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hero) return;
    if (!file.type.startsWith("video/")) {
      toast({ title: "Please select a video file", variant: "destructive" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "Video must be under 50MB", variant: "destructive" });
      return;
    }
    setVideoUploading(true);
    const { url, error } = await uploadImage("hero-images", file);
    if (url && !error) {
      setHero({ ...hero, video_url: url, media_type: "video" });
      toast({ title: "Video uploaded!" });
    } else {
      toast({ title: "Upload failed", variant: "destructive" });
    }
    setVideoUploading(false);
    e.target.value = "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hero content found. Make sure you've run the database schema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Hero Section</h2>
          <p className="text-sm text-muted-foreground">Main homepage banner — image or video</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gold-gradient text-primary-foreground gap-2">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="relative h-64">
            {hero.media_type === "video" && hero.video_url ? (
              <video
                src={hero.video_url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : hero.image_url ? (
              <img src={hero.image_url} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                <Sparkles size={40} className="text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/90 flex items-center justify-center p-6">
              <div className="text-center">
                <h3 className="font-serif text-xl font-bold mb-2 line-clamp-2">{hero.heading}</h3>
                <p className="text-muted-foreground text-xs line-clamp-2">{hero.subheading}</p>
                <div className="flex gap-2 justify-center mt-3">
                  <span className="px-3 py-1 text-[10px] font-semibold rounded gold-gradient text-primary-foreground">
                    {hero.cta_primary_text}
                  </span>
                  <span className="px-3 py-1 text-[10px] font-semibold rounded border border-primary/40 text-foreground">
                    {hero.cta_secondary_text}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 text-center text-xs text-muted-foreground">
            Live Preview — {hero.media_type === "video" ? "🎬 Video" : "🖼️ Image"} Mode
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Media Type Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Background Media Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setHero({ ...hero, media_type: "image" })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                  hero.media_type === "image"
                    ? "gold-gradient text-primary-foreground gold-glow-sm"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImageIcon size={16} /> Image
              </button>
              <button
                onClick={() => setHero({ ...hero, media_type: "video" })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                  hero.media_type === "video"
                    ? "gold-gradient text-primary-foreground gold-glow-sm"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <Film size={16} /> Video
              </button>
            </div>
          </div>

          {/* Image Upload (for image mode) */}
          {hero.media_type === "image" && (
            <ImageUploader
              bucket="hero-images"
              currentUrl={hero.image_url}
              onUpload={(url) => setHero({ ...hero, image_url: url })}
              onRemove={() => setHero({ ...hero, image_url: null })}
              label="Background Image"
            />
          )}

          {/* Video Upload (for video mode) */}
          {hero.media_type === "video" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Background Video</label>
              {hero.video_url ? (
                <div className="relative group rounded-xl overflow-hidden border border-border/30 bg-secondary/30">
                  <video
                    src={hero.video_url}
                    className="w-full h-48 object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer p-1.5 rounded-lg bg-background/80 hover:bg-background text-foreground transition-colors">
                      <Upload size={14} />
                      <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    </label>
                    <button
                      onClick={() => setHero({ ...hero, video_url: null })}
                      className="p-1.5 rounded-lg bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-border/40 cursor-pointer hover:border-primary/50 hover:bg-secondary/20 transition-all">
                  {videoUploading ? (
                    <>
                      <Loader2 className="animate-spin text-primary mb-2" size={32} />
                      <span className="text-sm text-muted-foreground">Uploading video...</span>
                    </>
                  ) : (
                    <>
                      <Film size={32} className="text-muted-foreground/50 mb-2" />
                      <span className="text-sm text-muted-foreground">Drop video here or click to browse</span>
                      <span className="text-xs text-muted-foreground/50 mt-1">MP4, WebM — max 50MB</span>
                    </>
                  )}
                  <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={videoUploading} className="hidden" />
                </label>
              )}

              {/* Or paste external URL */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Or paste video URL (YouTube, external MP4, etc.)</label>
                <Input
                  value={hero.video_url || ""}
                  onChange={(e) => setHero({ ...hero, video_url: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                  className="bg-secondary/50 border-border/40 text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Heading</label>
            <Textarea
              value={hero.heading}
              onChange={(e) => setHero({ ...hero, heading: e.target.value })}
              className="bg-secondary/50 border-border/40 min-h-[80px]"
              placeholder="Premium Commercial Spaces..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Subheading</label>
            <Textarea
              value={hero.subheading}
              onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
              className="bg-secondary/50 border-border/40 min-h-[80px]"
              placeholder="Invest | Lease | Grow..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Primary Button</label>
              <Input
                value={hero.cta_primary_text}
                onChange={(e) => setHero({ ...hero, cta_primary_text: e.target.value })}
                className="bg-secondary/50 border-border/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Secondary Button</label>
              <Input
                value={hero.cta_secondary_text}
                onChange={(e) => setHero({ ...hero, cta_secondary_text: e.target.value })}
                className="bg-secondary/50 border-border/40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
