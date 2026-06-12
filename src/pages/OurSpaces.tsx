import { useState, useEffect, useCallback } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import PropertyCard from "@/components/PropertyCard";
import ContactForm from "@/components/ContactForm";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedBackground from "@/components/AnimatedBackground";
import { fetchProperties, resolveImageUrl, fetchPageContent, isSupabaseConfigured, type Property } from "@/lib/cms";
import { Building2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

// Hero slide images
import heroImg from "@/assets/hero-mall.jpg";
import officeImg1 from "@/assets/office-space-1.jpg";
import officeImg2 from "@/assets/office-space-2.jpg";
import galleryImg1 from "@/assets/gallery-1.jpg";
import galleryImg2 from "@/assets/gallery-2.jpg";
import buildingImg from "@/assets/building-exterior.jpg";
import shopImg1 from "@/assets/shop-space-1.jpg";
import shopImg2 from "@/assets/shop-space-2.jpg";

const heroSlides = [
  { src: heroImg, caption: "Premium mall spaces at Harsha City Mall, Indirapuram" },
];

// Static fallback properties (used when CMS has no data)
const fallbackProperties = [
  { image: officeImg1, title: "Executive Office Suite", location: "Harsha City Mall, Floor 5", price: "₹55,000/mo", area: "1,500 sq ft", type: "Premium" },
  { image: officeImg2, title: "Co-Working Hub", location: "Harsha Business Center", price: "₹15,000/mo", area: "300 sq ft", type: "Flexible" },
  { image: galleryImg1, title: "Conference-Ready Office", location: "Tower A, Shakti Khand 2", price: "₹75,000/mo", area: "2,200 sq ft", type: "Corporate" },
  { image: buildingImg, title: "Full Floor Office", location: "Harsha City Mall, Floor 8", price: "₹2.5 Cr", area: "5,000 sq ft", type: "Sale" },
  { image: shopImg1, title: "Luxury Brand Outlet", location: "Ground Floor, Harsha City Mall", price: "₹1.2 Cr", area: "1,000 sq ft", type: "Sale" },
  { image: shopImg2, title: "Food Court Space", location: "Level 2, Harsha City Mall", price: "₹50,000/mo", area: "600 sq ft", type: "Lease" },
  { image: heroImg, title: "Anchor Store Space", location: "Harsha City Mall", price: "₹3.5 Cr", area: "4,000 sq ft", type: "Sale" },
  { image: galleryImg2, title: "Fashion Retail Outlet", location: "Level 1, Harsha Mall", price: "₹65,000/mo", area: "750 sq ft", type: "Lease" },
];

export default function OurSpaces() {
  const [cmsProperties, setCmsProperties] = useState<Property[] | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cmsSlides, setCmsSlides] = useState<string[] | null>(null);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const handleEnquire = (title: string, location: string) => {
    const msg = `I am interested in the property: ${title}${location ? ` (${location})` : ""}. Please contact me with more details.`;
    setEnquiryMessage(msg);
  };

  // Embla carousel for hero
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Auto-play hero slider
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
    // Fire both fetches in parallel — page already rendered with fallback
    Promise.all([
      fetchPageContent("our_spaces_slides"),
      fetchProperties(),
    ]).then(([slidesRes, propsRes]) => {
      if (slidesRes.data?.content && Array.isArray(slidesRes.data.content) && slidesRes.data.content.length > 0) {
        setCmsSlides(slidesRes.data.content as string[]);
      }
      if (!propsRes.error) {
        const filtered = (propsRes.data || []).filter(
          (p) =>
            p.features?.includes("our_spaces") ||
            p.display_location?.split(",").includes("our_spaces")
        );
        setCmsProperties(filtered);
      }
      setLoading(false);
    });
  }, []);

  return (
    <main>
      <SEOHead
        title="Our Spaces — Premium Shops, Offices & Mall Spaces in Indirapuram"
        description="Browse Harsha Group's premium commercial spaces for sale and lease in Indirapuram, Ghaziabad. Office suites, retail outlets, food court spaces, co-working hubs, and anchor store spaces at Harsha City Mall."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Our Spaces — Commercial Properties by Harsha Group",
          "description": "Premium shops, offices and mall spaces for sale and lease in Indirapuram, Ghaziabad.",
          "url": "https://harshagroup.in/our-spaces",
          "isPartOf": { "@id": "https://harshagroup.in/#website" },
        }}
      />

      {/* Hero with auto-sliding carousel */}
      <section className="relative mt-16 md:mt-20 h-[50vh] min-h-[360px] flex items-center justify-center overflow-hidden" aria-label="Our spaces hero">
        {loading ? (
          <div className="absolute inset-0 bg-[#0B0B0E] flex items-center justify-center">
            <div className="absolute inset-0 dot-grid opacity-[0.03]" />
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : (
          <>
            {/* Embla viewport */}
            <div className="absolute inset-0" ref={emblaRef}>
              <div className="flex h-full">
                {(cmsSlides
                  ? cmsSlides.map((url, i) => ({ src: url, caption: `Harsha Group commercial space showcase ${i + 1}` }))
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

            {/* Text */}
            <div className="relative z-10 text-center px-4">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-white">
                Our <span className="gold-text">Spaces</span>
              </h1>
              <p className="text-white/80 text-lg">Premium offices, retail outlets and mall spaces — curated for growth.</p>
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
          </>
        )}
      </section>

      <Breadcrumb items={[{ label: "Our Spaces" }]} />

      {/* Properties Grid */}
      <section className="section-padding" aria-label="Available commercial properties">
        <div className="max-w-7xl mx-auto">
          {/* Show fallback immediately; replace with CMS data when available */}
          {cmsProperties !== null ? (
            cmsProperties.length > 0 ? (
              /* CMS Properties */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cmsProperties.map((p, i) => (
                  <ScrollReveal key={p.id} delay={i * 0.06}>
                    <PropertyCard
                      image={resolveImageUrl(p.image_url) || ""}
                      video={p.video_url}
                      title={p.title}
                      location={p.location}
                      price={p.price}
                      area={p.area}
                      type={p.type}
                      features={p.features}
                      onEnquire={handleEnquire}
                    />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground bg-secondary/20 rounded-xl border border-border/40">
                <Building2 size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No spaces currently listed.</p>
              </div>
            )
          ) : (
            /* Fallback static properties — shown instantly before CMS loads */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fallbackProperties.map((p, i) => (
                <ScrollReveal key={i} delay={i * 0.06}>
                  <PropertyCard {...p} onEnquire={handleEnquire} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactForm initialMessage={enquiryMessage} />
    </main>
  );
}