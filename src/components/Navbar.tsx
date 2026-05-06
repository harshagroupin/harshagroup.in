import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/our-spaces", label: "Our Spaces" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/50 backdrop-blur-md border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Harsha Group Logo" className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105" />
          <div className="flex flex-col justify-center">
            <span className="font-serif text-lg md:text-xl font-bold tracking-tight gold-text leading-none">
              Harsha Group
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-1 font-medium">Real Estate</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-all duration-300 hover:text-primary relative group ${pathname === l.to ? "text-primary" : "text-foreground/80"
                }`}
            >
              {l.label}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${pathname === l.to ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-md border-t border-border/30 animate-fade-up">
          <div className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium py-2 ${pathname === l.to ? "text-primary" : "text-foreground/80"
                  }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

