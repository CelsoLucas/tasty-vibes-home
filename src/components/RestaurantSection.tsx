import { RestaurantCard } from "./RestaurantCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface RestaurantSectionProps {
  title: string;
  restaurants: Array<{
    id: string;
    name: string;
    image: string;
    rating: number;
    category: string;
    distance: string;
  }>;
}

export const RestaurantSection = ({ title, restaurants }: RestaurantSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground px-4">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 px-4 pr-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};