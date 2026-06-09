import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Manages per-page SEO meta tags via vanilla DOM manipulation.
 * No external dependency needed — works with React SPA routing.
 */
export default function SEOHead({
  title,
  description,
  canonical,
  noindex = false,
  ogImage = "https://harshagroup.in/android-chrome-512x512.png",
  ogType = "website",
  jsonLd,
}: SEOHeadProps) {
  const { pathname } = useLocation();
  const fullCanonical = canonical || `https://harshagroup.in${pathname === "/" ? "" : pathname}`;
  const fullTitle = title.includes("Harsha Group") ? title : `${title} | Harsha Group`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Helper to set/create meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Primary SEO
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", fullCanonical);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", fullCanonical);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:type", ogType);

    // Twitter
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // JSON-LD structured data
    const existingLd = document.querySelector('script[data-seo-head="true"]');
    if (existingLd) existingLd.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-head", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      const ld = document.querySelector('script[data-seo-head="true"]');
      if (ld) ld.remove();
    };
  }, [fullTitle, description, fullCanonical, noindex, ogImage, ogType, jsonLd]);

  return null;
}
