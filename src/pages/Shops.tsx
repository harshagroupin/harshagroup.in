import ScrollReveal from "@/components/ScrollReveal";
import PropertyCard from "@/components/PropertyCard";
import ContactForm from "@/components/ContactForm";
import shopImg1 from "@/assets/shop-space-1.jpg";
import shopImg2 from "@/assets/shop-space-2.jpg";
import heroImg from "@/assets/hero-mall.jpg";
import galleryImg2 from "@/assets/gallery-2.jpg";

const properties = [
  { image: shopImg1, title: "Luxury Brand Outlet", location: "Ground Floor, Harsha City Mall", price: "₹1.2 Cr", area: "1,000 sq ft", type: "Sale" },
  { image: shopImg2, title: "Food Court Space", location: "Level 2, Harsha City Mall", price: "₹50,000/mo", area: "600 sq ft", type: "Lease" },
  { image: heroImg, title: "Anchor Store Space", location: "Harsha City Mall", price: "₹3.5 Cr", area: "4,000 sq ft", type: "Sale" },
  { image: galleryImg2, title: "Fashion Retail Outlet", location: "Level 1, Harsha Mall", price: "₹65,000/mo", area: "750 sq ft", type: "Lease" },
  { image: shopImg1, title: "Kiosk Space", location: "Atrium, Harsha City Mall", price: "₹18,000/mo", area: "100 sq ft", type: "Lease" },
  { image: shopImg2, title: "Restaurant Space", location: "Level 3, Harsha Mall", price: "₹90,000/mo", area: "1,200 sq ft", type: "Lease" },
];

export default function Shops() {
  return (
    <main className="pt-20">
      <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <img src={shopImg1} alt="Shop spaces" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Shops & <span className="gold-text">Outlet Spaces</span>
          </h1>
          <p className="text-muted-foreground text-lg">Premium retail spaces in high-footfall locations.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
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
