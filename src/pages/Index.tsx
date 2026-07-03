import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Shield, MapPin, TrendingUp, Star, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import PropertyCard from "@/components/PropertyCard";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCounter } from "@/hooks/useCounter";
import type { HeroContent, Property } from "@/lib/cms";
import { formatImageUrl, getYoutubeEmbed, resolveCmsImageUrl } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";



const stats = [
  { label: "Projects Completed", value: 50, suffix: "+" },
  { label: "Sq Ft Delivered", value: 500000, suffix: "+", format: true },
  { label: "Happy Clients", value: 1200, suffix: "+" },
  { label: "Years Experience", value: 15, suffix: "+" },
];

const partners = ["McDonald's", "KFC", "Burger King", "Pizza Hut", "Domino's", "Starbucks", "Subway", "Costa Coffee"];

const testimonials = [
  { name: "Rajesh Sharma", role: "Investor", feedback: "Harsha Group delivered exceptional ROI on my commercial investment. Their professionalism and market knowledge are unmatched.", rating: 5 },
  { name: "Priya Mehta", role: "Business Owner", feedback: "The retail space we leased at Harsha City Mall has been transformative for our business. Premium location with excellent footfall.", rating: 5 },
  { name: "Amit Gupta", role: "Corporate Client", feedback: "Outstanding office spaces with world-class amenities. Harsha Group truly understands the needs of modern businesses.", rating: 5 },
  { name: "Sneha Kapoor", role: "Franchise Owner", feedback: "From site selection to handover, the entire process was seamless. Highly recommended for commercial real estate.", rating: 4 },
];

const homepageFAQs = [
  {
    question: "What types of commercial spaces does Harsha Group offer?",
    answer: "Harsha Group offers a wide range of premium commercial spaces including office suites, retail outlets, mall spaces, food court areas, co-working hubs, and anchor store spaces. All our properties are located in prime commercial corridors of Indirapuram, Ghaziabad.",
  },
  {
    question: "Where are Harsha Group properties located?",
    answer: "Our flagship property, Harsha City Mall, is located in Shakti Khand 2, Indirapuram, Ghaziabad, Uttar Pradesh. This is one of the most sought-after commercial locations in NCR with excellent connectivity to Delhi, Noida, and Greater Noida.",
  },
  {
    question: "What is the fractional investment model by Harsha Group?",
    answer: "Harsha Group pioneered India's first fractional ownership model in commercial real estate. It allows investors to own a fraction of premium commercial properties with minimal investment, earning both rental income and capital appreciation. Start investing with as little as a few lakhs.",
  },
  {
    question: "How can I schedule a site visit?",
    answer: "You can schedule a site visit by calling us at +91 8448440725, emailing info@harshagroup.in, or filling out the contact form on our website. Our team is available Monday to Saturday, 10 AM to 7 PM.",
  },
  {
    question: "What ROI can I expect from Harsha Group properties?",
    answer: "Our commercial properties in Indirapuram have consistently delivered above-market returns. With prime locations, strong tenant profiles including national and international brands, and professional property management, investors have seen significant capital appreciation and steady rental yields.",
  },
];

function StatCounter({ value, suffix, format, label, start }: { value: number; suffix: string; format?: boolean; label: string; start: boolean }) {
  const count = useCounter(value, 2500, start);
  const display = format ? count.toLocaleString() : count;
  return (
    <div className="text-center">
      <div className="font-serif text-3xl md:text-5xl font-bold gold-text mb-2">
        {display}{suffix}
      </div>
      <div className="text-muted-foreground text-sm">{label}</div>
    </div>
  );
}

