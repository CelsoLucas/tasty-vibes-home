import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Star, Home, Plus, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const categories = [
  { id: "lanches", name: "Lanches", emoji: "🍔" },
  { id: "massas", name: "Massas", emoji: "🍝" },
  { id: "japones", name: "Japonês", emoji: "🍣" },
  { id: "pizza", name: "Pizza", emoji: "🍕" },
  { id: "saudavel", name: "Saudável", emoji: "🥗" },
  { id: "cafes", name: "Cafés", emoji: "☕" }
];

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
  const [results, setResults] = useState(mockResults);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implementar lógica de busca real
    if (query.trim() === "") {
      setResults(mockResults);
    } else {
      const filtered = mockResults.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategory);
    
    if (newCategory) {
      const filtered = mockResults.filter(item =>
        item.category.toLowerCase().includes(newCategory.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(mockResults);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header com busca */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4">
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
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategorySelect(category.id)}
              className="flex-shrink-0 gap-2 h-12 px-4"
            >
              <span className="text-lg">{category.emoji}</span>
              <span className="whitespace-nowrap">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div className="px-4 pb-20">
        {results.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </h3>
            <div className="grid gap-4">
              {results.map((item) => (
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

const BottomNavigation = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Pesquisar", path: "/search" },
    { icon: Plus, label: "Avaliar", path: "/review" },
    { icon: User, label: "Perfil", path: "/profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;