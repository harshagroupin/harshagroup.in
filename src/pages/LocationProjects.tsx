import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProperties, submitInquiry, resolveImageUrl, type Property } from "@/lib/cms";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedBackground from "@/components/AnimatedBackground";
import ScrollReveal from "@/components/ScrollReveal";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  TrendingUp, 
  Shield, 
  Award,
  Phone,
  Mail,
  User,
  MessageSquare
} from "lucide-react";

export default function LocationProjects() {
  const { location } = useParams<{ location: string }>();
  const { toast } = useToast();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  // Capitalize first letter for display
  const locationName = location
    ? location.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    : "";

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    fetchProperties().then((res) => {
      if (!res.error && res.data) {
        // Filter properties where location string contains the location name (case-insensitive)
        const filtered = res.data.filter(p => 
          p.location.toLowerCase().includes(location.toLowerCase())
        );
        setProperties(filtered);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    setForm(prev => ({
      ...prev,
      message: `I am interested in commercial properties in ${locationName}. Please contact me with available options, pricing, and site visit schedules.`
    }));
  }, [location, locationName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (!acceptedTerms) {
      toast({ title: "Please accept the terms and conditions to proceed", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await submitInquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: `${form.message.trim()}\n\n[Inquiry from page: projects in ${locationName}]`
      });

      if (error) throw error;

      toast({ 
        title: "Enquiry Submitted!", 
        description: `We will contact you with commercial properties in ${locationName} shortly.` 
      });
      setForm({ name: "", phone: "", email: "", message: "" });
      setAcceptedTerms(false);
    } catch (err) {
      toast({ title: "Submission failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const locationIntroText = {
    "indirapuram": "Indirapuram, Ghaziabad is one of the most premium and fast-growing commercial hubs in the National Capital Region (NCR). Boasting exceptional connectivity to East Delhi and Noida via the Delhi-Meerut Expressway, it has emerged as a goldmine for commercial real estate. Excellent social infrastructure, high-density residential surroundings, and robust consumer footfall make shops, offices, and mall spaces in Indirapuram a highly profitable asset class with steady rental yields and rapid capital appreciation.",
    "greater-noida": "Greater Noida is a meticulously planned industrial and commercial smart city in Delhi NCR. With wide multi-lane roads, extensive green cover, and massive upcoming infrastructure like the Noida International Airport (Jewar), it is the ultimate destination for corporate headquarters, large retail operations, and Grade-A commercial developments. Investing in commercial spaces here offers long-term appreciation backed by world-class urban planning.",
    "karnal": "Karnal, Haryana is a strategic commercial hub along the Delhi-Amritsar National Highway (NH-44). As a prominent tier-2 smart city, it represents an outstanding growth market for commercial expansion and fractional real estate investments. Its strategic location connects key trade routes, ensuring high business visibility, strong regional footfall, and high demand for premium shops, retail outlets, and corporate offices."
  }[location?.toLowerCase() || ""] || `Explore premium commercial real estate opportunities in ${locationName}. Harsha Group delivers high-specification retail shops, office spaces, and investment opportunities in high-growth commercial corridors, ensuring high tenant occupancy, blue-chip rental returns, and long-term asset appreciation.`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-background">
      <SEOHead
        title={`Commercial Property in ${locationName} | Shops & Offices | Harsha Group`}
        description={`Explore premium commercial properties for sale & lease in ${locationName}, Ghaziabad/NCR. Buy retail shops, premium offices, and mall spaces with Harsha Group.`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `Commercial Property in ${locationName}`,
          "description": `Browse shops, offices and mall spaces by Harsha Group in ${locationName}.`,
          "url": window.location.href
        }}
      />

      <Breadcrumb items={[{ label: "Our Spaces", href: "/our-spaces" }, { label: `${locationName} Projects` }]} />

      {/* Decorative Background Elements */}
      <div className="absolute top-40 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">
        
        {/* Back Link */}
        <Link 
          to="/our-spaces" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to all commercial spaces
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">
            Commercial Property in <span className="gold-text">{locationName}</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl leading-relaxed">
            {locationIntroText}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column - Properties Grid */}
          <div className="lg:col-span-8">
            <h2 className="font-serif text-2xl font-bold mb-6 text-foreground/90">
              Available Spaces in <span className="gold-text">{locationName}</span>
            </h2>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property, index) => (
                  <ScrollReveal key={property.id} delay={index * 0.05}>
                    <PropertyCard
                      id={property.id}
                      image={resolveImageUrl(property.image_url) || ""}
                      video={property.video_url}
                      title={property.title}
                      location={property.location}
                      price={property.price}
                      area={property.area}
                      type={property.type}
                      features={property.features}
                    />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground bg-secondary/20 rounded-xl border border-border/40 space-y-4">
                <Building2 size={56} className="mx-auto opacity-30 text-primary" />
                <h3 className="font-serif text-lg font-semibold">No direct listings available</h3>
                <p className="text-sm max-w-sm mx-auto text-muted-foreground/80">
                  We currently don't have active listings in {locationName} on the site. Please use the form on the right to receive early notifications of upcoming commercial projects.
                </p>
              </div>
            )}

            {/* Why Invest Highlights */}
            <section className="mt-12 glass rounded-2xl p-6 md:p-8 border border-border/20 space-y-6" aria-label={`Why invest in ${locationName}`}>
              <h3 className="font-serif text-xl font-bold border-b border-border/30 pb-3">
                Why Choose <span className="gold-text">{locationName}</span> for Investment?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                {[
                  { icon: TrendingUp, title: "High ROI Potential", desc: "Prime commercial zones ensure above-market lease rates and capital returns." },
                  { icon: Shield, title: "Clear legal title", desc: "All projects are fully compliant with local urban planning and RERA guidelines." },
                  { icon: Award, title: "Grade-A Infrastructure", desc: "Experience world-class builder quality, power backup, and modern amenities." }
                ].map((highlight, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                      <highlight.icon size={20} className="text-primary-foreground" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-foreground/90">{highlight.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{highlight.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Pre-filled Callback Form */}
          <div className="lg:col-span-4">
            <aside className="sticky top-24 space-y-6">
              
              <div className="glass rounded-2xl p-6 md:p-8 border border-primary/20 shadow-[0_0_30px_rgba(196,160,56,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
                
                <h3 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" /> Enquiry for {locationName}
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Fill in your details to get site layouts, floor plans, and pricing for this micro-market.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-9 bg-secondary/30 border-border/40"
                        maxLength={100}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={form.phone}
                        onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-9 bg-secondary/30 border-border/40"
                        maxLength={20}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-9 bg-secondary/30 border-border/40"
                        maxLength={255}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Your Message</label>
                    <textarea
                      placeholder="Specify your requirements"
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md bg-secondary/30 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/60 resize-none animate-none"
                      maxLength={1000}
                    />
                  </div>

                  {/* Communication consent checkbox */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2.5">
                      <Checkbox
                        id="location-accepted-terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                        className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <label htmlFor="location-accepted-terms" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
                        I accept the{" "}
                        <Link 
                          to="/terms-and-conditions" 
                          className="text-primary hover:underline hover:text-primary/95 underline-offset-4 font-semibold text-[#cda052]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          terms and conditions
                        </Link>{" "}
                        and consent to receive marketing communication, calls, or SMS/WhatsApp messages from Harsha Group.
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || !acceptedTerms}
                    className="w-full h-11 gold-gradient text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={16} /> Sending...
                      </span>
                    ) : (
                      "Submit Enquiry"
                    )}
                  </Button>
                </form>
              </div>

              {/* Direct helpline */}
              <div className="glass rounded-2xl p-5 border border-border/20 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location Helpline</h4>
                <div className="space-y-3 text-sm">
                  <a href="tel:+918448440725" className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors">
                    <Phone size={16} className="text-primary" />
                    <span>+91 8448440725</span>
                  </a>
                  <a href="mailto:info@harshagroup.in" className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors">
                    <Mail size={16} className="text-primary" />
                    <span>info@harshagroup.in</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
