import { useState, useEffect, useCallback } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedBackground from "@/components/AnimatedBackground";
import { fetchPageContent } from "@/lib/cms";
import { formatImageUrl } from "@/lib/utils";
import { Building2, Eye, Target, Award, ChevronLeft, ChevronRight, MapPin, Handshake } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export default function About() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [cmsSlides, setCmsSlides] = useState<string[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });

  const slideItems = cmsSlides.map((url, index) => ({
    src: formatImageUrl(url),
    caption: `Harsha Group commercial real estate showcase ${index + 1}`,
  }));

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi || slideItems.length < 2) return;
    const onSelect = () => setActiveSlide(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, slideItems.length]);

  useEffect(() => {
    fetchPageContent("about_slides").then((res) => {
      const content = res.data?.content;
      if (Array.isArray(content)) {
        setCmsSlides(content.filter(Boolean) as string[]);
      }
    }).catch(() => {
      setCmsSlides([]);
    });
  }, []);

  return (
    <main>
      <SEOHead
        title="About Harsha Group | 15+ Years of Trusted Real Estate Excellence"
        description="Learn about Harsha Group - a leading commercial real estate developer in Indirapuram, Ghaziabad with 15+ years of experience. 50+ projects completed, 1200+ happy clients."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Harsha Group",
          "description": "15+ years of trusted commercial real estate excellence in Indirapuram, Ghaziabad.",
          "url": "https://harshagroup.in/about",
          "isPartOf": { "@id": "https://harshagroup.in/#website" },
          "about": { "@id": "https://harshagroup.in/#organization" },
        }}
      />

      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden" aria-label="About hero">
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
            About <span className="gold-text">Harsha Group</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Building trust, delivering excellence since 2009.</p>
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

      <Breadcrumb items={[{ label: "About Us" }]} />

      <section className="section-padding" aria-label="Company overview">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <article>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                A Legacy of <span className="gold-text">Excellence</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Harsha Group has been at the forefront of commercial real estate in Indirapuram, Ghaziabad for over 15 years. We specialize in premium commercial properties including office spaces, retail outlets, and mall spaces.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our flagship project, Harsha City Mall, reflects our commitment to quality, design, and value creation. Located in Shakti Khand 2, it has grown into a trusted commercial destination.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We partner with leading brands and businesses to create spaces that support growth, improve visibility, and deliver long-term value.
              </p>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="rounded-lg border border-border/50 bg-card/60 p-8 md:p-10 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Building2, value: "50+", label: "Projects delivered" },
                  { icon: Handshake, value: "1,200+", label: "Clients served" },
                  { icon: Award, value: "15+", label: "Years experience" },
                  { icon: MapPin, value: "NCR", label: "Prime corridors" },
                ].map((item) => (
                  <div key={item.label} className="border-l border-primary/40 pl-4">
                    <item.icon size={22} className="text-primary mb-4" />
                    <div className="font-serif text-3xl font-bold text-foreground">{item.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-card/30 relative" aria-label="Mission and vision">
        <div className="absolute inset-0 dot-grid opacity-[0.02] pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Target, title: "Our Mission", desc: "To deliver world-class commercial spaces that empower businesses to thrive, while creating sustainable value for our investors and partners." },
            { icon: Eye, title: "Our Vision", desc: "To be the most trusted name in commercial real estate, setting new benchmarks for quality, reliability, and customer satisfaction in North India." },
          ].map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.15}>
              <div className="glass-ai rounded-lg p-8 md:p-10 h-full gold-border-glow">
                <div className="w-14 h-14 rounded-lg gold-gradient flex items-center justify-center mb-6">
                  <item.icon size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section-padding" aria-label="Trust and experience">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
                Why <span className="gold-text">Trust Us</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Award, title: "Award-Winning Projects", desc: "Recognized for excellence in commercial real estate development." },
              { icon: Building2, title: "50+ Projects Delivered", desc: "A robust portfolio of successful commercial developments across NCR." },
              { icon: Target, title: "1200+ Happy Clients", desc: "A growing community of satisfied investors and business owners." },
            ].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.1}>
                <div className="glass-ai rounded-lg p-6 text-center hover-tilt gold-border-glow">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg gold-gradient flex items-center justify-center">
                    <item.icon size={28} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
