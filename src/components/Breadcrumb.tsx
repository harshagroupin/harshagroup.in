import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Visual breadcrumb with BreadcrumbList JSON-LD schema.
 * Renders both the visible UI and structured data for search engines.
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { pathname } = useLocation();

  // Build full breadcrumb list with Home
  const fullItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...items,
  ];

  // JSON-LD for BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": fullItems.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.label,
      "item": item.href
        ? `https://harshagroup.in${item.href}`
        : `https://harshagroup.in${pathname}`,
    })),
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-2"
      >
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          {fullItems.map((item, i) => {
            const isLast = i === fullItems.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i === 0 && <Home size={14} className="text-primary/60" />}
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-foreground font-medium" : ""}>
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight size={12} className="text-muted-foreground/40" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
