import { useState, useEffect, useCallback } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedBackground from "@/components/AnimatedBackground";
import { X, Play, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchGalleryImages, fetchProperties, fetchPageContent, type GalleryImage, resolveImageUrl } from "@/lib/cms";
import { formatImageUrl } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";

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
  const [activeSlide, setActiveSlide] = useState(0);
  const [cmsSlides, setCmsSlides] = useState<string[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const slideItems = cmsSlides.map((url, index) => ({
    src: formatImageUrl(url),
    caption: `Harsha Group property gallery image ${index + 1}`,
  }));

  useEffect(() => {
    if (!emblaApi || slideItems.length < 2) return;
    const onSelect = () => setActiveSlide(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, slideItems.length]);

  useEffect(() => {
    Promise.all([
      fetchPageContent("gallery_slides"),
      fetchGalleryImages(),
      fetchProperties(),
    ]).then(([slidesRes, galleryRes, propsRes]) => {
      const slideContent = slidesRes.data?.content;
      if (Array.isArray(slideContent)) {
        setCmsSlides(slideContent.filter(Boolean) as string[]);
      }

      let items: GalleryImage[] = [];
      if (galleryRes.data) {
        items = [...galleryRes.data];
      }
      if (propsRes.data) {
        const galleryProperties = propsRes.data
          .filter(
            (property) =>
              property.features?.includes("gallery") ||
              property.display_location?.split(",").includes("gallery")
          )
          .map((property) => ({
            id: property.id,
            image_url: property.image_url || "",
            video_url: property.video_url,
            media_type: (property.video_url ? "video" : "image") as "image" | "video",
            alt_text: property.title,
            sort_order: property.sort_order,
          }));
        items = [...items, ...galleryProperties];
      }

      items.sort((a, b) => a.sort_order - b.sort_order);
      setCmsItems(items);
    }).catch(() => {
      setCmsItems([]);
    });
  }, []);

  const lightboxItem = lightbox !== null && cmsItems ? cmsItems[lightbox] : null;

  return (
    <main>
      <SEOHead
        title="Gallery - Harsha Group Commercial Property Photos & Videos"
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

      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden" aria-label="Gallery hero">
        {slideItems.length > 0 ? (
          <div className="absolute inset-0" ref={emblaRef}>
            <div className="flex h-full">
              {slideItems.map((slide, index) => (
                <div key={`${slide.src}-${index}`} className="flex-[0_0_100%] min-w-0 relative h-full">
                  <img
                    src={slide.src}
                    alt={slide.caption}
                    className="w-full h-full object-cover object-bottom"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(145deg,#111113_0%,#181611_50%,#09090b_100%)]">
            <div className="absolute inset-0 dot-grid opacity-[0.035]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80 pointer-events-none" />
        <AnimatedBackground />

        {slideItems.length > 1 && (
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

        <div className="relative z-10 text-center px-4 pt-16 md:pt-20">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-white">
            Our <span className="gold-text">Gallery</span>
          </h1>
          <p className="text-white/80 text-lg">A glimpse into our premium commercial spaces and developments.</p>
        </div>

        {slideItems.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slideItems.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeSlide ? "bg-primary w-6" : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      <Breadcrumb items={[{ label: "Gallery" }]} />

      <section className="section-padding" aria-label="Property gallery">
        <div className="max-w-7xl mx-auto">
          {cmsItems !== null ? (
            cmsItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cmsItems.map((item, index) => (
                  <ScrollReveal key={item.id} delay={index * 0.05}>
                    <button
                      type="button"
                      className="relative overflow-hidden rounded-lg cursor-pointer group aspect-[4/3] border border-border/20 shadow-md text-left w-full"
                      onClick={() => setLightbox(index)}
                    >
                      {item.media_type === "video" && item.video_url ? (
                        <>
                          {getYoutubeThumbnail(item.video_url) ? (
                            <img
                              src={getYoutubeThumbnail(item.video_url)!}
                              alt={item.alt_text || "Harsha Group property video"}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-secondary/40 flex items-center justify-center">
                              <Play size={40} className="text-primary/50" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 px-2 py-1 rounded-sm text-[10px] font-bold bg-black/70 text-white flex items-center gap-1 z-10">
                            <Play size={10} className="fill-current" /> Video
                          </div>
                        </>
                      ) : (
                        <img
                          src={resolveImageUrl(item.image_url) || ""}
                          alt={item.alt_text || "Harsha Group commercial property"}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}

                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-10 flex flex-col justify-end">
                        <p className="text-white font-serif font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {item.alt_text || "Harsha Group"}
                        </p>
                      </div>
                    </button>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground bg-secondary/20 rounded-lg border border-border/40">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No gallery images currently listed.</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="aspect-[4/3] rounded-lg bg-card/60 border border-border/30 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxItem && (
        <div
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-label="Media lightbox"
        >
          <button className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors" onClick={() => setLightbox(null)} aria-label="Close lightbox">
            <X size={32} />
          </button>

          <div className="flex flex-col items-center max-w-4xl w-full" onClick={(event) => event.stopPropagation()}>
            {lightboxItem.media_type === "video" && lightboxItem.video_url ? (
              (() => {
                const youtubeId = getYoutubeId(lightboxItem.video_url);
                if (youtubeId) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                      className="w-full aspect-video rounded-lg animate-fade-up border border-border/20 shadow-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lightboxItem.alt_text || "Harsha Group property video"}
                    />
                  );
                }
                return (
                  <video
                    src={lightboxItem.video_url}
                    className="max-w-full max-h-[75vh] rounded-lg animate-fade-up border border-border/20 shadow-2xl"
                    controls
                    autoPlay
                  />
                );
              })()
            ) : (
              <img
                src={resolveImageUrl(lightboxItem.image_url) || ""}
                alt={lightboxItem.alt_text || "Harsha Group property image"}
                className="max-w-full max-h-[75vh] object-contain rounded-lg animate-fade-up border border-border/20 shadow-2xl"
              />
            )}
            <div className="mt-4 text-center">
              <h4 className="text-white text-lg font-serif font-semibold tracking-wide">
                {lightboxItem.alt_text || "Harsha Group"}
              </h4>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
