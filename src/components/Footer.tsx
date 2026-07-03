import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="bg-background border-t border-border/50 relative overflow-hidden"
      role="contentinfo"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      {/* AI glow line at top */}
      <div className="ai-line w-full" />

      {/* Subtle dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-[0.02] pointer-events-none" aria-hidden="true" />

      <div className="relative py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Harsha Group Logo" className="w-12 h-12 object-contain" width={48} height={48} />
              <div className="flex flex-col justify-center">
                <span className="font-serif text-xl font-bold tracking-tight text-foreground leading-none">
                  <span className="gold-text">Harsha</span> Group
                </span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest leading-none mt-1.5 font-medium">Real Estate</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium commercial real estate solutions in Indirapuram, Ghaziabad. Your trusted partner for shops, offices, and retail spaces since 2009.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h4 className="font-semibold tracking-tight text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/our-spaces", label: "Our Spaces" },
                { to: "/fractional-model", label: "Fractional Model" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Contact" },
                { to: "/terms-and-conditions", label: "Terms & Conditions" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <div>
            <h4 className="font-semibold tracking-tight text-foreground mb-4">Services</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Commercial Leasing</span>
              <span>Office Spaces</span>
              <span>Retail Outlets</span>
              <span>Mall Spaces</span>
              <span>Property Investment</span>
              <span>Fractional Ownership</span>
            </div>
          </div>

          <address className="not-italic" itemScope itemType="https://schema.org/LocalBusiness">
            <h4 className="font-semibold tracking-tight text-foreground mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <span itemProp="address">Harsha City Mall, Shakti Khand 2, Indirapuram, Ghaziabad, UP 201014, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary shrink-0" />
                <a href="tel:+918448440725" className="hover:text-primary transition-colors" itemProp="telephone">+91 8448440725</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary shrink-0" />
                <a href="mailto:info@harshagroup.in" className="hover:text-primary transition-colors" itemProp="email">info@harshagroup.in</a>
              </div>
            </div>
          </address>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p>© {new Date().getFullYear()} Harsha Group. All rights reserved.</p>
            <span className="hidden sm:inline text-muted-foreground/30">|</span>
            <Link to="/terms-and-conditions" className="hover:text-primary transition-colors text-xs underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-primary">
              Terms & Conditions
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/50">
            Premium Commercial Real Estate in Indirapuram, Ghaziabad
          </p>
        </div>
      </div>
    </footer>
  );
}
