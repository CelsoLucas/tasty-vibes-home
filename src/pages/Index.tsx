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
  // Mock restaurant data
  const bestInCity = [
    { id: "1", name: "Burger Palace", image: restaurant1, rating: 4.8, category: "Hambúrgueres", distance: "0.5 km" },
    { id: "2", name: "Pasta Italiana", image: restaurant2, rating: 4.7, category: "Italiana", distance: "1.2 km" },
    { id: "3", name: "Sushi Zen", image: restaurant3, rating: 4.9, category: "Japonesa", distance: "0.8 km" },
    { id: "4", name: "Taco Loco", image: restaurant4, rating: 4.6, category: "Mexicana", distance: "2.1 km" },
  ];

  const bestInRegion = [
    { id: "5", name: "Pizza Artesanal", image: restaurant5, rating: 4.8, category: "Pizza", distance: "3.2 km" },
    { id: "6", name: "Grill Master", image: restaurant1, rating: 4.7, category: "Churrasco", distance: "2.8 km" },
    { id: "7", name: "Veggie Delight", image: restaurant2, rating: 4.6, category: "Vegetariana", distance: "1.9 km" },
    { id: "8", name: "Ocean View", image: restaurant3, rating: 4.9, category: "Frutos do Mar", distance: "4.1 km" },
  ];

  const forYou = [
    { id: "9", name: "Café da Manhã +", image: restaurant4, rating: 4.5, category: "Café", distance: "0.3 km" },
    { id: "10", name: "Doce Momento", image: restaurant5, rating: 4.8, category: "Sobremesas", distance: "1.1 km" },
    { id: "11", name: "Fit & Healthy", image: restaurant1, rating: 4.7, category: "Saudável", distance: "0.7 km" },
    { id: "12", name: "Sabor Caseiro", image: restaurant2, rating: 4.6, category: "Comida Caseira", distance: "1.5 km" },
  ];

  const newRestaurants = [
    { id: "13", name: "Ramen House", image: restaurant3, rating: 4.4, category: "Japonesa", distance: "2.3 km" },
    { id: "14", name: "BBQ Central", image: restaurant4, rating: 4.5, category: "Churrasco", distance: "1.8 km" },
    { id: "15", name: "Thai Spice", image: restaurant5, rating: 4.7, category: "Tailandesa", distance: "3.0 km" },
    { id: "16", name: "Gelato Express", image: restaurant1, rating: 4.6, category: "Sorvetes", distance: "0.9 km" },
  ];

  const topOfWeek = [
    { id: "17", name: "Steakhouse Elite", image: restaurant2, rating: 4.9, category: "Steakhouse", distance: "2.5 km" },
    { id: "18", name: "Fresh Salads", image: restaurant3, rating: 4.8, category: "Saladas", distance: "1.3 km" },
    { id: "19", name: "Bakery Corner", image: restaurant4, rating: 4.7, category: "Padaria", distance: "0.6 km" },
    { id: "20", name: "Wine & Dine", image: restaurant5, rating: 4.9, category: "Fine Dining", distance: "3.5 km" },
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
