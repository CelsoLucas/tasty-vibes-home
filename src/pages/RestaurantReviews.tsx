import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, MessageSquare, User, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  useRestaurantProfile, 
  useRestaurantReviews, 
  useRestaurantStats,
  useReviewsDistribution 
} from "@/hooks/useRestaurants";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const RestaurantReviews = () => {
  const navigate = useNavigate();

  // Fetch real data from database
  const { data: profile, isLoading: profileLoading } = useRestaurantProfile();
  const { data: reviews, isLoading: reviewsLoading } = useRestaurantReviews(profile?.id);
  const { data: stats } = useRestaurantStats(profile?.id);
  const { data: distribution } = useReviewsDistribution(profile?.id);

  if (profileLoading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <main className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </main>
        <BottomNavigation />
      </div>
    );
  }

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
                  {stats?.averageRating || '0'}
                </div>
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(stats?.averageRating || 0) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats?.totalReviews || 0} avaliações
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const ratingCount = distribution?.distribution[rating as keyof typeof distribution.distribution] || 0;
                  const totalReviews = distribution?.totalReviews || 1;
                  const percentage = (ratingCount / totalReviews) * 100;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-3">{rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm w-6 text-right">
                        {ratingCount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Todas as Avaliações</h2>
            <div className="text-sm text-muted-foreground">
              {reviews?.length || 0} avaliações
            </div>
          </div>

          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
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
                          <h4 className="font-medium">
                            {review.profiles?.display_name || 'Usuário Anônimo'}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(review.created_at), "d 'de' MMMM", { locale: ptBR })}
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
                        {review.comment || 'Sem comentário'}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            Responder
                          </button>
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
            ))
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Nenhuma avaliação ainda</h3>
              <p className="text-sm">As avaliações dos clientes aparecerão aqui quando começarem a avaliar seu restaurante.</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {reviews && reviews.length > 0 && (
          <div className="text-center">
            <Button variant="outline">
              Carregar Mais Avaliações
            </Button>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantReviews;