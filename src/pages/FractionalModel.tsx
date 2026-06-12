import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import FAQSection from "@/components/FAQSection";
import AnimatedBackground from "@/components/AnimatedBackground";
import FractionalInvestForm from "@/components/FractionalInvestForm";
import { ArrowRight, Sparkles, IndianRupee, PieChart, TrendingUp, Gift, Loader2 } from "lucide-react";
import { fetchPageContent, isSupabaseConfigured } from "@/lib/cms";
import { formatImageUrl, getYoutubeEmbed } from "@/lib/utils";

interface FractionalContent {
  heading?: string;
  subheading?: string;
  image_url?: string;
  video_url?: string;
  media_type?: "image" | "video";
}

const fractionalFAQs = [
  {
    question: "What is fractional ownership in real estate?",
    answer: "Fractional ownership allows multiple investors to collectively own a share of a high-value commercial property. Each investor owns a fraction proportional to their investment and earns rental income and capital appreciation accordingly. It makes premium real estate accessible to a wider range of investors.",
  },
  {
    question: "What is the minimum investment amount?",
    answer: "Harsha Group's fractional ownership model allows you to start investing with a minimal amount — significantly lower than the cost of purchasing an entire commercial property. Contact us for current investment thresholds and available properties.",
  },
  {
    question: "How do I earn returns from fractional ownership?",
    answer: "You earn returns in two ways: (1) Regular rental income from tenants occupying the property, distributed proportional to your ownership share, and (2) Capital appreciation as the property value increases over time. Our prime Indirapuram locations ensure strong returns on both fronts.",
  },
  {
    question: "Is fractional ownership legally secure?",
    answer: "Absolutely. All fractional ownership agreements are registered legal documents. Each investor receives a registered share deed proportional to their investment. The process is fully transparent with proper documentation and legal compliance.",
  },
  {
    question: "Which brands are tenants in Harsha Group properties?",
    answer: "Our properties house leading national and international brands including major QSR chains, fashion retailers, and corporate offices. This ensures consistent rental income and high property value appreciation for our investors.",
  },
];

