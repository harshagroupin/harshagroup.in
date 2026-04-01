import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/60 border-t border-border/30 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-serif text-2xl font-bold gold-text mb-4">Harsha Group</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Premium commercial real estate solutions in Indirapuram, Ghaziabad. Your trusted partner for shops, offices, and retail spaces.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Us" },
              { to: "/office-space", label: "Office Space" },
              { to: "/shops", label: "Shops & Outlets" },
              { to: "/gallery", label: "Gallery" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Services</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>Commercial Leasing</span>
            <span>Office Spaces</span>
            <span>Retail Outlets</span>
            <span>Mall Spaces</span>
            <span>Property Investment</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              <span>Harsha City Mall, Shakti Khand 2, Indirapuram, Ghaziabad, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-primary shrink-0" />
              <a href="tel:+918595540725" className="hover:text-primary transition-colors">+91 8595540725</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-primary shrink-0" />
              <span>info@harshagroup.in</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Harsha Group. All rights reserved.
      </div>
    </footer>
  );
}
