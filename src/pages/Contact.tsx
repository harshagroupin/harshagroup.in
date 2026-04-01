import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <main className="pt-20">
      <section className="section-padding">
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
                  { icon: MapPin, label: "Address", value: "Harsha City Mall, Shakti Khand 2, Indirapuram, Ghaziabad, Uttar Pradesh, India" },
                  { icon: Phone, label: "Phone", value: "+91 8595540725", href: "tel:+918595540725" },
                  { icon: Mail, label: "Email", value: "info@harshagroup.in", href: "mailto:info@harshagroup.in" },
                  { icon: Clock, label: "Business Hours", value: "Mon - Sat: 10:00 AM - 7:00 PM" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 glass rounded-xl p-5">
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
              <div className="glass rounded-2xl overflow-hidden h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.37!3d28.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM4JzAuMCJOIDc3wrAyMicwLjAiRQ!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Harsha Group Location"
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