export default function Index() {
  const statsReveal = useScrollReveal<HTMLElement>();
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [heroSettings, setHeroSettings] = useState({
    hideHeading: false,
    hideSubheading: false,
    hidePrimaryBtn: false,
    hideSecondaryBtn: false,
    slides: [] as string[],
    fractionalMediaUrl: "",
    fractionalMediaType: "image" as "image" | "video",
    mobileImageUrl: "",
    mobileFractionalMediaUrl: "",
    useLocalFallback: false,
  });
  // null = loading (show fallback), [] = loaded but empty, [...] = has CMS data
  const [cmsProperties, setCmsProperties] = useState<Property[] | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });

  useEffect(() => {
    let mounted = true;

    import("@/lib/cms").then(({ fetchHeroContent, fetchProperties, fetchPageContent }) =>
      Promise.all([
        fetchHeroContent(),
        fetchProperties(),
        fetchPageContent("hero_settings"),
      ])
    ).then(([heroRes, propsRes, settingsRes]) => {
      if (!mounted) return;
      if (heroRes.data) setHero(heroRes.data);
      if (settingsRes.data?.content) {
        setHeroSettings({
          hideHeading: !!settingsRes.data.content.hideHeading,
          hideSubheading: !!settingsRes.data.content.hideSubheading,
          hidePrimaryBtn: !!settingsRes.data.content.hidePrimaryBtn,
          hideSecondaryBtn: !!settingsRes.data.content.hideSecondaryBtn,
          slides: settingsRes.data.content.slides || [],
          fractionalMediaUrl: settingsRes.data.content.fractionalMediaUrl || "",
          fractionalMediaType: settingsRes.data.content.fractionalMediaType || "image",
          mobileImageUrl: settingsRes.data.content.mobileImageUrl || "",
          mobileFractionalMediaUrl: settingsRes.data.content.mobileFractionalMediaUrl || "",
          useLocalFallback: !!settingsRes.data.content.useLocalFallback,
        });
      }
      if (!propsRes.error) {
        const filtered = (propsRes.data || []).filter(
          (p) =>
            p.features?.includes("homepage") ||
            p.display_location?.split(",").includes("homepage")
        );
        setCmsProperties(filtered);
      }
    }).catch(() => {
      if (!mounted) return;
      setCmsProperties([]);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveSlide(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Use CMS content if available, otherwise fallback to defaults
  const heroHeading =
    hero?.heading || "Premium Commercial Spaces That Drive Business Growth";
  const heroSubheading =
    hero?.subheading ||
    "Invest | Lease | Grow with Harsha Group — Your trusted partner for premium commercial real estate in Indirapuram.";
  const ctaPrimary = hero?.cta_primary_text || "Explore Properties";
  const ctaSecondary = hero?.cta_secondary_text || "Contact Now";
  const showVideo = hero?.media_type === "video" && hero?.video_url;

  // Build slides — check if we should prepend the local high-performance fallback first
  const slides: { type: string; url: string; mobileUrl?: string; isFractional?: boolean }[] = [];
  
  if (heroSettings.useLocalFallback) {
    slides.push({
      type: "image",
      url: "/main-page-harsha-group.png",
      mobileUrl: heroSettings.mobileImageUrl ? formatImageUrl(heroSettings.mobileImageUrl) : undefined
    });
  }

  if (showVideo && hero?.video_url) {
    slides.push({ type: "video", url: hero.video_url });
  } else if (hero?.image_url) {
    slides.push({ 
      type: "image", 
      url: formatImageUrl(hero.image_url), 
      mobileUrl: heroSettings.mobileImageUrl ? formatImageUrl(heroSettings.mobileImageUrl) : undefined 
    });
  }

  // Add fractional slide next if configured
  if (heroSettings.fractionalMediaUrl) {
    const fracMediaType = heroSettings.fractionalMediaType || "image";
    slides.push({
      type: fracMediaType,
      url: formatImageUrl(heroSettings.fractionalMediaUrl),
      mobileUrl: heroSettings.mobileFractionalMediaUrl ? formatImageUrl(heroSettings.mobileFractionalMediaUrl) : undefined,
      isFractional: true
    });
  }

  if (heroSettings.slides && heroSettings.slides.length > 0) {
    heroSettings.slides.forEach((url) => {
      slides.push({ type: "image", url: formatImageUrl(url) });
    });
  }

  return (
    <main>
      <SEOHead
        title="Harsha Group | Premium Commercial Real Estate in Indirapuram, Ghaziabad"
        description="Harsha Group offers premium commercial spaces — shops, offices, mall spaces & retail outlets in Indirapuram, Ghaziabad. Invest, Lease & Grow with us. 15+ years of trusted excellence."
        canonical="https://harshagroup.in"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Harsha Group — Premium Commercial Real Estate",
          "description": "Premium commercial spaces in Indirapuram, Ghaziabad. Shops, offices, mall spaces & retail outlets.",
          "url": "https://harshagroup.in",
          "isPartOf": { "@id": "https://harshagroup.in/#website" },
          "about": { "@id": "https://harshagroup.in/#organization" },
        }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero">
        {slides.length > 0 ? (
          <div className="absolute inset-0" ref={emblaRef}>
            <div className="flex h-full">
              {slides.map((slide, index) => {
                const slideContent = (
                  <>
                    {slide.type === 'video' ? (
                      getYoutubeEmbed(slide.url, true) ? (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <iframe
                            src={getYoutubeEmbed(slide.url, true)!}
                            className="absolute w-[200vw] h-[200vh] sm:w-[150vw] sm:h-[150vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            frameBorder="0"
                            tabIndex={-1}
                            title="Harsha Group promotional video"
                          />
                        </div>
                      ) : (
                        <video
                          src={slide.url}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      )
                    ) : (
                      <picture>
                        {slide.mobileUrl && (
                          <source media="(max-width: 768px)" srcSet={slide.mobileUrl} />
                        )}
                        <img
                          src={slide.url}
                          fetchPriority={index === 0 ? "high" : "low"}
                          loading={index === 0 ? "eager" : "lazy"}
                          alt={`Harsha Group premium commercial property - ${index === 0 ? "Harsha City Mall exterior view" : slide.isFractional ? "Fractional Investment Opportunity" : `commercial space showcase ${index + 1}`}`}
                          className="w-full h-full object-cover object-bottom"
                        />
                      </picture>
                    )}
                    {slide.isFractional && (
                      <Link
                        to="/fractional-model"
                        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-primary/40 flex items-center gap-2 group cursor-pointer shadow-xl animate-pulse"
                      >
                        <span className="text-white text-xs font-semibold whitespace-nowrap">Fractional Investment Model — Click for More</span>
                        <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </>
                );

                return (
                  <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full overflow-hidden">
                    {slideContent}
                  </div>
                );
              })}
            </div>
            {!(slides[activeSlide]?.isFractional) && (
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none" />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(145deg,#111113_0%,#181611_48%,#09090b_100%)]">
            <div className="absolute inset-0 dot-grid opacity-[0.035]" />
          </div>
        )}

        {/* AI-themed background elements */}
        <AnimatedBackground />

        {/* Only show homepage details if the active slide is NOT a fractional slide */}
        {!(slides[activeSlide]?.isFractional) && (
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-16 md:pt-20">
            {!heroSettings.hideHeading && (
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 animate-fade-up text-white">
                {heroHeading}
              </h1>
            )}
            {!heroSettings.hideSubheading && (
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto" style={{ animation: "fade-up 0.8s ease-out 0.2s both" }}>
                {heroSubheading}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animation: "fade-up 0.8s ease-out 0.4s both" }}>
              {!heroSettings.hidePrimaryBtn && (
                <Link to="/our-spaces">
                  <Button className="gold-gradient text-primary-foreground px-8 h-12 text-base font-semibold hover:opacity-90 gold-glow-sm">
                    {ctaPrimary}
                  </Button>
                </Link>
              )}
              {!heroSettings.hideSecondaryBtn && (
                <Link to="/contact">
                  <Button variant="outline" className="border-primary/50 text-foreground px-8 h-12 text-base hover:bg-primary/10">
                    {ctaSecondary}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Featured Properties */}
      <section className="section-padding relative" aria-label="Featured properties">
        {/* Subtle background */}
        <div className="absolute inset-0 dot-grid opacity-[0.015] pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Featured <span className="gold-text">Properties</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Handpicked premium commercial spaces for discerning investors and businesses.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cmsProperties !== null ? (
              cmsProperties.length > 0 ? (
                cmsProperties.map((p, i) => (
                  <ScrollReveal key={p.id} delay={i * 0.1}>
                    <PropertyCard
                      id={p.id}
                      image={resolveCmsImageUrl(p.image_url) || ""}
                      video={p.video_url}
                      title={p.title}
                      location={p.location}
                      price={p.price}
                      area={p.area}
                      type={p.type}
                      features={p.features}
                      minimal={true}
                      showEnquire={false}
                    />
                  </ScrollReveal>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-16 text-muted-foreground bg-secondary/20 rounded-xl border border-border/40">
                  <Building2 size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No featured properties currently listed.</p>
                </div>
              )
            ) : (
              /* Skeleton cards — no local image fallback, no content swap */
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-border/30 bg-card/40 animate-pulse">
                  <div className="aspect-[4/3] bg-secondary/40" />
                  <div className="p-4 space-y-2.5">
                    <div className="h-3.5 bg-secondary/60 rounded w-3/4" />
                    <div className="h-3 bg-secondary/40 rounded w-1/2" />
                    <div className="flex justify-between mt-3">
                      <div className="h-3 bg-secondary/40 rounded w-1/4" />
                      <div className="h-3 bg-secondary/40 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-card/30 relative" aria-label="Why choose Harsha Group">
        <div className="absolute inset-0 dot-grid opacity-[0.02] pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Why Choose <span className="gold-text">Harsha Group</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building2, title: "15+ Years Experience", desc: "Decades of expertise in commercial real estate development and management." },
              { icon: Shield, title: "Trusted Partner", desc: "Building lasting relationships with transparency and integrity." },
              { icon: MapPin, title: "Premium Locations", desc: "Strategically located properties in high-growth commercial corridors." },
              { icon: TrendingUp, title: "High ROI", desc: "Proven track record of delivering exceptional returns on investments." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass-ai rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 group gold-border-glow">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl gold-gradient flex items-center justify-center group-hover:gold-glow transition-all">
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

      {/* Stats */}
      <section className="section-padding relative" ref={statsReveal.ref} aria-label="Statistics">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <StatCounter key={i} {...s} start={statsReveal.isVisible} />
          ))}
        </div>
      </section>

      {/* ─── FRACTIONAL INVESTMENT — EDITORIAL SECTION ─── */}
      <section className="section-padding relative border-y border-border/30" aria-label="Fractional investment opportunity">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border/40 rounded-2xl overflow-hidden">

              {/* Left — editorial copy */}
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-5">
                  Fractional Investment Model
                </p>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  Invest in Prime
                  <br />
                  <span className="gold-text">Commercial Real Estate</span>
                  <br />
                  At Your Own Budget
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
                  Harsha Group's fractional ownership model lets you co-own a share of Harsha City Mall, Indirapuram — invest a fraction that suits <em>your</em> budget and earn rental income + capital appreciation.
                </p>

                {/* Clean proof stats — horizontal */}
                <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10 pb-10 border-b border-border/30">
                  {[
                    { num: "15+", label: "Years in real estate" },
                    { num: "1,200+", label: "Investors trust us" },
                    { num: "₹500Cr+", label: "Portfolio managed" },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="font-serif text-2xl md:text-3xl font-bold gold-text">{s.num}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/fractional-model#fractional-invest-form">
                    <Button className="gold-gradient text-primary-foreground px-7 h-11 font-semibold hover:opacity-90">
                      Explore Investment Options
                    </Button>
                  </Link>
                  <Link to="/fractional-model">
                    <Button variant="ghost" className="px-7 h-11 text-foreground hover:bg-secondary/60">
                      Learn More <ArrowRight size={15} className="ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right — clean highlight list */}
              <div className="bg-card/60 border-l border-border/30 p-10 md:p-14 flex flex-col justify-center">
                <h3 className="font-serif text-lg font-bold mb-8 text-foreground/90">What you get as an investor</h3>
                <ul className="space-y-6">
                  {[
                    { title: "Registered Ownership", desc: "Your share is legally registered under your name with full documentation." },
                    { title: "Rental Income", desc: "Earn proportional monthly rental income from blue-chip commercial tenants." },
                    { title: "Capital Appreciation", desc: "Benefit from long-term property value growth in Indirapuram's prime corridor." },
                    { title: "Professional Management", desc: "Harsha Group handles all property operations — zero effort from your side." },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="w-5 h-5 rounded-full border-2 border-primary/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </span>
                      <div>
                        <div className="font-semibold text-sm mb-1">{item.title}</div>
                        <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>
      {/* ─── END FRACTIONAL SECTION ─── */}

      {/* Channel Partners */}
      <section className="py-16 bg-card/30 overflow-hidden" aria-label="Channel partners">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
              Our <span className="gold-text">Channel Partners</span>
            </h2>
          </div>
        </ScrollReveal>
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-left whitespace-nowrap">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="inline-flex items-center justify-center mx-8 min-w-[150px]">
                <span className="text-xl font-bold text-muted-foreground/60 hover:text-primary transition-colors">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding relative" aria-label="Client testimonials">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-4">
                What Our <span className="gold-text">Clients Say</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass-ai rounded-xl p-6 md:p-8 relative gold-border-glow">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={18} className={j < t.rating ? "fill-primary text-primary" : "text-muted-foreground/30"} />
                    ))}
                  </div>
                  <p className="text-foreground/90 mb-6 italic">"{t.feedback}"</p>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-muted-foreground text-sm">{t.role}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-card/30 relative">
        <div className="absolute inset-0 dot-grid opacity-[0.02] pointer-events-none" aria-hidden="true" />
        <FAQSection
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about Harsha Group's commercial properties and investment opportunities."
          faqs={homepageFAQs}
          pageId="homepage"
        />
      </section>

      {/* Contact Form removed */}
    </main>
  );
}
