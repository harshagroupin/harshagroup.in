import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchPropertyById, submitInquiry, resolveImageUrl, type Property } from "@/lib/cms";
import { getYoutubeEmbed } from "@/lib/utils";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedBackground from "@/components/AnimatedBackground";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Maximize2, 
  IndianRupee, 
  Tag, 
  Play, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  User
} from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPropertyById(id).then((res) => {
      if (res.data) {
        setProperty(res.data);
        // Pre-fill message
        setForm(prev => ({
          ...prev,
          message: `I am interested in: ${res.data.title} located at ${res.data.location}. Please share pricing details, floor plans, and availability.`
        }));
      } else {
        toast({ title: "Property not found", variant: "destructive" });
        navigate("/our-spaces");
      }
      setLoading(false);
    }).catch(() => {
      toast({ title: "Error loading property details", variant: "destructive" });
      navigate("/our-spaces");
      setLoading(false);
    });
  }, [id, navigate, toast]);

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
        message: `${form.message.trim()}\n\n[Inquiry from page: ${property?.title || 'Unknown'}]`
      });

      if (error) throw error;

      toast({ 
        title: "Enquiry Submitted!", 
        description: `Your interest in ${property?.title} has been logged. We will contact you shortly.` 
      });
      setForm({ name: "", phone: "", email: "", message: "" });
      setAcceptedTerms(false);
    } catch (err) {
      toast({ title: "Submission failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!property) return null;

  const hasVideo = property.video_url && property.video_url.trim().length > 0;
  const imageUrl = resolveImageUrl(property.image_url);
  const videoEmbed = hasVideo ? getYoutubeEmbed(property.video_url, false) : null;

  // Professional fallback description if blank in CMS
  const displayDescription = property.description && property.description.trim().length > 0
    ? property.description
    : `Discover ${property.title}, a premium commercial landmark strategically situated in the premier business corridor of ${property.location}. Engineered for modern organizations, high-end retail, and elite offices, this space offers exceptional visibility, superior architecture, and robust appreciation. Investing in this property guarantees high corporate visibility, blue-chip rental potential, and access to premium common area facilities managed entirely by Harsha Group.`;

  // Helper to format price/rate professionally
  const formatPrice = (p: string) => {
    if (!p) return "Price on Request";
    const trimmed = p.trim();
    if (/[₹a-zA-Z]/i.test(trimmed)) return trimmed;
    const cleaned = trimmed.replace(/[^\d]/g, '');
    if (!cleaned) return trimmed;
    return `₹${parseInt(cleaned, 10).toLocaleString('en-IN')}`;
  };

  // Helper to format area/sq ft professionally
  const formatArea = (a: string) => {
    if (!a) return "Multiple Sizes Available";
    const trimmed = a.trim();
    if (trimmed.toLowerCase().includes('sq') || /[a-zA-Z]/.test(trimmed)) return trimmed;
    return `${trimmed} sq ft`;
  };

  // Clean features list
  const filteredFeatures = (property.features || []).filter(
    (f) => !["homepage", "our_spaces", "gallery", "none"].includes(f)
  );

  // Avoid repetitive titles like "Harsha City Mall in Harsha City Mall, Shakti Khand..."
  const cleanLocationForTitle = property.location.toLowerCase().startsWith(property.title.toLowerCase())
    ? property.location.substring(property.title.length).replace(/^[,\s]+/, "")
    : property.location;

  const seoTitle = `${property.title} in ${cleanLocationForTitle} | Harsha Group`;

  return (
    <main className="pt-20 min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={`Explore available shops and offices in ${property.title}, ${cleanLocationForTitle}. View pricing, layout specifications, and project details by Harsha Group.`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "name": property.title,
          "description": displayDescription,
          "url": window.location.href,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": property.location,
            "addressCountry": "IN"
          }
        }}
      />

      <Breadcrumb items={[{ label: "Our Spaces", href: "/our-spaces" }, { label: property.title }]} />

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

        {/* Title Block */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-sm text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              {property.type || "Commercial Space"}
            </span>
            {property.is_featured && (
              <span className="px-3 py-1 rounded-sm text-xs font-semibold bg-[#cda052] text-black flex items-center gap-1">
                <Sparkles size={12} className="fill-current" /> Premium Listing
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-3">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground text-base">
            <MapPin size={18} className="text-primary flex-shrink-0" />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column - Media and Description */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Visual Media Showcase */}
            <div className="glass rounded-2xl overflow-hidden border border-border/30 shadow-xl aspect-[16/9] bg-secondary/20">
              {hasVideo ? (
                videoEmbed ? (
                  <iframe
                    src={videoEmbed}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={property.title}
                  />
                ) : (
                  <video
                    src={property.video_url!}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                )
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30">
                  <Building2 size={64} className="mb-2" />
                  <span>No media available</span>
                </div>
              )}
            </div>

            {/* Quick Spec Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: IndianRupee, label: "Price Range", value: formatPrice(property.price) },
                { icon: Maximize2, label: "Carpet Area", value: formatArea(property.area) },
                { icon: Tag, label: "Property Type", value: property.type || "Commercial Space" }
              ].map((spec, i) => (
                <div key={i} className="glass-ai rounded-xl p-5 border border-border/20 flex items-center gap-4 gold-border-glow">
                  <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
                    <spec.icon size={22} className="text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{spec.label}</div>
                    <div className="font-serif text-lg font-bold mt-0.5">{spec.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Details Section */}
            <section className="glass rounded-2xl p-6 md:p-8 border border-border/20 space-y-6" aria-label="Space overview">
              <h2 className="font-serif text-2xl font-semibold border-b border-border/30 pb-3">
                Space <span className="gold-text">Overview</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                {displayDescription}
              </p>
            </section>

            {/* Features Section */}
            {filteredFeatures.length > 0 && (
              <section className="glass rounded-2xl p-6 md:p-8 border border-border/20 space-y-6" aria-label="Key features">
                <h2 className="font-serif text-2xl font-semibold border-b border-border/30 pb-3">
                  Key <span className="gold-text">Features</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredFeatures.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                      <span className="text-sm md:text-base font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Inquiry Sticky Sidebar */}
          <div className="lg:col-span-4">
            <aside className="sticky top-24 space-y-6">
              
              {/* Form Container */}
              <div className="glass rounded-2xl p-6 md:p-8 border border-primary/20 shadow-[0_0_30px_rgba(196,160,56,0.05)] relative overflow-hidden">
                {/* Gold top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
                
                <h3 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" /> Request Call Back
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Get in touch with our commercial real estate expert team.
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
                    <label className="text-xs font-semibold text-muted-foreground">Requirements Details</label>
                    <textarea
                      placeholder="Specify your requirements"
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md bg-secondary/30 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/60 resize-none"
                      maxLength={1000}
                    />
                  </div>

                  {/* Communication consent checkbox */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2.5">
                      <Checkbox
                        id="details-accepted-terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                        className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <label htmlFor="details-accepted-terms" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
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
                      "Submit Inquiry"
                    )}
                  </Button>
                </form>
              </div>

              {/* Trust/Contact Badges */}
              <div className="glass rounded-2xl p-5 border border-border/20 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Direct Assistance</h4>
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
