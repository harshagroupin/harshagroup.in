import ScrollReveal from "@/components/ScrollReveal";
import PropertyCard from "@/components/PropertyCard";
import ContactForm from "@/components/ContactForm";
import officeImg1 from "@/assets/office-space-1.jpg";
import officeImg2 from "@/assets/office-space-2.jpg";
import galleryImg1 from "@/assets/gallery-1.jpg";
import buildingImg from "@/assets/building-exterior.jpg";

const properties = [
  { image: officeImg1, title: "Executive Office Suite", location: "Harsha City Mall, Floor 5", price: "₹55,000/mo", area: "1,500 sq ft", type: "Premium" },
  { image: officeImg2, title: "Co-Working Hub", location: "Harsha Business Center", price: "₹15,000/mo", area: "300 sq ft", type: "Flexible" },
  { image: galleryImg1, title: "Conference-Ready Office", location: "Tower A, Shakti Khand 2", price: "₹75,000/mo", area: "2,200 sq ft", type: "Corporate" },
  { image: buildingImg, title: "Full Floor Office", location: "Harsha City Mall, Floor 8", price: "₹2.5 Cr", area: "5,000 sq ft", type: "Sale" },
  { image: officeImg1, title: "Startup Office", location: "Harsha Innovation Hub", price: "₹20,000/mo", area: "450 sq ft", type: "Startup" },
  { image: officeImg2, title: "Virtual Office Package", location: "Harsha City Mall", price: "₹8,000/mo", area: "Flexi", type: "Virtual" },
];

export default function OfficeSpace() {
  return (
    <main className="pt-20">
      <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <img src={officeImg1} alt="Office spaces" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Premium <span className="gold-text">Office Spaces</span>
          </h1>
          <p className="text-muted-foreground text-lg">Modern workspaces designed for productivity and prestige.</p>
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
