import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import PropertyCard from "@/components/PropertyCard";
import ContactForm from "@/components/ContactForm";
import { fetchProperties, type Property } from "@/lib/cms";
import { Loader2 } from "lucide-react";
import heroImg from "@/assets/hero-mall.jpg";

// Static fallback properties (used when CMS has no data)
import officeImg1 from "@/assets/office-space-1.jpg";
import officeImg2 from "@/assets/office-space-2.jpg";
import galleryImg1 from "@/assets/gallery-1.jpg";
import galleryImg2 from "@/assets/gallery-2.jpg";
import buildingImg from "@/assets/building-exterior.jpg";
import shopImg1 from "@/assets/shop-space-1.jpg";
import shopImg2 from "@/assets/shop-space-2.jpg";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties().then(({ data }) => {
      // Filter: only show properties assigned to "our_spaces"
      const filtered = (data || []).filter(
        (p) => p.display_location === "our_spaces"
      );
      setCmsProperties(filtered.length > 0 ? filtered : null);
      setLoading(false);
    });
  }, []);

  const hasCmsData = cmsProperties && cmsProperties.length > 0;

  return (
    <main className="pt-20">
      <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Premium commercial spaces" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Our <span className="gold-text">Spaces</span>
          </h1>
          <p className="text-muted-foreground text-lg">Premium offices, retail outlets and mall spaces — curated for growth.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : hasCmsData ? (
            /* CMS Properties */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cmsProperties.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.06}>
                  <PropertyCard
                    image={p.image_url || ""}
                    video={p.video_url}
                    title={p.title}
                    location={p.location}
                    price={p.price}
                    area={p.area}
                    type={p.type}
                    features={p.features}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* Fallback static properties */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fallbackProperties.map((p, i) => (
                <ScrollReveal key={i} delay={i * 0.06}>
                  <PropertyCard {...p} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactForm />
    </main>
  );
}