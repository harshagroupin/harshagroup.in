import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ScrollReveal from "@/components/ScrollReveal";
import { submitFractionalInquiry } from "@/lib/cms";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";

interface Props {
  inline?: boolean;
}

export default function FractionalInvestForm({ inline = false }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    investment_budget: "",
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.city.trim() || !form.investment_budget.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await submitFractionalInquiry(form);
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err.message || "Please try again or call us directly.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const bgClass = inline ? "bg-card/40" : "bg-background";

  if (submitted) {
    return (
      <section id="fractional-invest-form" className={`${bgClass} py-20 px-4`} aria-label="Thank you">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gold-gradient mb-6">
            <CheckCircle2 size={32} className="text-primary-foreground" />
          </div>
          <h2 className="font-serif text-3xl font-bold mb-3">
            Application <span className="gold-text">Received</span>
          </h2>
          <p className="text-muted-foreground text-base mb-2">
            Thank you for your interest. Our investment advisor will contact you within <strong className="text-foreground">24 hours</strong>.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            For urgent queries, call us directly at{" "}
            <a href="tel:+918448440725" className="text-primary font-medium hover:underline">
              +91 8448440725
            </a>
          </p>
          <button onClick={() => setSubmitted(false)} className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
            Submit another enquiry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="fractional-invest-form" className={`${bgClass} py-20 md:py-28 px-4`} aria-label="Fractional investment enquiry">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          {/* Header */}
          <div className="mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Fractional Investment Enquiry
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 max-w-xl">
              Speak with an Investment Advisor
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Share your details and we'll prepare a personalised investment proposal within 24 hours. No commitment required.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* Left — why us */}
            <div className="lg:col-span-2 space-y-0 border border-border/40 rounded-2xl overflow-hidden hidden lg:block">
              <div className="bg-card/60 p-8">
                <h3 className="font-serif text-xl font-bold mb-6">Why Harsha Group?</h3>
                <ul className="space-y-5">
                  {[
                    { num: "15+", label: "Years of trusted operations in Indirapuram" },
                    { num: "₹500Cr+", label: "Commercial real estate portfolio managed" },
                    { num: "1,200+", label: "Satisfied investors and business clients" },
                    { num: "100%", label: "Legally documented, registered share deeds" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 pb-5 border-b border-border/30 last:border-b-0 last:pb-0">
                      <span className="font-serif text-2xl font-bold gold-text leading-none flex-shrink-0 w-24">{item.num}</span>
                      <span className="text-muted-foreground text-sm leading-relaxed pt-1">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-primary/5 border-t border-border/30 px-8 py-5 flex items-center gap-3">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Or call us directly</div>
                  <a href="tel:+918448440725" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    +91 8448440725
                  </a>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-3 border border-border/40 rounded-2xl p-7 md:p-10 bg-card/40 space-y-6"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fi-name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="fi-name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={set("name")}
                    className="h-11 bg-background border-border/50 focus:border-primary"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fi-phone" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="fi-phone"
                    placeholder="+91 XXXXX XXXXX"
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    className="h-11 bg-background border-border/50 focus:border-primary"
                    maxLength={20}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fi-email" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  id="fi-email"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  className="h-11 bg-background border-border/50 focus:border-primary"
                  maxLength={255}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fi-city" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    City <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="fi-city"
                    placeholder="e.g. Delhi, Noida"
                    value={form.city}
                    onChange={set("city")}
                    className="h-11 bg-background border-border/50 focus:border-primary"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fi-budget" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Investment Budget <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="fi-budget"
                    placeholder="e.g. ₹25 Lakh, ₹1 Crore"
                    value={form.investment_budget}
                    onChange={set("investment_budget")}
                    className="h-11 bg-background border-border/50 focus:border-primary"
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                id="fractional-invest-submit"
                className="w-full h-12 gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Request Investment Proposal
                    <ArrowRight size={17} />
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your information is confidential and will not be shared with any third party.
              </p>
            </form>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
