import { useState, useEffect, useCallback } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedBackground from "@/components/AnimatedBackground";
import buildingImg from "@/assets/building-exterior.jpg";
import officeImg from "@/assets/office-space-2.jpg";
import { Building2, Eye, Target, Award, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const heroSlides = [
  { src: buildingImg, caption: "Harsha Group Building - Premium commercial real estate in Indirapuram" },
];

export default function About() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveSlide(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <main>
      <SEOHead
        title="About Harsha Group | 15+ Years of Trusted Real Estate Excellence"
        description="Learn about Harsha Group — a leading commercial real estate developer in Indirapuram, Ghaziabad with 15+ years of experience. 50+ projects completed, 1200+ happy clients. Building trust, delivering excellence since 2009."
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

      {/* Hero Slider — starts below navbar */}
      <section className="relative mt-16 md:mt-20 h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden" aria-label="About hero">
        <div className="absolute inset-0" ref={emblaRef}>
          <div className="flex h-full">
            {heroSlides.map((slide, i) => (
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
        {heroSlides.length > 1 && (
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
            About <span className="gold-text">Harsha Group</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Building trust, delivering excellence since 2009.</p>
        </div>

        {/* Dot indicators — only when multiple slides */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, i) => (
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

      <Breadcrumb items={[{ label: "About Us" }]} />

      {/* Company Overview */}
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
                Our flagship project, Harsha City Mall, stands as a testament to our commitment to quality, design, and value creation. Located in the heart of Shakti Khand 2, it has become a thriving commercial hub.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We partner with leading brands and businesses to create spaces that inspire growth, foster innovation, and deliver exceptional returns on investment.
              </p>
            </article>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <img src={officeImg} alt="Premium office spaces at Harsha City Mall, Indirapuram" loading="lazy" className="rounded-2xl w-full object-cover h-[400px]" />
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-card/30 relative" aria-label="Mission and vision">
        <div className="absolute inset-0 dot-grid opacity-[0.02] pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Target, title: "Our Mission", desc: "To deliver world-class commercial spaces that empower businesses to thrive, while creating sustainable value for our investors and partners." },
            { icon: Eye, title: "Our Vision", desc: "To be the most trusted name in commercial real estate, setting new benchmarks for quality, innovation, and customer satisfaction in North India." },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div className="glass-ai rounded-2xl p-8 md:p-10 h-full gold-border-glow">
                <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-6">
                  <item.icon size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Experience */}
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
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass-ai rounded-2xl p-6 text-center hover-tilt gold-border-glow">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl gold-gradient flex items-center justify-center">
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
