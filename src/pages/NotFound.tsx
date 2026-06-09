import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <SEOHead
        title="Page Not Found — Harsha Group"
        description="The page you're looking for doesn't exist or has been moved. Return to Harsha Group homepage."
        noindex={true}
      />

      {/* Subtle background elements */}
      <div className="absolute inset-0 dot-grid opacity-[0.02] pointer-events-none" aria-hidden="true" />

      <div className="text-center max-w-lg relative z-10">
        <div className="mb-6">
          <span className="font-serif text-8xl md:text-9xl font-bold gold-text">404</span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 text-base">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="gold-gradient text-primary-foreground gap-2 px-6 h-11">
              <Home size={16} /> Go to Home
            </Button>
          </Link>
          <Button variant="outline" className="border-primary/30 gap-2 px-6 h-11" onClick={() => window.history.back()}>
            <ArrowLeft size={16} /> Go Back
          </Button>
        </div>
      </div>
    </main>
  );
}