export default function FractionalModel() {
  const [content, setContent] = useState<FractionalContent | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    fetchPageContent("fractional_model").then((res) => {
      if (res.data?.content) {
        setContent(res.data.content as FractionalContent);
      }
      setLoading(false);
    });
  }, []);

  const heading = content?.heading || "Fractional Investment Model";
  const subheading = content?.subheading || "India's first fractional ownership model in commercial real estate — invest smart, earn big.";
  const imageUrl = content?.image_url ? formatImageUrl(content.image_url) : null;
  const videoUrl = content?.video_url || null;
  const mediaType = content?.media_type || (videoUrl ? "video" : "image");

  const details = [
    {
      icon: Sparkles,
      title: "First Time in India",
      desc: "Harsha Group introduces a pioneering fractional investment model — the first of its kind in India's commercial real estate sector.",
    },
    {
      icon: PieChart,
      title: "Fractional Investment Model",
      desc: "Own a share of premium commercial properties without full ownership costs. High-value real estate, now accessible to every investor.",
    },
    {
      icon: IndianRupee,
      title: "Now Less Is More",
      desc: "Start with a minimal investment and unlock maximum capital appreciation. Your money works harder in our strategically curated portfolio.",
    },
    {
      icon: TrendingUp,
      title: "Investment with Min Amount, Max Appreciation",
      desc: "Our prime Indirapuram locations sit in high-growth corridors, ensuring your investment appreciates significantly over time.",
    },
    {
      icon: Gift,
      title: "Rental Bonus",
      desc: "Enjoy consistent rental income as a bonus on top of capital appreciation. Our tenants include leading national and international brands.",
    },
  ];

  const steps = [
    { step: "01", title: "Choose Property", desc: "Browse our curated premium commercial properties." },
    { step: "02", title: "Select Your Fraction", desc: "Pick the investment amount that suits your budget." },
    { step: "03", title: "Documentation", desc: "Secure, transparent paperwork with registered agreements." },
    { step: "04", title: "Earn & Grow", desc: "Enjoy rental income + capital appreciation." },
  ];

  return (
    <main>
      <SEOHead
        title="Fractional Investment Model — India's First in Commercial Real Estate | Harsha Group"
        description="Discover Harsha Group's pioneering fractional ownership model in commercial real estate. Invest with minimal amount, earn rental income + capital appreciation. India's first fractional investment opportunity in Indirapuram, Ghaziabad."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "InvestmentOrDeposit",
          "name": "Harsha Group Fractional Investment Model",
          "description": "India's first fractional ownership model in commercial real estate. Invest smart, earn big with minimal investment.",
          "url": "https://harshagroup.in/fractional-model",
          "provider": { "@id": "https://harshagroup.in/#organization" },
          "category": "Commercial Real Estate Investment",
        }}
      />

      <Breadcrumb items={[{ label: "Fractional Model" }]} />

      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden" aria-label="Fractional model hero">
        {/* Media background */}
        <div className="absolute inset-0">
          {loading ? (
            <div className="w-full h-full bg-[#0B0B0E] flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          ) : mediaType === "video" && videoUrl ? (
            getYoutubeEmbed(videoUrl, true) ? (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <iframe
                  src={getYoutubeEmbed(videoUrl, true)!}
                  className="absolute w-[200vw] h-[200vh] sm:w-[150vw] sm:h-[150vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  frameBorder="0"
                  tabIndex={-1}
                  title="Harsha Group fractional investment model video"
                />
              </div>
            ) : (
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay muted loop playsInline
              />
            )
          ) : imageUrl ? (
            <img src={imageUrl} alt="Harsha Group Fractional Investment Model — premium commercial property" className="w-full h-full object-cover object-bottom" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-primary/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <AnimatedBackground />

        {/* Hero text */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16 md:pt-20">

          <ScrollReveal>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-white">
              Fractional <span className="gold-text">Investment</span> Model
            </h1>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {subheading}
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <a href="#fractional-invest-form">
              <Button className="gold-gradient text-primary-foreground px-8 h-12 text-base font-semibold hover:opacity-90 gold-glow-sm">
                Start Investing <ArrowRight size={18} className="ml-2" />
              </Button>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Details Summary */}
      <section className="section-padding relative" aria-label="Why fractional ownership">
        <div className="absolute inset-0 dot-grid opacity-[0.015] pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Why <span className="gold-text">Fractional</span> Ownership?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A smarter way to invest in India's booming commercial real estate market.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass-ai rounded-2xl p-7 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group gold-border-glow">
                  <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4 group-hover:gold-glow transition-all">
                    <item.icon size={24} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="pt-20 md:pt-28 pb-8 md:pb-10 px-4 md:px-8 bg-card/30 relative" aria-label="How fractional investment works">
        <div className="absolute inset-0 dot-grid opacity-[0.02] pointer-events-none" aria-hidden="true" />
        <div className="max-w-5xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-4">
                How It <span className="gold-text">Works</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <div className="glass-ai rounded-2xl p-6 text-center group hover:-translate-y-1 transition-all duration-300 relative gold-border-glow">
                  <div className="text-5xl font-serif font-bold gold-text opacity-20 mb-2 group-hover:opacity-40 transition-opacity">
                    {s.step}
                  </div>
                  <h3 className="font-serif text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2">
                      <ArrowRight size={20} className="text-primary/40" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* Fractional Investment Form — dedicated lead capture */}
      <FractionalInvestForm inline />

      {/* FAQ Section */}
      <section className="relative">
        <div className="absolute inset-0 dot-grid opacity-[0.015] pointer-events-none" aria-hidden="true" />
        <FAQSection
          title="Fractional Investment FAQ"
          subtitle="Common questions about fractional ownership in commercial real estate."
          faqs={fractionalFAQs}
          pageId="fractional"
        />
      </section>
    </main>
  );
}
