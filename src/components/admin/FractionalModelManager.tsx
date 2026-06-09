import { useState, useEffect } from "react";
import { fetchPageContent, updatePageContent } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MediaUploader from "@/components/admin/MediaUploader";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FractionalModelManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heading, setHeading] = useState("Fractional Investment Model");
  const [subheading, setSubheading] = useState(
    "India's first fractional ownership model in commercial real estate — invest smart, earn big."
  );
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetchPageContent("fractional_model");
      if (res.data?.content) {
        const c = res.data.content;
        if (c.heading) setHeading(c.heading);
        if (c.subheading) setSubheading(c.subheading);
        if (c.image_url) setImageUrl(c.image_url);
        if (c.video_url) setVideoUrl(c.video_url);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const content = {
      heading,
      subheading,
      image_url: imageUrl,
      video_url: videoUrl,
      media_type: videoUrl ? "video" : "image",
    };
    const { error } = await updatePageContent("fractional_model", content);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Fractional Model content updated!" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Fractional Model</h2>
          <p className="text-sm text-muted-foreground">
            Manage hero image/video, heading & subheading for the Fractional Model page
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gold-gradient text-primary-foreground gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save Changes
        </Button>
      </div>

      {/* Heading & Subheading */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-serif text-lg font-semibold">📝 Text Content</h3>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Page Heading</label>
          <Input
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="bg-secondary/50 border-border/40"
            placeholder="Fractional Investment Model"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Page Subheading</label>
          <Textarea
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            className="bg-secondary/50 border-border/40 min-h-[80px]"
            placeholder="Brief description..."
          />
        </div>
      </div>

      {/* Hero Media */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-serif text-lg font-semibold">🖼️ Hero Media</h3>
        <MediaUploader
          bucket="hero-images"
          currentImageUrl={imageUrl || null}
          currentVideoUrl={videoUrl || null}
          onImageUpload={(url) => setImageUrl(url)}
          onImageRemove={() => setImageUrl("")}
          onVideoChange={(url) => setVideoUrl(url || "")}
          label="Hero Image or Video"
        />
      </div>
    </div>
  );
}
