import { useLocation } from "react-router-dom";


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

  // Only inject JSON-LD for SEO — no visual UI rendered
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
