import { useState, useEffect } from "react";
import {
  fetchGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  fetchProperties,
  type GalleryImage,
  type Property,
  resolveImageUrl,
} from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUploader from "./ImageUploader";
import VideoUploader from "./VideoUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  ImageIcon,
  Save,
  Video,
  X,
  ArrowUp,
  ArrowDown,
  Film,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SliderManager from "./SliderManager";

export default function GalleryManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<(GalleryImage & { is_property?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editItem, setEditItem] = useState<Partial<GalleryImage>>({});
  const [newItem, setNewItem] = useState<Partial<GalleryImage>>({
    image_url: "",
    video_url: null,
    media_type: "image",
    alt_text: "",
    sort_order: 0,
  });

  const load = async () => {
    setLoading(true);
    const [galleryRes, propsRes] = await Promise.all([
      fetchGalleryImages(),
      fetchProperties()
    ]);
    
    let combinedItems: (GalleryImage & { is_property?: boolean })[] = [];
    if (galleryRes.data) {
      combinedItems = [...galleryRes.data];
    }
    
    if (propsRes.data) {
      const galleryProperties = propsRes.data
        .filter((p) => p.features?.includes("gallery") || p.display_location?.split(',').includes("gallery"))
        .map((p) => ({
          id: p.id,
          image_url: p.image_url || "",
          video_url: p.video_url,
          media_type: (p.video_url ? "video" : "image") as 'image' | 'video',
          alt_text: p.title,
          sort_order: p.sort_order,
          is_property: true
        }));
      combinedItems = [...combinedItems, ...galleryProperties];
    }
    
    combinedItems.sort((a, b) => a.sort_order - b.sort_order);
    setItems(combinedItems);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    const url = newItem.media_type === "video" ? newItem.video_url : newItem.image_url;
    if (!url) {
      toast({ title: "Please provide a URL", variant: "destructive" });
      return;
    }
    setSaving(true);
    await addGalleryImage({
      image_url: newItem.image_url || "",
      video_url: newItem.video_url || null,
      media_type: newItem.media_type || "image",
      alt_text: newItem.alt_text || "",
      sort_order: newItem.sort_order || items.length + 1,
    });
    toast({ title: `${newItem.media_type === "video" ? "Video" : "Image"} added!` });
    setAddDialog(false);
    setNewItem({ image_url: "", video_url: null, media_type: "image", alt_text: "", sort_order: 0 });
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    await deleteGalleryImage(id);
    toast({ title: "Item deleted" });
    load();
  };

  const handleUpdate = async () => {
    if (!editItem.id) return;
    setSaving(true);
    await updateGalleryImage(editItem.id, {
      image_url: editItem.image_url,
      video_url: editItem.video_url,
      media_type: editItem.media_type,
      alt_text: editItem.alt_text,
      sort_order: editItem.sort_order,
    });
    toast({ title: "Item updated" });
    setEditDialog(false);
    setSaving(false);
    load();
  };

  // Swap sort order
  const swapOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const a = items[index];
    const b = items[targetIndex];
    await updateGalleryImage(a.id, { sort_order: b.sort_order });
    await updateGalleryImage(b.id, { sort_order: a.sort_order });
    load();
  };

  // YouTube thumbnail helper
  const getYoutubeThumbnail = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
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
        pageKey="gallery_slides"
        title="Gallery"
        description="Manage the hero slider images shown at the top of the Gallery page."
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Gallery</h2>
          <p className="text-sm text-muted-foreground">{items.length} items (images & videos)</p>
        </div>
        <Button onClick={() => { setNewItem({ image_url: "", video_url: null, media_type: "image", alt_text: "", sort_order: items.length + 1 }); setAddDialog(true); }} className="gold-gradient text-primary-foreground gap-2">
          <Plus size={16} /> Add Item
        </Button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-16 text-muted-foreground/60">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p>No gallery items yet. Click "Add Item" to add images or videos.</p>
        </div>
      )}

      {/* Gallery List */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="glass rounded-xl overflow-hidden group flex">
            {/* Order & Arrows */}
            <div className="flex flex-col items-center justify-center px-3 py-3 border-r border-border/20 bg-secondary/10 gap-1 min-w-[50px]">
              <button
                onClick={() => swapOrder(index, "up")}
                disabled={index === 0 || item.is_property}
                className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowUp size={12} />
              </button>
              <span className="text-xs font-bold text-primary/80 tabular-nums">{item.sort_order}</span>
              <button
                onClick={() => swapOrder(index, "down")}
                disabled={index === items.length - 1 || item.is_property}
                className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowDown size={12} />
              </button>
            </div>

            {/* Thumbnail */}
            <div className="relative w-32 h-24 flex-shrink-0">
              {item.media_type === "video" ? (
                <>
                  {item.video_url && getYoutubeThumbnail(item.video_url) ? (
                    <img src={getYoutubeThumbnail(item.video_url!)!} alt={item.alt_text} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-950/30 flex items-center justify-center">
                      <Film size={24} className="text-blue-400/60" />
                    </div>
                  )}
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600/80 text-white flex items-center gap-0.5">
                    <Video size={8} /> Video
                  </div>
                </>
              ) : item.image_url ? (
                <img src={resolveImageUrl(item.image_url) || ""} alt={item.alt_text} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                  <ImageIcon size={20} className="text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.media_type === "video" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                  {item.media_type === "video" ? "Video" : "Image"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/80 text-muted-foreground border border-border/40">
                  Order Position: {item.sort_order}
                </span>
                {item.is_property && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Linked to Property
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{item.alt_text || "No description"}</p>
              <p className="text-[10px] text-muted-foreground/50 truncate mt-0.5">
                {item.media_type === "video" ? item.video_url : item.image_url}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.is_property ? (
                <span className="text-[10px] text-muted-foreground/60 italic px-2">
                  Edit in Properties
                </span>
              ) : (
                <>
                  <button onClick={() => { setEditItem(item); setEditDialog(true); }} className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/20 text-foreground transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-destructive/20 hover:bg-destructive text-destructive-foreground transition-colors">
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif">Add Gallery Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Media Type Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-border/40">
              <button
                type="button"
                onClick={() => setNewItem({ ...newItem, media_type: "image", video_url: null })}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
                  newItem.media_type === "image"
                    ? "gold-gradient text-primary-foreground"
                    : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImageIcon size={15} /> Image
              </button>
              <button
                type="button"
                onClick={() => setNewItem({ ...newItem, media_type: "video", image_url: "" })}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
                  newItem.media_type === "video"
                    ? "bg-blue-600 text-white"
                    : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Video size={15} /> Video
              </button>
            </div>

            {/* URL Input */}
            {newItem.media_type === "image" ? (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-primary" /> Image
                </label>
                <ImageUploader
                  bucket="hero-images"
                  currentUrl={newItem.image_url || null}
                  onUpload={(url) => setNewItem({ ...newItem, image_url: url })}
                  onRemove={() => setNewItem({ ...newItem, image_url: "" })}
                  label=""
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">or paste URL</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                <Input
                  value={newItem.image_url || ""}
                  onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-secondary/50 border-border/40"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Video size={14} className="text-blue-400" /> Video
                </label>
                <VideoUploader
                  bucket="hero-images"
                  currentUrl={newItem.video_url || null}
                  onUpload={(url) => setNewItem({ ...newItem, video_url: url, media_type: "video" })}
                  onRemove={() => setNewItem({ ...newItem, video_url: null })}
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">or paste URL</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                <Input
                  value={newItem.video_url || ""}
                  onChange={(e) => setNewItem({ ...newItem, video_url: e.target.value || null })}
                  placeholder="https://www.youtube.com/watch?v=... or direct video link"
                  className="bg-secondary/50 border-border/40"
                />
                {newItem.video_url && getYoutubeThumbnail(newItem.video_url) && (
                  <div className="relative rounded-xl overflow-hidden border border-border/30">
                    <img src={getYoutubeThumbnail(newItem.video_url)!} alt="Video thumbnail" className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                      <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
                        <Film size={20} className="text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Alt Text */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Description / Alt Text</label>
              <Input
                value={newItem.alt_text || ""}
                onChange={(e) => setNewItem({ ...newItem, alt_text: e.target.value })}
                placeholder="Describe the image or video..."
                className="bg-secondary/50 border-border/40"
              />
            </div>

            <Button onClick={handleAdd} disabled={saving} className="w-full gold-gradient text-primary-foreground gap-2">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Saving..." : "Add to Gallery"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Gallery Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Preview */}
            {editItem.media_type === "video" ? (
              editItem.video_url && getYoutubeThumbnail(editItem.video_url) ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={getYoutubeThumbnail(editItem.video_url)!} alt="" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <Film size={20} className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-40 rounded-xl bg-blue-950/20 flex items-center justify-center border border-border/30">
                  <Video size={32} className="text-blue-400/40" />
                </div>
              )
            ) : editItem.image_url ? (
              <img src={resolveImageUrl(editItem.image_url) || ""} alt="" className="w-full h-40 object-cover rounded-xl" />
            ) : null}

            {/* URL field */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {editItem.media_type === "video" ? "Video URL" : "Image"}
              </label>
              {editItem.media_type === "image" ? (
                <>
                  <ImageUploader
                    bucket="hero-images"
                    currentUrl={editItem.image_url || null}
                    onUpload={(url) => setEditItem({ ...editItem, image_url: url })}
                    onRemove={() => setEditItem({ ...editItem, image_url: "" })}
                    label=""
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-border/40" />
                    <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">or paste URL</span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>
                  <Input
                    value={editItem.image_url || ""}
                    onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })}
                    placeholder="Image URL..."
                    className="bg-secondary/50 border-border/40"
                  />
                </>
              ) : (
                <Input
                  value={editItem.video_url || ""}
                  onChange={(e) => setEditItem({ ...editItem, video_url: e.target.value || null })}
                  placeholder="Video URL..."
                  className="bg-secondary/50 border-border/40"
                />
              )}
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Description / Alt Text</label>
              <Input
                value={editItem.alt_text || ""}
                onChange={(e) => setEditItem({ ...editItem, alt_text: e.target.value })}
                placeholder="Describe the item..."
                className="bg-secondary/50 border-border/40"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Sort Order</label>
              <Input
                type="number"
                value={editItem.sort_order || 0}
                onChange={(e) => setEditItem({ ...editItem, sort_order: Number(e.target.value) })}
                className="bg-secondary/50 border-border/40"
              />
            </div>

            <Button onClick={handleUpdate} disabled={saving} className="w-full gold-gradient text-primary-foreground gap-2">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
