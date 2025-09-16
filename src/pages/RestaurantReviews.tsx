import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ArrowLeft, Star, MessageSquare, User, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RestaurantReviews = () => {
  const navigate = useNavigate();

  // Mock reviews data
  const reviewsStats = {
    totalReviews: 89,
    averageRating: 4.6,
    distribution: {
      5: 52,
      4: 23,
      3: 8,
      2: 4,
      1: 2
    }
  };

  const reviews = [
    {
      id: "1",
      user: "Maria Silva",
      rating: 5,
      comment: "Excelente comida italiana! O risotto estava perfeito e o atendimento foi impecável. Ambiente muito aconchegante, perfeito para jantar romântico. Voltarei com certeza!",
      date: "2024-01-15",
      timeAgo: "2 dias atrás",
      helpful: 12
    },
    {
      id: "2",
      user: "João Santos", 
      rating: 4,
      comment: "Ambiente aconchegante e bom atendimento. A pasta estava deliciosa, mas achei o preço um pouco alto. Mesmo assim, recomendo pela qualidade da comida.",
      date: "2024-01-13",
      timeAgo: "4 dias atrás",
      helpful: 8
    },
    {
      id: "3",
      user: "Ana Costa",
      rating: 5,
      comment: "Melhor pizza da região! Massa fina e crocante, ingredientes frescos. O vinho da casa harmoniza perfeitamente. Parabéns à equipe!",
      date: "2024-01-10",
      timeAgo: "1 semana atrás",
      helpful: 15
    },
    {
      id: "4",
      user: "Carlos Oliveira",
      rating: 3,
      comment: "Comida boa, mas o serviço foi um pouco lento. Esperamos cerca de 40 minutos pelo prato principal. O sabor compensou a espera.",
      date: "2024-01-08",
      timeAgo: "1 semana atrás",
      helpful: 5
    },
    {
      id: "5",
      user: "Fernanda Lima",
      rating: 5,
      comment: "Experiência incrível! Desde a entrada até a sobremesa, tudo perfeito. A lasanha estava divina e o tiramisu é o melhor que já provei.",
      date: "2024-01-05",
      timeAgo: "2 semanas atrás",
      helpful: 20
    }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      
      {/* Header with back button */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/restaurant/home')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-xl font-semibold">Avaliações</h1>
          
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <main className="p-4 space-y-6">
        {/* Stats Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Resumo das Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {reviewsStats.averageRating}
                </div>
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(reviewsStats.averageRating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {reviewsStats.totalReviews} avaliações
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-3">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ 
                          width: `${(reviewsStats.distribution[rating as keyof typeof reviewsStats.distribution] / reviewsStats.totalReviews) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm w-6 text-right">
                      {reviewsStats.distribution[rating as keyof typeof reviewsStats.distribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Todas as Avaliações</h2>
            <div className="text-sm text-muted-foreground">
              {reviews.length} de {reviewsStats.totalReviews}
            </div>
          </div>

          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{review.user}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {review.timeAgo}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          Responder
                        </button>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          👍 {review.helpful} úteis
                        </div>
                      </div>
                      
                      <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                        {review.rating === 5 ? 'Excelente' : 
                         review.rating === 4 ? 'Muito Bom' :
                         review.rating === 3 ? 'Bom' :
                         review.rating === 2 ? 'Regular' : 'Ruim'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline">
            Carregar Mais Avaliações
          </Button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantReviews;