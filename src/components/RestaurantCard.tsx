import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useRestaurantStats } from "@/hooks/useRestaurants";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  distance: string;
}

export const RestaurantCard = ({ id, name, image, rating, category, distance }: RestaurantCardProps) => {
  const navigate = useNavigate();
  const { data: stats } = useRestaurantStats(id);

  const handleClick = () => {
    navigate(`/restaurant/${id}`);
  };

  const displayRating = stats?.averageRating || rating;
  const reviewCount = stats?.totalReviews || 0;

  return (
    <Card 
      className="w-[240px] h-[280px] flex-shrink-0 bg-card hover:shadow-lg transition-all duration-300 border-0 shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={image} 
            alt={name}
            className="w-full h-[150px] object-cover rounded-t-lg"
          />
          <div className="absolute top-3 right-3 bg-card px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs font-medium text-foreground">{displayRating}</span>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{category}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{distance}</span>
            </div>
            {reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {reviewCount} avaliações
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};