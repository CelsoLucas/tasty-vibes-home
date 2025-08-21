import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  distance: string;
}

export const RestaurantCard = ({ name, image, rating, category, distance }: RestaurantCardProps) => {
  return (
    <Card className="w-[280px] h-[320px] flex-shrink-0 bg-card hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={image} 
            alt={name}
            className="w-full h-[180px] object-cover rounded-t-lg"
          />
          <div className="absolute top-3 right-3 bg-card px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs font-medium text-foreground">{rating}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-base mb-1 line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{category}</p>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{distance}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};