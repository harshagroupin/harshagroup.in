import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { X, Play, Loader2, ImageIcon } from "lucide-react";
import { fetchGalleryImages, fetchProperties, type GalleryImage, type Property, resolveImageUrl } from "@/lib/cms";

// Static fallback
import heroImg from "@/assets/hero-mall.jpg";
import officeImg1 from "@/assets/office-space-1.jpg";
import officeImg2 from "@/assets/office-space-2.jpg";
import shopImg1 from "@/assets/shop-space-1.jpg";
import shopImg2 from "@/assets/shop-space-2.jpg";
import buildingImg from "@/assets/building-exterior.jpg";
import galleryImg1 from "@/assets/gallery-1.jpg";
import galleryImg2 from "@/assets/gallery-2.jpg";

const fallbackImages = [
  { src: heroImg, alt: "Luxury mall interior" },
  { src: officeImg1, alt: "Premium office space" },
  { src: shopImg1, alt: "Retail outlet" },
  { src: buildingImg, alt: "Building exterior" },
  { src: officeImg2, alt: "Co-working space" },
  { src: shopImg2, alt: "Food court area" },
  { src: galleryImg1, alt: "Conference room" },
  { src: galleryImg2, alt: "Mall escalators" },
];

// YouTube helpers
const getYoutubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const getYoutubeThumbnail = (url: string): string | null => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [cmsItems, setCmsItems] = useState<GalleryImage[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGalleryImages(), fetchProperties()]).then(([galleryRes, propsRes]) => {
      let items: GalleryImage[] = [];
      if (galleryRes.data) {
        items = [...galleryRes.data];
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
          }));
        items = [...items, ...galleryProperties];
      }
      // Sort items by sort_order
      items.sort((a, b) => a.sort_order - b.sort_order);
      setCmsItems(items);
      setLoading(false);
    });
  }, []);

  return (
    <main className="pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                Our <span className="gold-text">Gallery</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A glimpse into our premium commercial spaces and developments.</p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : cmsItems !== null ? (
            cmsItems.length > 0 ? (
              /* CMS Gallery */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cmsItems.map((item, i) => (
                  <ScrollReveal key={item.id} delay={i * 0.05}>
                    <div
                      className="relative overflow-hidden rounded-xl cursor-pointer group aspect-[4/3] border border-border/20 shadow-md"
                      onClick={() => setLightbox(i)}
                    >
                      {item.media_type === "video" && item.video_url ? (
                        <>
                          {getYoutubeThumbnail(item.video_url) ? (
                            <img src={getYoutubeThumbnail(item.video_url)!} alt={item.alt_text} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full bg-blue-950/20 flex items-center justify-center">
                              <Play size={40} className="text-blue-400/40" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-600/80 text-white flex items-center gap-1 z-10">
                            <Play size={10} className="fill-current" /> Video
                          </div>
                        </>
                      ) : (
                        <img
                          src={resolveImageUrl(item.image_url) || ""}
                          alt={item.alt_text}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      
                      {/* Name Overlay at the bottom */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-10 flex flex-col justify-end">
                        <p className="text-white font-serif font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {item.alt_text || "Harsha Group"}
                        </p>
                      </div>

                      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/25 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground font-medium bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-xs">View</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground bg-secondary/20 rounded-xl border border-border/40">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No gallery images currently listed.</p>
              </div>
            )
          ) : (
            /* Fallback static gallery */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fallbackImages.map((img, i) => (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <div
                    className="relative overflow-hidden rounded-xl cursor-pointer group aspect-[4/3]"
                    onClick={() => setLightbox(i)}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground font-medium">View</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors" onClick={() => setLightbox(null)}>
            <X size={32} />
          </button>
          
          <div className="flex flex-col items-center max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {cmsItems !== null && cmsItems.length > 0 ? (
              (() => {
                const item = cmsItems[lightbox];
                return (
                  <>
                    {item.media_type === "video" && item.video_url ? (
                      (() => {
                        const ytId = getYoutubeId(item.video_url);
                        if (ytId) {
                          return (
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                              className="w-full aspect-video rounded-xl animate-fade-up border border-border/20 shadow-2xl"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={item.alt_text}
                            />
                          );
                        }
                        return (
                          <video
                            src={item.video_url}
                            className="max-w-full max-h-[75vh] rounded-xl animate-fade-up border border-border/20 shadow-2xl"
                            controls
                            autoPlay
                          />
                        );
                      })()
                    ) : (
                      <img
                        src={resolveImageUrl(item.image_url) || ""}
                        alt={item.alt_text}
                        className="max-w-full max-h-[75vh] object-contain rounded-xl animate-fade-up border border-border/20 shadow-2xl"
                      />
                    )}
                    {/* Caption at the bottom */}
                    <div className="mt-4 text-center">
                      <h4 className="text-white text-lg font-serif font-semibold tracking-wide">
                        {item.alt_text || "Harsha Group"}
                      </h4>
                    </div>
                  </>
                );
              })()
            ) : (
              <>
                <img
                  src={fallbackImages[lightbox].src}
                  alt={fallbackImages[lightbox].alt}
                  className="max-w-full max-h-[75vh] object-contain rounded-xl animate-fade-up border border-border/20 shadow-2xl"
                />
                <div className="mt-4 text-center">
                  <h4 className="text-white text-lg font-serif font-semibold tracking-wide">
                    {fallbackImages[lightbox].alt}
                  </h4>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
