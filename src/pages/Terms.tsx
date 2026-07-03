import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import ScrollReveal from "@/components/ScrollReveal";

export default function Terms() {
  return (
    <main className="pt-20">
      <SEOHead
        title="Terms & Conditions — Harsha Group"
        description="Read the Terms and Conditions of Harsha Group. Understand details about our listings, fractional ownership model, and marketing communication consent."
      />

      <Breadcrumb items={[{ label: "Terms & Conditions" }]} />

      <section className="section-padding" aria-label="Terms and Conditions Content">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Terms & <span className="gold-text">Conditions</span>
              </h1>
              <p className="text-muted-foreground text-sm">Last Updated: July 3, 2026</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="glass-ai rounded-2xl p-6 md:p-10 space-y-8 gold-border-glow text-muted-foreground leading-relaxed text-sm md:text-base">
              <div className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">1. Introduction</h2>
                <p>
                  Welcome to the official website of Harsha Group (referred to as "we", "us", "our", or "Company"). By accessing or using our website, properties portal, services, or submitting contact inquiries, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, please do not use this website.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">2. Use of the Website</h2>
                <p>
                  You agree to use this website only for lawful purposes related to seeking commercial real estate properties, fractional investments, or business inquiries. You are prohibited from using the site to transmit false details, engage in unauthorized scraping, or disrupt the platform's security.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">3. Property Information Accuracy & Disclaimer</h2>
                <p>
                  All property descriptions, layouts, measurements, prices, projected yields, and images provided on this website are for general informational and illustrative purposes only. While we endeavor to keep the details accurate and updated:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Actual properties may vary in configuration, design, and dimensions.</li>
                  <li>Availability of spaces, leasing terms, and prices are subject to change without prior notice.</li>
                  <li>Investors and tenants are strongly advised to perform independent site visits, legal checks, and verification before signing final deeds or leasing agreements.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">4. Fractional Ownership Model Disclaimer</h2>
                <p>
                  Information relating to our Fractional Ownership Model is intended for educational and consultative purposes only and does not constitute a formal solicitation, financial advice, or underwriting.
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Fractional investment models carry market, leasing, and liquidity risks. Past rental yield performance does not guarantee future results.</li>
                  <li>Any financial projections or yields are estimates based on prevailing market conditions and are subject to variation.</li>
                  <li>All formal investments are bound solely by the terms executed in the legal Co-ownership Agreement and Deed of Assignment.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">5. Consent for Marketing and Communication</h2>
                <p>
                  By submitting your phone number, email address, name, or other contact details on any inquiry form on this website, you explicitly consent to the following:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Communication Channels:</strong> You agree to receive informative, promotional, transactional, and follow-up communications from Harsha Group and its authorized marketing partners via <strong>SMS, WhatsApp, RCS (Rich Communication Services), and Email</strong>.
                  </li>
                  <li>
                    <strong>Meta Reach Marketing:</strong> You expressly authorize <strong>Meta Reach Marketing</strong> (and other marketing automation providers utilized by us) to process your data and send communication campaigns to your registered contact coordinates.
                  </li>
                  <li>
                    <strong>DND Override:</strong> Your consent overrides any registrations under Do Not Disturb (DND) or National Customer Preference Register (NCPR) registries, in compliance with applicable telecommunication regulatory guidelines.
                  </li>
                  <li>
                    <strong>Opt-out:</strong> You may unsubscribe or opt-out of marketing communications at any time by clicking the "unsubscribe" link in emails, replying with "STOP" to SMS/WhatsApp messages, or by writing to us directly at <a href="mailto:info@harshagroup.in" className="text-primary hover:underline">info@harshagroup.in</a>.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">6. Intellectual Property Rights</h2>
                <p>
                  All content on this website, including text, graphics, logos, images, site layouts, and software, is the property of Harsha Group and is protected by Indian and international copyright and trademark laws. You may not copy, reproduce, republish, or distribute any material without our explicit written consent.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">7. Limitation of Liability</h2>
                <p>
                  In no event shall Harsha Group, its directors, employees, or marketing associates be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of or inability to use this website, or reliance on any information presented herein.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">8. Governing Law & Jurisdiction</h2>
                <p>
                  These terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with these Terms or website usage shall be subject to the exclusive jurisdiction of the competent courts in <strong>Ghaziabad, Uttar Pradesh, India</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">9. Contact Information</h2>
                <p>
                  For any queries, feedback, or notices regarding these Terms, please contact us:
                </p>
                <div className="pt-2 space-y-1">
                  <p><strong>Harsha Group</strong></p>
                  <p>Address: Harsha City Mall, Shakti Khand 2, Indirapuram, Ghaziabad, UP 201014, India</p>
                  <p>Phone: <a href="tel:+918448440725" className="text-primary hover:underline">+91 8448440725</a></p>
                  <p>Email: <a href="mailto:info@harshagroup.in" className="text-primary hover:underline">info@harshagroup.in</a></p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
