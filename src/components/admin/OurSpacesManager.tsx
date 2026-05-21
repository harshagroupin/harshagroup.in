import { useState, useEffect } from "react";
import {
  fetchProperties,
  upsertProperty,
  deleteProperty,
  resolveImageUrl,
  type Property,
} from "@/lib/cms";
import { formatImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUploader from "./ImageUploader";
import VideoUploader from "./VideoUploader";
import { Switch } from "@/components/ui/switch";
import SliderManager from "./SliderManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  MapPin,
  Loader2,
  Building2,
  Video,
  X,
  FileText,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyProperty: Partial<Property> = {
  title: "",
  location: "",
  price: "",
  area: "",
  type: "Office",
  category: "office",
  image_url: null,
  video_url: null,
  description: null,
  features: [],
  is_featured: false,
  sort_order: 0,
  display_location: "our_spaces",
};

export default function OurSpacesManager() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Property>>(emptyProperty);

  const load = async () => {
    setLoading(true);
    const { data } = await fetchProperties();
    // Only show properties assigned to our_spaces
    const filtered = (data || []).filter((p) => p.features?.includes("our_spaces") || p.display_location === "our_spaces");
    setProperties(filtered);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleLocation = (location: 'homepage' | 'our_spaces' | 'gallery') => {
    const current = editItem.display_location ? editItem.display_location.split(',') : [];
    let updated: string[];
    if (current.includes(location)) {
      updated = current.filter((l) => l !== location);
    } else {
      updated = [...current, location];
    }
    setEditItem({
      ...editItem,
      display_location: updated.join(',') || 'none'
    });
  };

  const handleSave = async () => {
    if (!editItem.title || !editItem.location) {
      toast({ title: "Please fill required fields (Title and Location)", variant: "destructive" });
      return;
    }
    setSaving(true);

    const currentLocations = editItem.display_location ? editItem.display_location.split(',') : [];
    
    // Choose a singular display_location that satisfies the check constraint ('homepage' | 'our_spaces' | 'none')
    let dbDisplayLocation: 'homepage' | 'our_spaces' | 'none' = 'none';
    if (currentLocations.includes('homepage')) {
      dbDisplayLocation = 'homepage';
    } else if (currentLocations.includes('our_spaces')) {
      dbDisplayLocation = 'our_spaces';
    }

    // Fill in default values for other database non-null columns if empty
    const payload = {
      ...editItem,
      price: editItem.price || "",
      area: editItem.area || "",
      category: editItem.category || "office",
      features: currentLocations, // Store display locations in features column
      display_location: dbDisplayLocation
    };
    const { error } = await upsertProperty(payload);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editItem.id ? "Space updated!" : "Space added!" });
      setDialogOpen(false);
      setEditItem(emptyProperty);
      load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this space?")) return;
    const { error } = await deleteProperty(id);
    if (!error) {
      toast({ title: "Space deleted" });
      load();
    }
  };

  const openEdit = (p: Property) => {
    // If features contains locations, use features as display_location, else fallback to p.display_location
    const currentLocs = p.features && p.features.length > 0 ? p.features : [p.display_location || "our_spaces"];
    setEditItem({
      ...p,
      features: p.features || [],
      display_location: currentLocs.filter(l => ['homepage', 'our_spaces', 'gallery'].includes(l)).join(',')
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditItem({ ...emptyProperty, sort_order: properties.length + 1, display_location: "our_spaces" });
    setDialogOpen(true);
  };

  // Swap sort order of two properties
  const swapOrder = async (index: number, direction: "up" | "down") => {
    const sorted = [...properties];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const currentItem = sorted[index];
    const targetItem = sorted[targetIndex];
    const tempOrder = currentItem.sort_order;

    await upsertProperty({ id: currentItem.id, sort_order: targetItem.sort_order });
    await upsertProperty({ id: targetItem.id, sort_order: tempOrder });
    load();
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
      {/* Slider Images Section */}
      <SliderManager
        pageKey="our_spaces_slides"
        title="Our Spaces"
        description="Manage the hero slider images shown at the top of the Our Spaces page."
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Our Spaces</h2>
          <p className="text-sm text-muted-foreground">{properties.length} spaces on the Our Spaces page</p>
        </div>
        <Button onClick={openNew} className="gold-gradient text-primary-foreground gap-2">
          <Plus size={16} /> Add Space
        </Button>
      </div>

      {/* Spaces List - Ordered */}
      <div className="space-y-2">
        {properties.map((p, index) => (
          <div key={p.id} className="glass rounded-xl overflow-hidden group flex">
            {/* Order & Arrows */}
            <div className="flex flex-col items-center justify-center px-3 py-4 border-r border-border/20 bg-secondary/10 gap-1 min-w-[56px]">
              <button
                onClick={() => swapOrder(index, "up")}
                disabled={index === 0}
                className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowUp size={14} />
              </button>
              <span className="text-xs font-bold text-primary/80 tabular-nums">{p.sort_order}</span>
              <button
                onClick={() => swapOrder(index, "down")}
                disabled={index === properties.length - 1}
                className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowDown size={14} />
              </button>
            </div>

            {/* Thumbnail */}
            <div className="relative w-36 h-28 flex-shrink-0">
              {resolveImageUrl(p.image_url) ? (
                <img src={resolveImageUrl(p.image_url)!} alt={p.title} className="w-full h-full object-cover" />
              ) : p.video_url ? (
                <div className="w-full h-full bg-blue-950/30 flex items-center justify-center">
                  <Video size={28} className="text-blue-400/60" />
                </div>
              ) : (
                <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                  <Building2 size={24} className="text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                {p.type && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold gold-gradient text-primary-foreground">
                    {p.type}
                  </span>
                )}
                {p.video_url && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Video size={10} className="inline mr-0.5 -mt-0.5" /> Video
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                <MapPin size={10} className="text-primary flex-shrink-0" />
                <span className="truncate">{p.location}</span>
              </div>
              {/* Price & Area preview */}
              {(p.price || p.area) && (
                <div className="flex gap-3 text-xs mb-2">
                  {p.price && <span className="gold-text font-bold">{p.price}</span>}
                  {p.area && <span className="text-muted-foreground">{p.area}</span>}
                </div>
              )}
              {/* Display Locations */}
              <div className="flex flex-wrap gap-1">
                {(p.features?.includes('homepage') || p.display_location === 'homepage') && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary border border-primary/30">
                    Homepage
                  </span>
                )}
                {(p.features?.includes('our_spaces') || p.display_location === 'our_spaces') && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Our Spaces
                  </span>
                )}
                {p.features?.includes('gallery') && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Gallery
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/20 text-foreground transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-destructive/20 hover:bg-destructive text-destructive-foreground transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {properties.length === 0 && (
          <div className="text-center py-16 text-muted-foreground/60">
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p>No spaces added yet. Click "Add Space" to get started.</p>
          </div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editItem.id ? "Edit Space" : "Add New Space"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* ── Image Upload + URL ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <ImageIcon size={14} className="text-primary" /> Space Image
              </label>
              <ImageUploader
                bucket="hero-images"
                currentUrl={editItem.image_url || null}
                onUpload={(url) => setEditItem({ ...editItem, image_url: url })}
                onRemove={() => setEditItem({ ...editItem, image_url: null })}
                label=""
              />
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-border/40" />
                <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">or paste URL</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <Input
                value={editItem.image_url || ""}
                onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value || null })}
                placeholder="https://example.com/space-image.jpg"
                className="bg-secondary/50 border-border/40"
              />
            </div>

            {/* ── Video Upload + URL ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Video size={14} className="text-blue-400" /> Space Video
              </label>
              <VideoUploader
                bucket="hero-images"
                currentUrl={editItem.video_url || null}
                onUpload={(url) => setEditItem({ ...editItem, video_url: url })}
                onRemove={() => setEditItem({ ...editItem, video_url: null })}
              />
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-border/40" />
                <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">or paste URL</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <Input
                value={editItem.video_url || ""}
                onChange={(e) => setEditItem({ ...editItem, video_url: e.target.value || null })}
                placeholder="https://www.youtube.com/watch?v=... or direct video link"
                className="bg-secondary/50 border-border/40"
              />
              <p className="text-[11px] text-muted-foreground/60">YouTube URL or direct video file (MP4, MOV, WebM)</p>
            </div>

            {/* ── Name / Title ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Space Name / Title *</label>
              <Input
                value={editItem.title || ""}
                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                placeholder="Executive Office Suite"
                className="bg-secondary/50 border-border/40"
              />
            </div>

            {/* ── Description ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <FileText size={14} /> Description (optional)
              </label>
              <textarea
                value={editItem.description || ""}
                onChange={(e) => setEditItem({ ...editItem, description: e.target.value || null })}
                placeholder="Describe the space — amenities, location benefits, special features..."
                rows={3}
                className="w-full rounded-lg bg-secondary/50 border border-border/40 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {/* ── Location ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Location *</label>
              <Input
                value={editItem.location || ""}
                onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                placeholder="Harsha City Mall, Floor 5"
                className="bg-secondary/50 border-border/40"
              />
            </div>

            {/* ── Type ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Type (optional)</label>
              <Input
                value={editItem.type || ""}
                onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                placeholder="Premium, Flexible, Corporate..."
                className="bg-secondary/50 border-border/40"
              />
            </div>

            {/* ── Rate / Price & Area / Sq Ft ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Rate / Price (optional)</label>
                <Input
                  value={editItem.price || ""}
                  onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                  placeholder="e.g. ₹55,000/mo"
                  className="bg-secondary/50 border-border/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Area / Square Ft (optional)</label>
                <Input
                  value={editItem.area || ""}
                  onChange={(e) => setEditItem({ ...editItem, area: e.target.value })}
                  placeholder="e.g. 1,500 sq ft"
                  className="bg-secondary/50 border-border/40"
                />
              </div>
            </div>

            {/* ── Display Order ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <GripVertical size={14} /> Display Order
              </label>
              <Input
                type="number"
                value={editItem.sort_order || 0}
                onChange={(e) => setEditItem({ ...editItem, sort_order: Number(e.target.value) })}
                className="bg-secondary/50 border-border/40"
              />
              <p className="text-[11px] text-muted-foreground/60">
                Lower numbers appear first (1, 2, 3...)
              </p>
            </div>

            {/* ── Display Locations Toggles ── */}
            <div className="space-y-3 pt-2 border-t border-border/20">
              <label className="text-sm font-semibold text-muted-foreground">Display Locations</label>
              
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-secondary/20 border border-border/20">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Show on Homepage</label>
                    <p className="text-xs text-muted-foreground">Display in the Featured section on the home page</p>
                  </div>
                  <Switch
                    checked={editItem.display_location?.split(',').includes('homepage') || false}
                    onCheckedChange={() => toggleLocation('homepage')}
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/10">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Show in Our Spaces</label>
                    <p className="text-xs text-muted-foreground">Display on the "Our Spaces" page list</p>
                  </div>
                  <Switch
                    checked={editItem.display_location?.split(',').includes('our_spaces') || false}
                    onCheckedChange={() => toggleLocation('our_spaces')}
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/10">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Show in Gallery</label>
                    <p className="text-xs text-muted-foreground">Display image/video in the "Gallery" page</p>
                  </div>
                  <Switch
                    checked={editItem.display_location?.split(',').includes('gallery') || false}
                    onCheckedChange={() => toggleLocation('gallery')}
                  />
                </div>
              </div>
            </div>

            {/* ── Save Button ── */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full gold-gradient text-primary-foreground font-semibold h-11 gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Space"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
