import { AppHeader } from "@/components/AppHeader";
import { RestaurantSection } from "@/components/RestaurantSection";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useMemo } from "react";

// Import restaurant images
import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";
import restaurant4 from "@/assets/restaurant-4.jpg";
import restaurant5 from "@/assets/restaurant-5.jpg";

const Index = () => {
  const { data: restaurants, isLoading, error } = useRestaurants();

  // Map das imagens locais
  const imageMap = {
    '/src/assets/restaurant-1.jpg': restaurant1,
    '/src/assets/restaurant-2.jpg': restaurant2,
    '/src/assets/restaurant-3.jpg': restaurant3,
    '/src/assets/restaurant-4.jpg': restaurant4,
    '/src/assets/restaurant-5.jpg': restaurant5,
  };

  // Transformar dados do banco para o formato esperado pelos componentes
  const transformedRestaurants = useMemo(() => {
    if (!restaurants) return [];
    
    return restaurants.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      image: imageMap[restaurant.image_url as keyof typeof imageMap] || restaurant1,
      rating: restaurant.rating,
      category: restaurant.category,
      distance: restaurant.distance,
    }));
  }, [restaurants]);

  // Organizar restaurantes por seções
  const restaurantSections = useMemo(() => {
    if (transformedRestaurants.length === 0) return { bestInCity: [], bestInRegion: [], forYou: [], newRestaurants: [], topOfWeek: [] };

    // Dividir em grupos de 4
    const chunkSize = 4;
    const chunks = [];
    for (let i = 0; i < transformedRestaurants.length; i += chunkSize) {
      chunks.push(transformedRestaurants.slice(i, i + chunkSize));
    }

    return {
      bestInCity: chunks[0] || [],
      bestInRegion: chunks[1] || [],
      forYou: chunks[2] || [],
      newRestaurants: chunks[3] || [],
      topOfWeek: chunks[4] || [],
    };
  }, [transformedRestaurants]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <main className="space-y-6 pt-4 pb-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando restaurantes...</p>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <main className="space-y-6 pt-4 pb-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-2">Erro ao carregar restaurantes</p>
              <p className="text-muted-foreground">Tente novamente mais tarde</p>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      
      <main className="space-y-6 pt-4 pb-4">
        <RestaurantSection title="Melhores da Cidade" restaurants={restaurantSections.bestInCity} />
        <RestaurantSection title="Melhores da Região" restaurants={restaurantSections.bestInRegion} />
        <RestaurantSection title="Para Você" restaurants={restaurantSections.forYou} />
        <RestaurantSection title="Novos Restaurantes" restaurants={restaurantSections.newRestaurants} />
        <RestaurantSection title="Top da Semana" restaurants={restaurantSections.topOfWeek} />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
