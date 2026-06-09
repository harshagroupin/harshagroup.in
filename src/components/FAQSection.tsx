import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  /** Page slug for schema identification */
  pageId?: string;
}

/**
 * FAQ Accordion with FAQPage JSON-LD schema for Google featured snippets.
 */
export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle,
  faqs,
  pageId = "homepage",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  // FAQPage JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section className="section-padding" id={`faq-${pageId}`} aria-label="Frequently Asked Questions">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {title.split(" ").map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} className="gold-text">{word}</span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div
                className={`glass rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === i
                    ? "border-primary/30 shadow-[0_0_20px_rgba(196,160,56,0.08)]"
                    : "hover:border-primary/15"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${pageId}-${i}`}
                >
                  <h3 className="font-serif text-base md:text-lg font-semibold pr-2 group-hover:text-primary transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={20}
                    className={`text-primary shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  id={`faq-answer-${pageId}-${i}`}
                  role="region"
                  className={`overflow-hidden transition-all duration-400 ease-out ${
                    openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 text-muted-foreground text-sm md:text-base leading-relaxed border-t border-border/30 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
