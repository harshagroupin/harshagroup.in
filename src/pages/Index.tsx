import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Shield, MapPin, TrendingUp, Star, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import PropertyCard from "@/components/PropertyCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCounter } from "@/hooks/useCounter";
import { fetchHeroContent, fetchProperties, fetchPageContent, resolveImageUrl, type HeroContent, type Property } from "@/lib/cms";
import { formatImageUrl, getYoutubeEmbed } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import heroImg from "@/assets/hero-mall.jpg";
import officeImg1 from "@/assets/office-space-1.jpg";
import shopImg1 from "@/assets/shop-space-1.jpg";
import buildingImg from "@/assets/building-exterior.jpg";
import officeImg2 from "@/assets/office-space-2.jpg";


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
  });
  const [cmsProperties, setCmsProperties] = useState<Property[] | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });

  useEffect(() => {
    Promise.all([fetchHeroContent(), fetchProperties(), fetchPageContent("hero_settings")]).then(([heroRes, propsRes, settingsRes]) => {
      if (heroRes.data) setHero(heroRes.data);
      if (settingsRes.data?.content) {
        setHeroSettings({
          hideHeading: !!settingsRes.data.content.hideHeading,
          hideSubheading: !!settingsRes.data.content.hideSubheading,
          hidePrimaryBtn: !!settingsRes.data.content.hidePrimaryBtn,
          hideSecondaryBtn: !!settingsRes.data.content.hideSecondaryBtn,
          slides: settingsRes.data.content.slides || [],
        });
      }
      
      if (propsRes.error) {
        setCmsProperties(null);
      } else {
        const filtered = (propsRes.data || []).filter((p) => p.features?.includes("homepage") || p.display_location?.split(',').includes("homepage"));
        setCmsProperties(filtered);
      }
      // Preload hero image to prevent blank space flash, but cap at 3s max
      const heroData = heroRes.data;
      if (heroData?.media_type !== "video") {
        const imageUrl = heroData?.image_url ? formatImageUrl(heroData.image_url) : heroImg;
        if (imageUrl) {
          const img = new Image();
          const timeout = setTimeout(() => setLoading(false), 3000); // max 3s wait
          img.src = imageUrl;
          img.onload = () => { clearTimeout(timeout); setLoading(false); };
          img.onerror = () => { clearTimeout(timeout); setLoading(false); };
          return;
        }
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  // Use CMS content if available, otherwise fallback to defaults
  const heroHeading = hero?.heading || "Premium Commercial Spaces That Drive Business Growth";
  const heroSubheading = hero?.subheading || "Invest | Lease | Grow with Harsha Group — Your trusted partner for premium commercial real estate in Indirapuram.";
  const ctaPrimary = hero?.cta_primary_text || "Explore Properties";
  const ctaSecondary = hero?.cta_secondary_text || "Contact Now";
  const showVideo = hero?.media_type === "video" && hero?.video_url;

  const slides = [];
  if (showVideo && hero?.video_url) {
    slides.push({ type: 'video', url: hero.video_url });
  } else if (hero?.image_url) {
    slides.push({ type: 'image', url: formatImageUrl(hero.image_url) });
  } else {
    slides.push({ type: 'image', url: heroImg });
  }

  if (heroSettings.slides && heroSettings.slides.length > 0) {
    heroSettings.slides.forEach(url => {
      slides.push({ type: 'image', url: formatImageUrl(url) });
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </main>
    );
  }

  return (
    <main className="">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                {slide.type === 'video' ? (
                  getYoutubeEmbed(slide.url, true) ? (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <iframe
                        src={getYoutubeEmbed(slide.url, true)!}
                        className="absolute w-[200vw] h-[200vh] sm:w-[150vw] sm:h-[150vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        frameBorder="0"
                        tabIndex={-1}
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
                  <img
                    src={slide.url}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none" />
        </div>

        {/* Optional subtle grid overlay can be added here if needed, but clean is better for premium */}

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
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
      </section>

      {/* Featured Properties */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
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
                      image={resolveImageUrl(p.image_url) || ""}
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
              [
                { image: officeImg1, title: "Premium Office Suite A", location: "Harsha City Mall, Indirapuram", price: "₹45,000/mo", area: "1,200 sq ft", type: "Office" },
                { image: shopImg1, title: "Luxury Retail Outlet", location: "Ground Floor, Harsha Mall", price: "₹80,000/mo", area: "800 sq ft", type: "Shop" },
                { image: buildingImg, title: "Corporate Office Tower", location: "Shakti Khand 2, Ghaziabad", price: "₹1.2 Cr", area: "3,500 sq ft", type: "Office" },
                { image: officeImg2, title: "Co-Working Space", location: "Harsha Business Center", price: "₹25,000/mo", area: "500 sq ft", type: "Office" },
              ].map((p, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <PropertyCard {...p} minimal={true} showEnquire={false} />
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-card/30">
        <div className="max-w-7xl mx-auto">
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
                <div className="glass rounded-md p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
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
      <section className="section-padding" ref={statsReveal.ref}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <StatCounter key={i} {...s} start={statsReveal.isVisible} />
          ))}
        </div>
      </section>

      {/* Channel Partners */}
      <section className="py-16 bg-card/30 overflow-hidden">
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
      <section className="section-padding">
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
                <div className="glass rounded-md p-6 md:p-8 relative">
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

      {/* Contact Form removed */}
    </main>
  );
}
