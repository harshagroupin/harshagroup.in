import { useState, useEffect } from "react";
import { fetchPageContent, updatePageContent } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Save, Loader2, Plus, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PageContentManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Section states
  const [stats, setStats] = useState<any[]>([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [about, setAbout] = useState<any>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [statsRes, partnersRes, testimonialsRes, aboutRes] = await Promise.all([
        fetchPageContent("stats"),
        fetchPageContent("partners"),
        fetchPageContent("testimonials"),
        fetchPageContent("about"),
      ]);
      if (statsRes.data) setStats(statsRes.data.content);
      if (partnersRes.data) setPartners(partnersRes.data.content);
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data.content);
      if (aboutRes.data) setAbout(aboutRes.data.content);
      setLoading(false);
    })();
  }, []);

  const saveSection = async (key: string, content: any) => {
    setSaving(key);
    const { error } = await updatePageContent(key, content);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${key.charAt(0).toUpperCase() + key.slice(1)} updated!` });
    }
    setSaving(null);
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
      <div>
        <h2 className="font-serif text-2xl font-bold">Page Content</h2>
        <p className="text-sm text-muted-foreground">Manage stats, partners, testimonials & about section</p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {/* Stats Section */}
        <AccordionItem value="stats" className="glass rounded-xl border-border/30 px-5">
          <AccordionTrigger className="font-serif text-lg hover:no-underline">
            📊 Statistics
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {stats.map((stat: any, i: number) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Label</label>
                  <Input
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[i] = { ...stat, label: e.target.value };
                      setStats(updated);
                    }}
                    className="bg-secondary/50 border-border/40 h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Value</label>
                  <Input
                    type="number"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[i] = { ...stat, value: Number(e.target.value) };
                      setStats(updated);
                    }}
                    className="bg-secondary/50 border-border/40 h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Suffix</label>
                  <Input
                    value={stat.suffix}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[i] = { ...stat, suffix: e.target.value };
                      setStats(updated);
                    }}
                    className="bg-secondary/50 border-border/40 h-9 text-sm"
                  />
                </div>
              </div>
            ))}
            <Button
              onClick={() => saveSection("stats", stats)}
              disabled={saving === "stats"}
              className="gold-gradient text-primary-foreground gap-2"
              size="sm"
            >
              {saving === "stats" ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save Stats
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Partners Section */}
        <AccordionItem value="partners" className="glass rounded-xl border-border/30 px-5">
          <AccordionTrigger className="font-serif text-lg hover:no-underline">
            🤝 Channel Partners
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <div className="flex flex-wrap gap-2">
              {partners.map((p: string, i: number) => (
                <div key={i} className="flex items-center gap-1 bg-secondary/50 rounded-full px-3 py-1.5">
                  <Input
                    value={p}
                    onChange={(e) => {
                      const updated = [...partners];
                      updated[i] = e.target.value;
                      setPartners(updated);
                    }}
                    className="bg-transparent border-none h-6 p-0 text-sm w-24 focus-visible:ring-0"
                  />
                  <button
                    onClick={() => setPartners(partners.filter((_, j) => j !== i))}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPartners([...partners, "New Partner"])}
                variant="outline"
                size="sm"
                className="gap-1 border-primary/30"
              >
                <Plus size={14} /> Add Partner
              </Button>
              <Button
                onClick={() => saveSection("partners", partners)}
                disabled={saving === "partners"}
                className="gold-gradient text-primary-foreground gap-2"
                size="sm"
              >
                {saving === "partners" ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                Save Partners
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Testimonials Section */}
        <AccordionItem value="testimonials" className="glass rounded-xl border-border/30 px-5">
          <AccordionTrigger className="font-serif text-lg hover:no-underline">
            ⭐ Testimonials
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            {testimonials.map((t: any, i: number) => (
              <div key={i} className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Testimonial #{i + 1}</span>
                  <button
                    onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Name</label>
                    <Input
                      value={t.name}
                      onChange={(e) => {
                        const updated = [...testimonials];
                        updated[i] = { ...t, name: e.target.value };
                        setTestimonials(updated);
                      }}
                      className="bg-secondary/50 border-border/40 h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Role</label>
                    <Input
                      value={t.role}
                      onChange={(e) => {
                        const updated = [...testimonials];
                        updated[i] = { ...t, role: e.target.value };
                        setTestimonials(updated);
                      }}
                      className="bg-secondary/50 border-border/40 h-9 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Feedback</label>
                  <Textarea
                    value={t.feedback}
                    onChange={(e) => {
                      const updated = [...testimonials];
                      updated[i] = { ...t, feedback: e.target.value };
                      setTestimonials(updated);
                    }}
                    className="bg-secondary/50 border-border/40 min-h-[60px] text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          const updated = [...testimonials];
                          updated[i] = { ...t, rating: star };
                          setTestimonials(updated);
                        }}
                        className="transition-colors"
                      >
                        <Star
                          size={18}
                          className={star <= t.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                onClick={() => setTestimonials([...testimonials, { name: "", role: "", feedback: "", rating: 5 }])}
                variant="outline"
                size="sm"
                className="gap-1 border-primary/30"
              >
                <Plus size={14} /> Add Testimonial
              </Button>
              <Button
                onClick={() => saveSection("testimonials", testimonials)}
                disabled={saving === "testimonials"}
                className="gold-gradient text-primary-foreground gap-2"
                size="sm"
              >
                {saving === "testimonials" ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                Save Testimonials
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* About Section */}
        <AccordionItem value="about" className="glass rounded-xl border-border/30 px-5">
          <AccordionTrigger className="font-serif text-lg hover:no-underline">
            ℹ️ About Section
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Heading</label>
              <Input
                value={about.heading || ""}
                onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                className="bg-secondary/50 border-border/40"
              />
            </div>
            {["paragraph1", "paragraph2", "paragraph3"].map((key) => (
              <div key={key} className="space-y-2">
                <label className="text-sm text-muted-foreground capitalize">{key.replace(/(\d+)/, " $1")}</label>
                <Textarea
                  value={about[key] || ""}
                  onChange={(e) => setAbout({ ...about, [key]: e.target.value })}
                  className="bg-secondary/50 border-border/40 min-h-[80px]"
                />
              </div>
            ))}
            <Button
              onClick={() => saveSection("about", about)}
              disabled={saving === "about"}
              className="gold-gradient text-primary-foreground gap-2"
              size="sm"
            >
              {saving === "about" ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save About
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
