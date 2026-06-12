import { useState, useEffect, useCallback } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import PropertyCard from "@/components/PropertyCard";
import ContactForm from "@/components/ContactForm";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedBackground from "@/components/AnimatedBackground";
import { fetchProperties, resolveImageUrl, fetchPageContent, type Property } from "@/lib/cms";
import { formatImageUrl } from "@/lib/utils";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export default function OurSpaces() {
  const [cmsProperties, setCmsProperties] = useState<Property[] | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cmsSlides, setCmsSlides] = useState<string[]>([]);
  const [enquiryMessage, setEnquiryMessage] = useState("");

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });

  const slideItems = cmsSlides.map((url, index) => ({
    src: formatImageUrl(url),
    caption: `Harsha Group commercial space showcase ${index + 1}`,
  }));

  const handleEnquire = (title: string, location: string) => {
    const msg = `I am interested in the property: ${title}${location ? ` (${location})` : ""}. Please contact me with more details.`;
    setEnquiryMessage(msg);
  };

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
      fetchPageContent("our_spaces_slides"),
      fetchProperties(),
    ]).then(([slidesRes, propsRes]) => {
      const slideContent = slidesRes.data?.content;
      if (Array.isArray(slideContent)) {
        setCmsSlides(slideContent.filter(Boolean) as string[]);
      }

      if (!propsRes.error) {
        const filtered = (propsRes.data || []).filter(
          (property) =>
            property.features?.includes("our_spaces") ||
            property.display_location?.split(",").includes("our_spaces")
        );
        setCmsProperties(filtered);
      }
    }).catch(() => {
      setCmsProperties([]);
    });
  }, []);

  return (
    <main>
      <SEOHead
        title="Our Spaces - Premium Shops, Offices & Mall Spaces in Indirapuram"
        description="Browse Harsha Group's premium commercial spaces for sale and lease in Indirapuram, Ghaziabad. Office suites, retail outlets, food court spaces, co-working hubs, and anchor store spaces at Harsha City Mall."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Our Spaces - Commercial Properties by Harsha Group",
          "description": "Premium shops, offices and mall spaces for sale and lease in Indirapuram, Ghaziabad.",
          "url": "https://harshagroup.in/our-spaces",
          "isPartOf": { "@id": "https://harshagroup.in/#website" },
        }}
      />

      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden" aria-label="Our spaces hero">
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
            Our <span className="gold-text">Spaces</span>
          </h1>
          <p className="text-white/80 text-lg">Premium offices, retail outlets and mall spaces curated for growth.</p>
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

      <Breadcrumb items={[{ label: "Our Spaces" }]} />

      <section className="section-padding" aria-label="Available commercial properties">
        <div className="max-w-7xl mx-auto">
          {cmsProperties !== null ? (
            cmsProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cmsProperties.map((property, index) => (
                  <ScrollReveal key={property.id} delay={index * 0.06}>
                    <PropertyCard
                      image={resolveImageUrl(property.image_url) || ""}
                      video={property.video_url}
                      title={property.title}
                      location={property.location}
                      price={property.price}
                      area={property.area}
                      type={property.type}
                      features={property.features}
                      onEnquire={handleEnquire}
                    />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground bg-secondary/20 rounded-lg border border-border/40">
                <Building2 size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No spaces currently listed.</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-border/30 bg-card/50 animate-pulse">
                  <div className="h-72 bg-secondary/40" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-secondary/60 rounded w-3/4" />
                    <div className="h-3 bg-secondary/40 rounded w-1/2" />
                    <div className="h-9 bg-secondary/40 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactForm initialMessage={enquiryMessage} />
    </main>
  );
}
