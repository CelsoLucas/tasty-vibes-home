import { AppHeader } from "@/components/AppHeader";
import { RestaurantSection } from "@/components/RestaurantSection";
import { BottomNavigation } from "@/components/BottomNavigation";

// Import restaurant images
import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";
import restaurant4 from "@/assets/restaurant-4.jpg";
import restaurant5 from "@/assets/restaurant-5.jpg";

const Index = () => {
  // Dados reais de restaurantes
  const bestInCity = [
    { id: "1", name: "McDonald's", image: restaurant1, rating: 4.3, category: "Fast Food", distance: "0.5 km" },
    { id: "2", name: "Outback Steakhouse", image: restaurant2, rating: 4.6, category: "Steakhouse", distance: "1.2 km" },
    { id: "3", name: "Habib's", image: restaurant3, rating: 4.1, category: "Árabe", distance: "0.8 km" },
    { id: "4", name: "Burger King", image: restaurant4, rating: 4.2, category: "Fast Food", distance: "2.1 km" },
  ];

  const bestInRegion = [
    { id: "5", name: "Pizza Hut", image: restaurant5, rating: 4.4, category: "Pizza", distance: "3.2 km" },
    { id: "6", name: "Fogo de Chão", image: restaurant1, rating: 4.7, category: "Churrasco", distance: "2.8 km" },
    { id: "7", name: "Subway", image: restaurant2, rating: 4.0, category: "Sanduíches", distance: "1.9 km" },
    { id: "8", name: "Spoleto", image: restaurant3, rating: 4.3, category: "Italiana", distance: "4.1 km" },
  ];

  const forYou = [
    { id: "9", name: "Starbucks", image: restaurant4, rating: 4.5, category: "Café", distance: "0.3 km" },
    { id: "10", name: "Bob's", image: restaurant5, rating: 3.9, category: "Fast Food", distance: "1.1 km" },
    { id: "11", name: "Rei do Mate", image: restaurant1, rating: 4.2, category: "Bebidas", distance: "0.7 km" },
    { id: "12", name: "Giraffas", image: restaurant2, rating: 4.0, category: "Fast Food", distance: "1.5 km" },
  ];

  const newRestaurants = [
    { id: "13", name: "China in Box", image: restaurant3, rating: 4.1, category: "Chinesa", distance: "2.3 km" },
    { id: "14", name: "Vivenda do Camarão", image: restaurant4, rating: 4.5, category: "Frutos do Mar", distance: "1.8 km" },
    { id: "15", name: "Coco Bambu", image: restaurant5, rating: 4.6, category: "Frutos do Mar", distance: "3.0 km" },
    { id: "16", name: "KFC", image: restaurant1, rating: 4.2, category: "Fast Food", distance: "0.9 km" },
  ];

  const topOfWeek = [
    { id: "17", name: "Madero", image: restaurant2, rating: 4.8, category: "Hambúrgueres Gourmet", distance: "2.5 km" },
    { id: "18", name: "Açaí da Praia", image: restaurant3, rating: 4.4, category: "Açaí", distance: "1.3 km" },
    { id: "19", name: "Pão de Açúcar", image: restaurant4, rating: 4.3, category: "Padaria", distance: "0.6 km" },
    { id: "20", name: "Rubaiyat", image: restaurant5, rating: 4.7, category: "Fine Dining", distance: "3.5 km" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      
      <main className="space-y-6 pt-4 pb-4">
        <RestaurantSection title="Melhores da Cidade" restaurants={bestInCity} />
        <RestaurantSection title="Melhores da Região" restaurants={bestInRegion} />
        <RestaurantSection title="Para Você" restaurants={forYou} />
        <RestaurantSection title="Novos Restaurantes" restaurants={newRestaurants} />
        <RestaurantSection title="Top da Semana" restaurants={topOfWeek} />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
