import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import PropertyCard from "@/components/PropertyCard";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import officeImg1 from "@/assets/office-space-1.jpg";
import officeImg2 from "@/assets/office-space-2.jpg";
import galleryImg1 from "@/assets/gallery-1.jpg";
import galleryImg2 from "@/assets/gallery-2.jpg";
import buildingImg from "@/assets/building-exterior.jpg";
import shopImg1 from "@/assets/shop-space-1.jpg";
import shopImg2 from "@/assets/shop-space-2.jpg";
import heroImg from "@/assets/hero-mall.jpg";

const offices = [
  { image: officeImg1, title: "Executive Office Suite", location: "Harsha City Mall, Floor 5", price: "₹55,000/mo", area: "1,500 sq ft", type: "Premium" },
  { image: officeImg2, title: "Co-Working Hub", location: "Harsha Business Center", price: "₹15,000/mo", area: "300 sq ft", type: "Flexible" },
  { image: galleryImg1, title: "Conference-Ready Office", location: "Tower A, Shakti Khand 2", price: "₹75,000/mo", area: "2,200 sq ft", type: "Corporate" },
  { image: buildingImg, title: "Full Floor Office", location: "Harsha City Mall, Floor 8", price: "₹2.5 Cr", area: "5,000 sq ft", type: "Sale" },
  { image: officeImg1, title: "Startup Office", location: "Harsha Innovation Hub", price: "₹20,000/mo", area: "450 sq ft", type: "Startup" },
  { image: officeImg2, title: "Virtual Office Package", location: "Harsha City Mall", price: "₹8,000/mo", area: "Flexi", type: "Virtual" },
];

const shops = [
  { image: shopImg1, title: "Luxury Brand Outlet", location: "Ground Floor, Harsha City Mall", price: "₹1.2 Cr", area: "1,000 sq ft", type: "Sale" },
  { image: shopImg2, title: "Food Court Space", location: "Level 2, Harsha City Mall", price: "₹50,000/mo", area: "600 sq ft", type: "Lease" },
  { image: heroImg, title: "Anchor Store Space", location: "Harsha City Mall", price: "₹3.5 Cr", area: "4,000 sq ft", type: "Sale" },
  { image: galleryImg2, title: "Fashion Retail Outlet", location: "Level 1, Harsha Mall", price: "₹65,000/mo", area: "750 sq ft", type: "Lease" },
  { image: shopImg1, title: "Kiosk Space", location: "Atrium, Harsha City Mall", price: "₹18,000/mo", area: "100 sq ft", type: "Lease" },
  { image: shopImg2, title: "Restaurant Space", location: "Level 3, Harsha Mall", price: "₹90,000/mo", area: "1,200 sq ft", type: "Lease" },
];

type Filter = "all" | "office" | "shop";

export default function OurSpaces() {
  const [filter, setFilter] = useState<Filter>("all");

  const tagged = [
    ...offices.map((p) => ({ ...p, category: "office" as const })),
    ...shops.map((p) => ({ ...p, category: "shop" as const })),
  ];
  const list = filter === "all" ? tagged : tagged.filter((p) => p.category === filter);

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
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {([
              { key: "all", label: "All Spaces" },
              { key: "office", label: "Office Spaces" },
              { key: "shop", label: "Shops & Outlets" },
            ] as { key: Filter; label: string }[]).map((b) => (
              <Button
                key={b.key}
                onClick={() => setFilter(b.key)}
                variant={filter === b.key ? "default" : "outline"}
                className={
                  filter === b.key
                    ? "gold-gradient text-primary-foreground border-0"
                    : "border-primary/40 text-foreground hover:bg-primary/10"
                }
              >
                {b.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((p, i) => (
              <ScrollReveal key={`${p.category}-${i}`} delay={i * 0.06}>
                <PropertyCard {...p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ContactForm />
    </main>
  );
}