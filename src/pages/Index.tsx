import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const navigate = useNavigate();
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
    
    return restaurants.map((restaurant, index) => ({
      id: restaurant.id,
      name: restaurant.name,
      image: restaurant.image_url === '/placeholder.svg' 
        ? Object.values(imageMap)[index % Object.values(imageMap).length]
        : restaurant.image_url,
      rating: restaurant.rating,
      category: restaurant.category,
      distance: restaurant.distance,
    }));
  }, [restaurants]);

  // Organizar restaurantes por seções baseado nas categorias
  const restaurantSections = useMemo(() => {
    if (transformedRestaurants.length === 0) return { bestInCity: [], bestInRegion: [], forYou: [], newRestaurants: [], topOfWeek: [] };

    // Filtrar por rating alto para "Melhores da Cidade"
    const bestInCity = transformedRestaurants
      .filter(r => r.rating >= 4.5)
      .slice(0, 4);

    // Filtrar por categorias específicas para "Melhores da Região"
    const bestInRegion = transformedRestaurants
      .filter(r => ['Brasileira', 'Regional', 'Churrasco'].includes(r.category))
      .slice(0, 4);

    // Filtrar por rating médio-alto para "Para Você"
    const forYou = transformedRestaurants
      .filter(r => r.rating >= 4.0 && r.rating < 4.5)
      .slice(0, 4);

    // Filtrar por categorias modernas para "Novos Restaurantes"
    const newRestaurants = transformedRestaurants
      .filter(r => ['Fast Food', 'Café', 'Açaí'].includes(r.category))
      .slice(0, 4);

    // Filtrar por categorias internacionais para "Top da Semana"
    const topOfWeek = transformedRestaurants
      .filter(r => ['Italiana', 'Japonesa', 'Pizza'].includes(r.category))
      .slice(0, 4);

    return {
      bestInCity,
      bestInRegion,
      forYou,
      newRestaurants,
      topOfWeek,
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
      
      {/* Matching Feature Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-950/20 dark:to-orange-950/20 border-2 border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Heart className="w-6 h-6" />
              Encontre Restaurantes com Amigos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use nosso sistema de matching estilo Tinder para descobrir restaurantes que você e seu amigo vão adorar!
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/matching')}
                className="flex-1"
              >
                <Heart className="w-4 h-4 mr-2" />
                Começar Matching
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/my-matches')}
              >
                <Star className="w-4 h-4 mr-2" />
                Meus Matches
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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