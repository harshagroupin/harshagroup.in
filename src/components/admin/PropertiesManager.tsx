import { useState, useEffect } from "react";
import {
  fetchProperties,
  upsertProperty,
  deleteProperty,
  type Property,
} from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  Star,
  Video,
  X,
  Tag,
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
  display_location: "homepage",
};

export default function PropertiesManager() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Property>>(emptyProperty);
  const [newFeature, setNewFeature] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await fetchProperties();
    // Only show properties assigned to homepage
    const filtered = (data || []).filter((p) => p.display_location === "homepage" || !p.display_location);
    setProperties(filtered);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editItem.title || !editItem.location || !editItem.price) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    // Always set display_location to homepage for items from this manager
    const payload = { ...editItem, display_location: "homepage" as const };
    const { error } = await upsertProperty(payload);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editItem.id ? "Property updated!" : "Property added!" });
      setDialogOpen(false);
      setEditItem(emptyProperty);
      load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    const { error } = await deleteProperty(id);
    if (!error) {
      toast({ title: "Property deleted" });
      load();
    }
  };

  const openEdit = (p: Property) => {
    setEditItem({ ...p, features: p.features || [], display_location: p.display_location || "both" });
    setNewFeature("");
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditItem({ ...emptyProperty, sort_order: properties.length + 1 });
    setNewFeature("");
    setDialogOpen(true);
  };

  const addFeature = () => {
    const trimmed = newFeature.trim();
    if (!trimmed) return;
    const current = editItem.features || [];
    if (current.includes(trimmed)) return;
    setEditItem({ ...editItem, features: [...current, trimmed] });
    setNewFeature("");
  };

  const removeFeature = (feature: string) => {
    setEditItem({
      ...editItem,
      features: (editItem.features || []).filter((f) => f !== feature),
    });
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Properties</h2>
          <p className="text-sm text-muted-foreground">{properties.length} properties on Homepage</p>
        </div>
        <Button onClick={openNew} className="gold-gradient text-primary-foreground gap-2">
          <Plus size={16} /> Add Property
        </Button>
      </div>

      {/* Property List - Ordered */}
      <div className="space-y-2">
        {properties.map((p, index) => {
          return (
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
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
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
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold gold-gradient text-primary-foreground">
                    {p.type}
                  </span>
                  {p.is_featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                      <Star size={10} className="inline mr-0.5 -mt-0.5" /> Featured
                    </span>
                  )}
                  {p.video_url && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Video size={10} className="inline mr-0.5 -mt-0.5" /> Video
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                  <MapPin size={10} className="text-primary" />
                  <span className="truncate">{p.location}</span>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="gold-text font-bold">{p.price}</span>
                  <span className="text-muted-foreground">{p.area}</span>
                </div>
                {/* Features tags preview */}
                {p.features && p.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {p.features.slice(0, 4).map((f) => (
                      <span key={f} className="px-1.5 py-0.5 rounded text-[9px] bg-secondary/50 text-muted-foreground border border-border/30">
                        {f}
                      </span>
                    ))}
                    {p.features.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] text-muted-foreground/60">
                        +{p.features.length - 4} more
                      </span>
                    )}
                  </div>
                )}
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
          );
        })}

        {properties.length === 0 && (
          <div className="text-center py-16 text-muted-foreground/60">
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p>No properties yet. Click "Add Property" to get started.</p>
          </div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editItem.id ? "Edit Property" : "Add New Property"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* ── Image URL ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <ImageIcon size={14} className="text-primary" /> Image URL
              </label>
              <Input
                value={editItem.image_url || ""}
                onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value || null })}
                placeholder="https://example.com/property-image.jpg"
                className="bg-secondary/50 border-border/40"
              />
              {editItem.image_url && (
                <div className="relative group rounded-xl overflow-hidden border border-border/30 bg-secondary/30">
                  <img src={editItem.image_url} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    onClick={() => setEditItem({ ...editItem, image_url: null })}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground/60">Paste direct image URL link</p>
            </div>

            {/* ── Video URL ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Video size={14} className="text-blue-400" /> Video URL
              </label>
              <Input
                value={editItem.video_url || ""}
                onChange={(e) => setEditItem({ ...editItem, video_url: e.target.value || null })}
                placeholder="https://www.youtube.com/watch?v=... or direct video link"
                className="bg-secondary/50 border-border/40"
              />
              <p className="text-[11px] text-muted-foreground/60">Paste YouTube URL or direct video file URL</p>
            </div>

            {/* ── Name / Title ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Property Name / Title *</label>
              <Input
                value={editItem.title || ""}
                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                placeholder="Premium Office Suite A"
                className="bg-secondary/50 border-border/40"
              />
            </div>

            {/* ── Description ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <FileText size={14} /> Description
              </label>
              <textarea
                value={editItem.description || ""}
                onChange={(e) => setEditItem({ ...editItem, description: e.target.value || null })}
                placeholder="Describe the property — amenities, location benefits, special features..."
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
                placeholder="Harsha City Mall, Indirapuram"
                className="bg-secondary/50 border-border/40"
              />
            </div>

            {/* ── Price & Area ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Price *</label>
                <Input
                  value={editItem.price || ""}
                  onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                  placeholder="₹45,000/mo"
                  className="bg-secondary/50 border-border/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Area</label>
                <Input
                  value={editItem.area || ""}
                  onChange={(e) => setEditItem({ ...editItem, area: e.target.value })}
                  placeholder="1,200 sq ft"
                  className="bg-secondary/50 border-border/40"
                />
              </div>
            </div>

            {/* ── Type & Category ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Type</label>
                <Input
                  value={editItem.type || ""}
                  onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                  placeholder="Office, Shop, Sale, Lease..."
                  className="bg-secondary/50 border-border/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Category</label>
                <Select
                  value={editItem.category || "office"}
                  onValueChange={(v) => setEditItem({ ...editItem, category: v as 'office' | 'shop' })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="shop">Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Features / Amenities ── */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Tag size={14} className="text-primary" /> Features / Amenities
              </label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  placeholder="e.g. Parking, AC, Lift, CCTV..."
                  className="bg-secondary/50 border-border/40 flex-1"
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10 px-3"
                >
                  <Plus size={14} />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground/60">Press Enter or click + to add. Click ✕ to remove.</p>

              {/* Feature Tags */}
              {(editItem.features || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-3 rounded-lg bg-secondary/20 border border-border/20">
                  {(editItem.features || []).map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {f}
                      <button
                        onClick={() => removeFeature(f)}
                        className="ml-0.5 hover:text-destructive transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Sort Order & Featured ── */}
            <div className="grid grid-cols-2 gap-4 items-end">
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
              <div className="flex items-center gap-3 pb-1">
                <Switch
                  checked={editItem.is_featured || false}
                  onCheckedChange={(v) => setEditItem({ ...editItem, is_featured: v })}
                />
                <label className="text-sm text-muted-foreground">Featured on homepage</label>
              </div>
            </div>

            {/* ── Save Button ── */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full gold-gradient text-primary-foreground font-semibold h-11 gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Property"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
