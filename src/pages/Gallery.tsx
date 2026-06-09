import { useState, useEffect, useCallback } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedBackground from "@/components/AnimatedBackground";
import { X, Play, Loader2, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchGalleryImages, fetchProperties, fetchPageContent, type GalleryImage, type Property, resolveImageUrl } from "@/lib/cms";
import useEmblaCarousel from "embla-carousel-react";

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
  { src: heroImg, alt: "Harsha City Mall luxury interior — premium commercial space" },
  { src: officeImg1, alt: "Premium office space with modern amenities at Harsha City Mall" },
  { src: shopImg1, alt: "Retail outlet on ground floor of Harsha City Mall" },
  { src: buildingImg, alt: "Harsha City Mall building exterior in Indirapuram" },
  { src: officeImg2, alt: "Co-working space with contemporary design" },
  { src: shopImg2, alt: "Food court area with high footfall at Harsha Mall" },
  { src: galleryImg1, alt: "Conference room with professional setup" },
  { src: galleryImg2, alt: "Mall escalators and modern architecture" },
];

// Hero slider images (best shots from fallback)
const heroSlides = [
  { src: heroImg, caption: "Premium commercial spaces at Harsha City Mall, Indirapuram" },
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [cmsSlides, setCmsSlides] = useState<string[] | null>(null);

  // Embla for hero slider
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveSlide(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    fetchPageContent("gallery_slides").then(({ data }) => {
      if (data?.content && Array.isArray(data.content) && data.content.length > 0) {
        setCmsSlides(data.content as string[]);
      }
    });
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
    <main>
      <SEOHead
        title="Gallery — Harsha Group Commercial Property Photos & Videos"
        description="Explore photos and videos of Harsha Group's premium commercial properties in Indirapuram, Ghaziabad. View our office spaces, retail outlets, mall interiors, and building exteriors."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": "Harsha Group Property Gallery",
          "description": "Photos and videos of premium commercial properties by Harsha Group in Indirapuram, Ghaziabad.",
          "url": "https://harshagroup.in/gallery",
          "isPartOf": { "@id": "https://harshagroup.in/#website" },
        }}
      />

      {/* Hero Slider */}
      <section className="relative h-[50vh] min-h-[360px] flex items-center justify-center overflow-hidden" aria-label="Gallery hero">
        <div className="absolute inset-0" ref={emblaRef}>
          <div className="flex h-full">
            {(cmsSlides
              ? cmsSlides.map((url, i) => ({ src: url, caption: `Harsha Group property gallery image ${i + 1}` }))
              : heroSlides
            ).map((slide, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
                <img
                  src={slide.src}
                  alt={slide.caption}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none" />
        <AnimatedBackground />

        {/* Arrows — only when multiple slides */}
        {(cmsSlides || heroSlides).length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Title */}
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-white">
            Our <span className="gold-text">Gallery</span>
          </h1>
          <p className="text-white/80 text-lg">A glimpse into our premium commercial spaces and developments.</p>
        </div>

        {/* Dot indicators — only when multiple slides */}
        {(cmsSlides || heroSlides).length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {(cmsSlides || heroSlides).map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "bg-primary w-6" : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      <Breadcrumb items={[{ label: "Gallery" }]} />

      {/* Gallery Grid */}
      <section className="section-padding" aria-label="Property gallery">
        <div className="max-w-7xl mx-auto">
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
                            <img src={getYoutubeThumbnail(item.video_url)!} alt={item.alt_text || "Harsha Group property video"} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                          alt={item.alt_text || "Harsha Group commercial property"}
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
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-10">
                      <p className="text-white font-serif font-semibold text-sm group-hover:text-primary transition-colors">{img.alt}</p>
                    </div>
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground font-medium bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-xs">View</span>
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
          role="dialog"
          aria-label="Image lightbox"
        >
          <button className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors" onClick={() => setLightbox(null)} aria-label="Close lightbox">
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
                              title={item.alt_text || "Harsha Group property video"}
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
                        alt={item.alt_text || "Harsha Group property image"}
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
