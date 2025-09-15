import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AppHeader } from "@/components/AppHeader";
import { useCategories } from "@/hooks/useCategories";
import { useRestaurants } from "@/hooks/useRestaurants";

const mockResults = [
  {
    id: 1,
    name: "Burger Palace",
    category: "Lanches",
    rating: 4.5,
    distance: "0.8 km",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Pasta House",
    category: "Massas", 
    rating: 4.2,
    distance: "1.2 km",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Sushi Express",
    category: "Japonês",
    rating: 4.8,
    distance: "2.1 km", 
    image: "/placeholder.svg"
  }
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: restaurants, isLoading: restaurantsLoading } = useRestaurants();
  
  // Transformar dados dos restaurantes para o formato esperado
  const transformedRestaurants = restaurants?.map(restaurant => ({
    id: restaurant.id,
    name: restaurant.name,
    category: restaurant.category,
    rating: Number(restaurant.rating),
    distance: restaurant.distance,
    image: restaurant.image_url || "/placeholder.svg"
  })) || [];
  
  // Filtrar restaurantes baseado na busca e categoria
  const filteredResults = transformedRestaurants.filter(restaurant => {
    const matchesSearch = searchQuery === "" || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      restaurant.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryName: string) => {
    const newCategory = selectedCategory === categoryName ? null : categoryName;
    setSelectedCategory(newCategory);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader />
      
      {/* Campo de busca */}
      <div className="p-4 bg-background border-b border-border">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar restaurantes, pratos..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 h-12 bg-card border-border"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 border-border"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carrossel de categorias */}
      <div className="p-4">
        {categoriesLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-24 bg-muted animate-pulse rounded-md flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => handleCategorySelect(category.name)}
                className="flex-shrink-0 gap-2 h-12 px-4"
              >
                <span className="text-lg">{category.emoji}</span>
                <span className="whitespace-nowrap">{category.name}</span>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Resultados */}
      <div className="px-4 pb-20">
        {restaurantsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {filteredResults.length} resultado{filteredResults.length !== 1 ? 's' : ''} encontrado{filteredResults.length !== 1 ? 's' : ''}
            </h3>
            <div className="grid gap-4">
              {filteredResults.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Imagem */}
                      <div className="w-24 h-24 bg-gray-200 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Informações */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{item.distance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Estado vazio */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Tente buscar por outro termo ou explore diferentes categorias
            </p>
          </div>
        )}
      </div>

      {/* Menu inferior fixo */}
      <BottomNavigation />
    </div>
  );
};

export default SearchPage;