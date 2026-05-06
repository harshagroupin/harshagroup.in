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
}

export default function PropertyCard({ image, video, title, location, price, area, type, features }: Props) {
  const hasVideo = video && video.trim().length > 0;

  // Extract YouTube embed URL
  const getYoutubeEmbed = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0` : null;
  };

  return (
    <div className="glass rounded-md overflow-hidden hover-tilt group">
      <div className="relative overflow-hidden h-56">
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
        <div className="absolute top-4 left-4 px-3 py-1 rounded-sm text-xs font-semibold bg-background/90 text-primary backdrop-blur-md border border-primary/20 uppercase tracking-wider">
          {type}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin size={14} className="text-primary" />
          {location}
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="gold-text font-bold text-lg">{price}</span>
          <span className="text-muted-foreground text-sm">{area}</span>
        </div>

        {/* Features - 4 per row, wrap to next line */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {features.map((f) => (
              <span
                key={f}
                className="text-center px-2 py-1 rounded-sm text-[10px] font-medium bg-muted/50 text-muted-foreground border border-border/50 truncate"
                title={f}
              >
                {f}
              </span>
            ))}
          </div>
        )}

        <Link to="/contact">
          <Button className="w-full gold-gradient text-primary-foreground hover:opacity-90">
            Enquire Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
