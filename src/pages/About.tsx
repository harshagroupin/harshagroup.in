import ScrollReveal from "@/components/ScrollReveal";
import buildingImg from "@/assets/building-exterior.jpg";
import officeImg from "@/assets/office-space-2.jpg";
import { Building2, Eye, Target, Award } from "lucide-react";

export default function About() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={buildingImg} alt="Harsha Group building" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            About <span className="gold-text">Harsha Group</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Building trust, delivering excellence since 2009.</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                A Legacy of <span className="gold-text">Excellence</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Harsha Group has been at the forefront of commercial real estate in Indirapuram, Ghaziabad for over 15 years. We specialize in premium commercial properties including office spaces, retail outlets, and mall spaces.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our flagship project, Harsha City Mall, stands as a testament to our commitment to quality, design, and value creation. Located in the heart of Shakti Khand 2, it has become a thriving commercial hub.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We partner with leading brands and businesses to create spaces that inspire growth, foster innovation, and deliver exceptional returns on investment.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <img src={officeImg} alt="Our office spaces" loading="lazy" className="rounded-2xl w-full object-cover h-[400px]" />
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-card/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Target, title: "Our Mission", desc: "To deliver world-class commercial spaces that empower businesses to thrive, while creating sustainable value for our investors and partners." },
            { icon: Eye, title: "Our Vision", desc: "To be the most trusted name in commercial real estate, setting new benchmarks for quality, innovation, and customer satisfaction in North India." },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div className="glass rounded-2xl p-8 md:p-10 h-full">
                <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-6">
                  <item.icon size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
                Why <span className="gold-text">Trust Us</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Award, title: "Award-Winning Projects", desc: "Recognized for excellence in commercial real estate development." },
              { icon: Building2, title: "50+ Projects Delivered", desc: "A robust portfolio of successful commercial developments across NCR." },
              { icon: Target, title: "1200+ Happy Clients", desc: "A growing community of satisfied investors and business owners." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 text-center hover-tilt">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl gold-gradient flex items-center justify-center">
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
    </main>
  );
}
