import { useState, useEffect } from "react";
import { fetchHeroContent, updateHeroContent, uploadImage, fetchPageContent, updatePageContent, type HeroContent } from "@/lib/cms";
import { formatImageUrl, getYoutubeEmbed } from "@/lib/utils";
import ImageUploader from "./ImageUploader";
import MediaUploader from "./MediaUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, Sparkles, ImageIcon, Film, Upload, X, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HeroManager() {
  const { toast } = useToast();
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [settings, setSettings] = useState<{
    hideHeading: boolean;
    hideSubheading: boolean;
    hidePrimaryBtn: boolean;
    hideSecondaryBtn: boolean;
    slides: string[];
    fractionalMediaUrl: string;
    fractionalMediaType: "image" | "video";
  }>({
    hideHeading: false,
    hideSubheading: false,
    hidePrimaryBtn: false,
    hideSecondaryBtn: false,
    slides: [],
    fractionalMediaUrl: "",
    fractionalMediaType: "image",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [slideUploading, setSlideUploading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [heroRes, settingsRes] = await Promise.all([
        fetchHeroContent(),
        fetchPageContent("hero_settings")
      ]);
      setHero(heroRes.data);
      if (settingsRes.data?.content) {
        setSettings({
          hideHeading: !!settingsRes.data.content.hideHeading,
          hideSubheading: !!settingsRes.data.content.hideSubheading,
          hidePrimaryBtn: !!settingsRes.data.content.hidePrimaryBtn,
          hideSecondaryBtn: !!settingsRes.data.content.hideSecondaryBtn,
          slides: settingsRes.data.content.slides || [],
          fractionalMediaUrl: settingsRes.data.content.fractionalMediaUrl || "",
          fractionalMediaType: settingsRes.data.content.fractionalMediaType || "image",
        });
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!hero) return;
    setSaving(true);
    const [heroUpdate, settingsUpdate] = await Promise.all([
      updateHeroContent(hero.id, {
        heading: hero.heading,
        subheading: hero.subheading,
        image_url: hero.image_url,
        video_url: hero.video_url,
        media_type: hero.media_type,
        cta_primary_text: hero.cta_primary_text,
        cta_secondary_text: hero.cta_secondary_text,
      }),
      updatePageContent("hero_settings", settings)
    ]);

    if (heroUpdate.error) {
      toast({ title: "Error saving", description: heroUpdate.error.message, variant: "destructive" });
    } else if (settingsUpdate.error) {
      // Create if doesn't exist
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('page_content').insert({
        section_key: 'hero_settings',
        content: settings
      });
      toast({ title: "Hero section updated!" });
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

  const handleSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    setSlideUploading(true);
    const { url, error } = await uploadImage("hero-images", file);
    if (url && !error) {
      setSettings({ ...settings, slides: [...(settings.slides || []), url] });
      toast({ title: "Slide added!" });
    } else {
      toast({ title: "Upload failed", variant: "destructive" });
    }
    setSlideUploading(false);
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
        {/* Preview Column */}
        <div className="space-y-6 flex flex-col">
          {/* Main Preview */}
          <div className="glass rounded-2xl overflow-hidden">
          <div className="relative h-64">
            {hero.media_type === "video" && hero.video_url ? (
              getYoutubeEmbed(hero.video_url, true) ? (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <iframe
                    src={getYoutubeEmbed(hero.video_url, true)!}
                    className="absolute w-[200vw] h-[200vh] sm:w-[150vw] sm:h-[150vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0"
                    tabIndex={-1}
                  />
                </div>
              ) : (
                <video
                  src={hero.video_url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )
            ) : hero.image_url ? (
              <img src={formatImageUrl(hero.image_url)} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                <Sparkles size={40} className="text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 flex items-center justify-center p-6 pointer-events-none">
              <div className="text-center">
                {!settings.hideHeading && (
                  <h3 className="font-serif text-xl font-bold mb-2 line-clamp-2 text-white">{hero.heading}</h3>
                )}
                {!settings.hideSubheading && (
                  <p className="text-white/80 text-xs line-clamp-2">{hero.subheading}</p>
                )}
                <div className="flex gap-2 justify-center mt-3">
                  {!settings.hidePrimaryBtn && (
                    <span className="px-3 py-1 text-[10px] font-semibold rounded gold-gradient text-primary-foreground">
                      {hero.cta_primary_text}
                    </span>
                  )}
                  {!settings.hideSecondaryBtn && (
                    <span className="px-3 py-1 text-[10px] font-semibold rounded border border-primary/40 text-foreground">
                      {hero.cta_secondary_text}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 text-center text-xs text-muted-foreground">
            Live Preview — {hero.media_type === "video" ? "🎬 Video" : "🖼️ Image"} Mode
          </div>
        </div>

          {/* Additional Slides Previews */}
          {settings.slides?.length > 0 && (
            <div className="space-y-6">
              {settings.slides.map((slide: string, index: number) => (
                <div key={index} className="glass rounded-2xl overflow-hidden relative group">
                  <div className="relative h-64">
                    <img src={formatImageUrl(slide)} alt={`Slide ${index + 2}`} className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-border/30">
                      Slide {index + 2}
                    </div>

                    <button
                      onClick={() => {
                        const newSlides = [...settings.slides];
                        newSlides.splice(index, 1);
                        setSettings({ ...settings, slides: newSlides });
                      }}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all hover:scale-105 shadow-xl"
                      title="Remove Slide"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Homepage Fractional Redirect Slide Preview */}
          {settings.fractionalMediaUrl && (
            <div className="glass rounded-2xl overflow-hidden relative group mt-6">
              <div className="relative h-64">
                {settings.fractionalMediaType === "video" ? (
                  getYoutubeEmbed(settings.fractionalMediaUrl, true) ? (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <iframe
                        src={getYoutubeEmbed(settings.fractionalMediaUrl, true)!}
                        className="absolute w-[200vw] h-[200vh] sm:w-[150vw] sm:h-[150vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        frameBorder="0"
                        tabIndex={-1}
                      />
                    </div>
                  ) : (
                    <video
                      src={settings.fractionalMediaUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )
                ) : (
                  <img src={formatImageUrl(settings.fractionalMediaUrl)} alt="Fractional slide preview" className="w-full h-full object-cover" />
                )}
                
                <div className="absolute top-4 left-4 bg-primary/85 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-border/30 text-primary-foreground">
                  Fractional Redirect Slide (Redirects to /fractional-model)
                </div>
              </div>
            </div>
          )}
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

          {/* Image Upload */}
          {hero.media_type === "image" && (
            <div className="space-y-4">
              <ImageUploader
                bucket="hero-images"
                currentUrl={hero.image_url}
                onUpload={(url) => setHero({ ...hero, image_url: url })}
                onRemove={() => setHero({ ...hero, image_url: null })}
                label="Background Image Upload"
              />
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Or paste image URL directly</label>
                <Input
                  value={hero.image_url || ""}
                  onChange={(e) => setHero({ ...hero, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-secondary/50 border-border/40 text-sm"
                />
              </div>
            </div>
          )}

          {/* Video Upload */}
          {hero.media_type === "video" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Background Video</label>
              {hero.video_url ? (
                <div className="relative group rounded-xl overflow-hidden border border-border/30 bg-secondary/30">
                  {getYoutubeEmbed(hero.video_url) ? (
                    <iframe
                      src={getYoutubeEmbed(hero.video_url)!}
                      className="w-full h-48 object-cover pointer-events-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      frameBorder="0"
                      tabIndex={-1}
                    />
                  ) : (
                    <video
                      src={hero.video_url}
                      className="w-full h-48 object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
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

          {/* Homepage Fractional Slide */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Homepage Fractional Slide</h3>
              <p className="text-xs text-muted-foreground">This media appears in the homepage hero slider and redirects to the Fractional Model page when clicked.</p>
            </div>
            <MediaUploader
              bucket="hero-images"
              currentImageUrl={settings.fractionalMediaType === "image" ? settings.fractionalMediaUrl : null}
              currentVideoUrl={settings.fractionalMediaType === "video" ? settings.fractionalMediaUrl : null}
              onImageUpload={(url) => setSettings({ ...settings, fractionalMediaUrl: url, fractionalMediaType: "image" })}
              onImageRemove={() => setSettings({ ...settings, fractionalMediaUrl: "", fractionalMediaType: "image" })}
              onVideoChange={(url) => setSettings({ ...settings, fractionalMediaUrl: url || "", fractionalMediaType: url ? "video" : "image" })}
              label="Fractional Slide Media (Image/Video)"
            />
          </div>

          {/* Additional Slider Images */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Additional Slider Images</h3>
              <p className="text-xs text-muted-foreground">Add more images to make the hero section a slider. Previews will appear on the left.</p>
            </div>
            
            <label className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border/40 cursor-pointer hover:border-primary/50 hover:bg-secondary/20 transition-all">
              {slideUploading ? (
                <>
                  <Loader2 className="animate-spin text-primary" size={16} />
                  <span className="text-sm font-medium">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Upload Extra Slide</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleSlideUpload} disabled={slideUploading} className="hidden" />
            </label>
          </div>

          {/* Heading with Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Heading</label>
              <div className="flex items-center gap-2">
                <EyeOff size={14} className="text-muted-foreground" />
                <Switch 
                  checked={settings.hideHeading} 
                  onCheckedChange={(c) => setSettings({ ...settings, hideHeading: c })} 
                />
              </div>
            </div>
            <Textarea
              value={hero.heading}
              onChange={(e) => setHero({ ...hero, heading: e.target.value })}
              className={`bg-secondary/50 border-border/40 min-h-[80px] ${settings.hideHeading ? 'opacity-50' : ''}`}
              placeholder="Premium Commercial Spaces..."
            />
          </div>

          {/* Subheading with Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Subheading</label>
              <div className="flex items-center gap-2">
                <EyeOff size={14} className="text-muted-foreground" />
                <Switch 
                  checked={settings.hideSubheading} 
                  onCheckedChange={(c) => setSettings({ ...settings, hideSubheading: c })} 
                />
              </div>
            </div>
            <Textarea
              value={hero.subheading}
              onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
              className={`bg-secondary/50 border-border/40 min-h-[80px] ${settings.hideSubheading ? 'opacity-50' : ''}`}
              placeholder="Invest | Lease | Grow..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Primary CTA with Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Primary Button</label>
                <div className="flex items-center gap-2">
                  <EyeOff size={14} className="text-muted-foreground" />
                  <Switch 
                    checked={settings.hidePrimaryBtn} 
                    onCheckedChange={(c) => setSettings({ ...settings, hidePrimaryBtn: c })} 
                  />
                </div>
              </div>
              <Input
                value={hero.cta_primary_text}
                onChange={(e) => setHero({ ...hero, cta_primary_text: e.target.value })}
                className={`bg-secondary/50 border-border/40 ${settings.hidePrimaryBtn ? 'opacity-50' : ''}`}
              />
            </div>

            {/* Secondary CTA with Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Secondary Button</label>
                <div className="flex items-center gap-2">
                  <EyeOff size={14} className="text-muted-foreground" />
                  <Switch 
                    checked={settings.hideSecondaryBtn} 
                    onCheckedChange={(c) => setSettings({ ...settings, hideSecondaryBtn: c })} 
                  />
                </div>
              </div>
              <Input
                value={hero.cta_secondary_text}
                onChange={(e) => setHero({ ...hero, cta_secondary_text: e.target.value })}
                className={`bg-secondary/50 border-border/40 ${settings.hideSecondaryBtn ? 'opacity-50' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
