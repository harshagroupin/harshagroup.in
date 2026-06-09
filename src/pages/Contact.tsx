import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <main className="pt-20">
      <SEOHead
        title="Contact Harsha Group — Schedule a Site Visit in Indirapuram"
        description="Contact Harsha Group for commercial property enquiries, site visits, and investment opportunities. Located at Harsha City Mall, Shakti Khand 2, Indirapuram, Ghaziabad. Call +91 8448440725."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Harsha Group",
          "description": "Get in touch for enquiries, site visits, or investment opportunities in commercial real estate.",
          "url": "https://harshagroup.in/contact",
          "isPartOf": { "@id": "https://harshagroup.in/#website" },
          "mainEntity": {
            "@type": "LocalBusiness",
            "name": "Harsha Group",
            "telephone": "+918448440725",
            "email": "info@harshagroup.in",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Harsha City Mall, Shakti Khand 2",
              "addressLocality": "Indirapuram, Ghaziabad",
              "addressRegion": "Uttar Pradesh",
              "postalCode": "201014",
              "addressCountry": "IN",
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 28.6359,
              "longitude": 77.3701,
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              "opens": "10:00",
              "closes": "19:00",
            },
          },
        }}
      />

      <Breadcrumb items={[{ label: "Contact" }]} />

      <section className="section-padding" aria-label="Contact information">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                Contact <span className="gold-text">Us</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We'd love to hear from you. Get in touch for enquiries, site visits, or investment opportunities.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ScrollReveal>
              <div className="space-y-8">
                {[
                  { icon: MapPin, label: "Address", value: "Harsha City Mall, Shakti Khand 2, Indirapuram, Ghaziabad, Uttar Pradesh, India — 201014" },
                  { icon: Phone, label: "Phone", value: "+91 8448440725", href: "tel:+918448440725" },
                  { icon: Mail, label: "Email", value: "info@harshagroup.in", href: "mailto:info@harshagroup.in" },
                  { icon: Clock, label: "Business Hours", value: "Mon - Sat: 10:00 AM - 7:00 PM" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 glass-ai rounded-xl p-5 gold-border-glow">
                    <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">{item.value}</a>
                      ) : (
                        <p className="text-muted-foreground text-sm">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="glass-ai rounded-2xl overflow-hidden h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.768!2d77.3701!3d28.6359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf1b6c2b6a6d5%3A0x30f24c60e5d87de4!2sHarsha%20City%20Mall!5e0!3m2!1sen!2sin!4v1716000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Harsha Group Location — Harsha City Mall, Shakti Khand 2, Indirapuram, Ghaziabad"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ContactForm />
    </main>
  );
}
