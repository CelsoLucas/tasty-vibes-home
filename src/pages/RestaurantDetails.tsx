import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Heart, Star, MapPin, Phone, Share, MessageCircle, DollarSign } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRestaurant, useRestaurantReviews, useRestaurantMenu, useRestaurantStats } from "@/hooks/useRestaurants";

// Import restaurant images
import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";
import restaurant4 from "@/assets/restaurant-4.jpg";
import restaurant5 from "@/assets/restaurant-5.jpg";

// Default images for restaurants
const defaultImages = [
  restaurant1,
  restaurant2,
  restaurant3,
  restaurant4,
  restaurant5
];


export default function RestaurantProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // All hooks must be called before any early returns
  const { data: restaurant, isLoading, error } = useRestaurant(id || "");
  const { data: reviews } = useRestaurantReviews(id || "");
  const { data: menu } = useRestaurantMenu(id || "");
  const { data: stats } = useRestaurantStats(id || "");

  // Initialize first category as active - must be before early returns
  useEffect(() => {
    if (menu && menu.items && menu.items.length > 0 && !activeCategory) {
      setActiveCategory('menu-section');
    }
  }, [menu, activeCategory]);

  // Map das imagens locais
  const imageMap = {
    '/src/assets/restaurant-1.jpg': restaurant1,
    '/src/assets/restaurant-2.jpg': restaurant2,
    '/src/assets/restaurant-3.jpg': restaurant3,
    '/src/assets/restaurant-4.jpg': restaurant4,
    '/src/assets/restaurant-5.jpg': restaurant5,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando restaurante...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-2">Restaurante não encontrado</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Voltar para Home
            </Button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const restaurantImage = imageMap[restaurant.image_url as keyof typeof imageMap] || restaurant1;

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
    const phone = restaurant.whatsapp || restaurant.phone || "5511999999999";
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`);
  };

  const handleAddReview = () => {
    navigate("/add-review");
  };

  const handleViewAllReviews = () => {
    // TODO: Implementar página de todas as avaliações
    console.log("Ver todas as avaliações");
  };

  const scrollToCategory = (categoryId: string) => {
    const element = sectionRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory(categoryId);
    }
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
          {restaurant.name}
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
              {[restaurantImage, restaurant2, restaurant3, restaurant4].map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-64 w-full">
                    <img 
                      src={image} 
                      alt={`${restaurant.name} - Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-card/80 border-0 hover:bg-card/90 text-foreground/80 w-8 h-8" />
            <CarouselNext className="right-4 bg-card/80 border-0 hover:bg-card/90 text-foreground/80 w-8 h-8" />
          </Carousel>
          
          {/* Logo opcional */}
          <div className="absolute bottom-4 left-4">
            <div className="w-16 h-16 bg-card rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {restaurant.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Informações Principais */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-semibold text-foreground">
                  {stats?.averageRating || restaurant.rating}
                </span>
                <span className="text-muted-foreground">
                  ({stats?.totalReviews || 0} avaliações)
                </span>
              </div>
            </div>
            <Badge variant="secondary">{restaurant.category}</Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{restaurant.price_range || "$$"}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground flex-1">{restaurant.location || restaurant.distance}</span>
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
            {restaurant.description || "Deliciosa comida com ingredientes frescos e de qualidade. Venha experimentar nossa culinária especial!"}
          </p>
        </div>

        <Separator />

        {/* Cardápio */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Cardápio</h2>
          
          {menu && menu.items && menu.items.length > 0 ? (
            <div className="space-y-3">
              {menu.items.map((item) => (
                <Card key={item.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow ${!item.is_available ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          {!item.is_available && (
                            <Badge variant="secondary" className="text-xs">
                              Indisponível
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                        )}
                        <p className="text-lg font-bold text-primary">
                          R$ {Number(item.price).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      {item.image_url && (
                        <div className="flex-shrink-0">
                          <img 
                            src={imageMap[item.image_url as keyof typeof imageMap] || restaurant1}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-foreground mb-3">Pratos Principais</h3>
                <div className="space-y-3">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <img 
                          src={restaurant1}
                          alt="Prato Especial"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">Prato Especial</h4>
                          <p className="text-sm text-muted-foreground">Delicioso prato da casa</p>
                          <p className="text-primary font-semibold mt-1">R$ 29,90</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
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
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <CarouselItem key={review.id} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2">
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={review.profiles?.avatar_url || "/src/assets/logo.png"} />
                            <AvatarFallback>
                              {review.profiles?.display_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground truncate">
                                {review.profiles?.display_name || 'Usuário'}
                              </span>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {new Date(review.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                                />
                              ))}
                            </div>
                            
                            {review.comment && (
                              <p className="text-foreground text-sm mb-2 line-clamp-3">{review.comment}</p>
                            )}
                            
                            {review.review_images && review.review_images.length > 0 && (
                              <div className="flex gap-2">
                                {review.review_images.slice(0, 3).map((image, index) => (
                                  <img 
                                    key={index}
                                    src={imageMap[image as keyof typeof imageMap] || restaurant1}
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
                ))
              ) : (
                <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-1/2">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-muted-foreground">Ainda não há avaliações</p>
                        <p className="text-sm text-muted-foreground">Seja o primeiro a avaliar!</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )}
            </CarouselContent>
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