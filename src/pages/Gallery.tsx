import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { X } from "lucide-react";
import heroImg from "@/assets/hero-mall.jpg";
import officeImg1 from "@/assets/office-space-1.jpg";
import officeImg2 from "@/assets/office-space-2.jpg";
import shopImg1 from "@/assets/shop-space-1.jpg";
import shopImg2 from "@/assets/shop-space-2.jpg";
import buildingImg from "@/assets/building-exterior.jpg";
import galleryImg1 from "@/assets/gallery-1.jpg";
import galleryImg2 from "@/assets/gallery-2.jpg";

const images = [
  { src: heroImg, alt: "Luxury mall interior" },
  { src: officeImg1, alt: "Premium office space" },
  { src: shopImg1, alt: "Retail outlet" },
  { src: buildingImg, alt: "Building exterior" },
  { src: officeImg2, alt: "Co-working space" },
  { src: shopImg2, alt: "Food court area" },
  { src: galleryImg1, alt: "Conference room" },
  { src: galleryImg2, alt: "Mall escalators" },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <main className="pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                Our <span className="gold-text">Gallery</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A glimpse into our premium commercial spaces and developments.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div
                  className="relative overflow-hidden rounded-xl cursor-pointer group aspect-[4/3]"
                  onClick={() => setLightbox(i)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground font-medium">View</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors" onClick={() => setLightbox(null)}>
            <X size={32} />
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
