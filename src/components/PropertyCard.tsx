import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  image: string;
  title: string;
  location: string;
  price: string;
  area: string;
  type: string;
}

export default function PropertyCard({ image, title, location, price, area, type }: Props) {
  return (
    <div className="glass rounded-2xl overflow-hidden hover-tilt group">
      <div className="relative overflow-hidden h-56">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold gold-gradient text-primary-foreground">
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
        <Link to="/contact">
          <Button className="w-full gold-gradient text-primary-foreground hover:opacity-90">
            Enquire Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
