import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ScrollReveal from "./ScrollReveal";
import { submitInquiry } from "@/lib/cms";

export default function ContactForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await submitInquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        message: form.message.trim(),
      });

      if (error) throw error;

      toast({ title: "Application Submitted!", description: "We'll get back to you shortly." });
      setForm({ name: "", phone: "", email: "", address: "", message: "" });
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      toast({ title: "Something went wrong", description: err.message || "Please try again later.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <section id="contact-form" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
              Get In <span className="gold-text">Touch</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ready to invest in premium commercial spaces? Contact us today.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto glass rounded-2xl p-6 md:p-10 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-secondary/50 border-border/40 h-12"
                maxLength={100}
              />
              <Input
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-secondary/50 border-border/40 h-12"
                maxLength={20}
              />
            </div>
            <Input
              placeholder="Email Address *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-secondary/50 border-border/40 h-12"
              maxLength={255}
            />
            <Input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="bg-secondary/50 border-border/40 h-12"
              maxLength={255}
            />
            <Textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="bg-secondary/50 border-border/40 min-h-[120px]"
              maxLength={1000}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 gold-gradient text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
            >
              {loading ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
