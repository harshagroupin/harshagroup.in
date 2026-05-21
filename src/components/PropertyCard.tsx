import { Button } from "@/components/ui/button";
import { MapPin, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  image: string;
  video?: string | null;
  title: string;
  location: string;
  price: string;
  area: string;
  type: string;
  features?: string[] | null;
  minimal?: boolean;
  showEnquire?: boolean;
  onEnquire?: (title: string, location: string) => void;
}

export default function PropertyCard({ image, video, title, location, price, area, type, features, minimal = false, showEnquire = true, onEnquire }: Props) {
  const hasVideo = video && video.trim().length > 0;

  // Extract YouTube embed URL
  const getYoutubeEmbed = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0` : null;
  };

  // Helper to format price/rate professionally
  const formatPrice = (p: string) => {
    if (!p) return "";
    const trimmed = p.trim();
    // If it already contains format chars like ₹, /mo, Cr, Lakh, return as is
    if (/[₹a-zA-Z]/i.test(trimmed)) return trimmed;
    const cleaned = trimmed.replace(/[^\d]/g, '');
    if (!cleaned) return trimmed;
    const num = parseInt(cleaned, 10);
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Helper to format area/sq ft professionally
  const formatArea = (a: string) => {
    if (!a) return "";
    const trimmed = a.trim();
    if (trimmed.toLowerCase().includes('sq') || /[a-zA-Z]/.test(trimmed)) return trimmed;
    return `${trimmed} sq ft`;
  };

  // Filter out display locations stored in features
  const filteredFeatures = (features || []).filter(
    (f) => !["homepage", "our_spaces", "gallery", "none"].includes(f)
  );

  return (
    <div className="glass rounded-md overflow-hidden hover-tilt group h-full flex flex-col">
      <div className="relative overflow-hidden h-72 flex-shrink-0 bg-secondary/30">
        {hasVideo ? (
          <>
            {/* Video thumbnail or embed */}
            {getYoutubeEmbed(video!) ? (
              <iframe
                src={getYoutubeEmbed(video!)!}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
              />
            ) : (
              <video
                src={video!}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                onMouseLeave={(e) => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
              />
            )}
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-sm text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md flex items-center gap-1 border border-white/10">
              <Play size={10} className="fill-current" /> Video
            </div>
          </>
        ) : (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        {type && type.trim().length > 0 && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-sm text-xs font-semibold bg-background/90 text-primary backdrop-blur-md border border-primary/20 uppercase tracking-wider">
            {type}
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <Link
          to="/our-spaces"
          className="flex-1 flex flex-col cursor-pointer group/info"
        >
          <h3 className="font-serif text-lg font-semibold mb-1 group-hover/info:text-primary transition-colors">{title}</h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
            <MapPin size={14} className="text-primary flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>

          {!minimal && (
            <>
              {(price || area) && (
                <div className="flex items-center justify-between mb-2">
                  <span className="gold-text font-bold text-lg">{formatPrice(price)}</span>
                  <span className="text-muted-foreground text-sm">{formatArea(area)}</span>
                </div>
              )}

              {/* Features - 4 per row, wrap to next line */}
              {filteredFeatures.length > 0 && (
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {filteredFeatures.map((f) => (
                    <span
                      key={f}
                      className="text-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-muted/50 text-muted-foreground border border-border/50 truncate"
                      title={f}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </Link>

        {showEnquire && (
          onEnquire ? (
            <button
              onClick={() => onEnquire(title, location)}
              className="mt-auto w-full py-2 rounded-md gold-gradient text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Enquire Now
            </button>
          ) : (
            <Link
              to={`/contact?property=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`}
              className="mt-auto"
            >
              <Button className="w-full gold-gradient text-primary-foreground hover:opacity-90">
                Enquire Now
              </Button>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
