import { useState } from "react";
import { ArrowLeft, Heart, Star, MapPin, Phone, Share, MessageCircle, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Mock data for demonstration
const mockRestaurant = {
  id: "1",
  name: "Restaurante Bella Vista",
  category: "Italiana",
  rating: 4.5,
  reviewCount: 128,
  priceRange: "$$",
  location: "Centro, São Paulo",
  description: "Autêntica culinária italiana com pratos tradicionais preparados com ingredientes frescos e importados. Ambiente aconchegante perfeito para jantares românticos.",
  images: [
    "/src/assets/restaurant-1.jpg",
    "/src/assets/restaurant-2.jpg",
    "/src/assets/restaurant-3.jpg",
    "/src/assets/restaurant-4.jpg"
  ],
  logo: "/src/assets/logo.png",
  phone: "+55 11 99999-9999"
};

const mockMenuItems = [
  {
    category: "Entradas",
    items: [
      { id: "1", name: "Bruschetta Italiana", price: "R$ 18,90", image: "/src/assets/restaurant-1.jpg" },
      { id: "2", name: "Antipasto Misto", price: "R$ 32,90", image: "/src/assets/restaurant-2.jpg" }
    ]
  },
  {
    category: "Pratos Principais",
    items: [
      { id: "3", name: "Lasanha Bolonhesa", price: "R$ 45,90", image: "/src/assets/restaurant-3.jpg" },
      { id: "4", name: "Spaghetti Carbonara", price: "R$ 38,90", image: "/src/assets/restaurant-4.jpg" }
    ]
  }
];

const mockReviews = [
  {
    id: "1",
    user: { name: "Maria Silva", avatar: "/src/assets/logo.png" },
    rating: 5,
    comment: "Experiência incrível! A comida estava deliciosa e o atendimento impecável.",
    date: "2024-01-20",
    images: ["/src/assets/restaurant-1.jpg"]
  },
  {
    id: "2",
    user: { name: "João Santos", avatar: "/src/assets/logo.png" },
    rating: 4,
    comment: "Ambiente muito agradável, preços justos. Recomendo!",
    date: "2024-01-18",
    images: []
  }
];

export default function RestaurantProfile() {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleViewMap = () => {
    // TODO: Implementar visualização no mapa
    console.log("Ver no mapa");
  };

  const handleShare = () => {
    // TODO: Implementar compartilhamento
    console.log("Compartilhar");
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${mockRestaurant.phone.replace(/\D/g, '')}`);
  };

  const handleAddReview = () => {
    navigate("/add-review");
  };

  const handleViewAllReviews = () => {
    // TODO: Implementar página de todas as avaliações
    console.log("Ver todas as avaliações");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* Cabeçalho Secundário */}
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Button>
        
        <h1 className="text-lg font-semibold text-foreground flex-1 text-center px-4">
          {mockRestaurant.name}
        </h1>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleFavorite}
          className={isFavorite ? "text-destructive" : "text-muted-foreground"}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </header>

      <main className="pb-20">
        {/* Carrossel de Fotos */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {mockRestaurant.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-64 w-full">
                    <img 
                      src={image} 
                      alt={`${mockRestaurant.name} - Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
          
          {/* Logo opcional */}
          {mockRestaurant.logo && (
            <div className="absolute bottom-4 left-4">
              <div className="w-16 h-16 bg-card rounded-lg shadow-lg flex items-center justify-center">
                <img 
                  src={mockRestaurant.logo} 
                  alt={`${mockRestaurant.name} logo`}
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Informações Principais */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-semibold text-foreground">{mockRestaurant.rating}</span>
                <span className="text-muted-foreground">({mockRestaurant.reviewCount} avaliações)</span>
              </div>
            </div>
            <Badge variant="secondary">{mockRestaurant.category}</Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{mockRestaurant.priceRange}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground flex-1">{mockRestaurant.location}</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleViewMap}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Ver no Mapa
          </Button>
        </div>

        <Separator />

        {/* Seção Sobre */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-3">Sobre</h2>
          <p className="text-muted-foreground leading-relaxed">
            {mockRestaurant.description}
          </p>
        </div>

        <Separator />

        {/* Cardápio */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Cardápio</h2>
          
          <div className="space-y-6">
            {mockMenuItems.map((category) => (
              <div key={category.category}>
                <h3 className="text-md font-medium text-foreground mb-3">{category.category}</h3>
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <Card key={item.id} className="border-0 shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{item.name}</h4>
                            <p className="text-primary font-semibold mt-1">{item.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Avaliações */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Avaliações</h2>
            <Button variant="ghost" size="sm" onClick={handleViewAllReviews}>
              Ver todas
            </Button>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {mockReviews.map((review) => (
                <CarouselItem key={review.id} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={review.user.avatar} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground truncate">{review.user.name}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{review.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                          
                          <p className="text-foreground text-sm mb-2 line-clamp-3">{review.comment}</p>
                          
                          {review.images.length > 0 && (
                            <div className="flex gap-2">
                              {review.images.map((image, index) => (
                                <img 
                                  key={index}
                                  src={image}
                                  alt={`Foto da avaliação ${index + 1}`}
                                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>

        {/* Ações Rápidas */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddReview}
              className="flex-col h-auto py-3"
            >
              <MessageCircle className="w-5 h-5 mb-1" />
              <span className="text-xs">Avaliar</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="flex-col h-auto py-3"
            >
              <Share className="w-5 h-5 mb-1" />
              <span className="text-xs">Compartilhar</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleWhatsApp}
              className="flex-col h-auto py-3"
            >
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-xs">WhatsApp</span>
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}