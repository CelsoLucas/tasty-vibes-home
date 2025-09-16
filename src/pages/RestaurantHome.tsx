import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  Eye, 
  MessageSquare, 
  Settings, 
  Menu, 
  User,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  useRestaurantProfile, 
  useRestaurantViews, 
  useRestaurantStats, 
  useRestaurantReviews,
  useProfileCompletion 
} from "@/hooks/useRestaurants";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const RestaurantHome = () => {
  const navigate = useNavigate();

  // Fetch real data from database
  const { data: profile, isLoading: profileLoading } = useRestaurantProfile();
  const { data: views } = useRestaurantViews(profile?.id);
  const { data: stats } = useRestaurantStats(profile?.id);
  const { data: reviews } = useRestaurantReviews(profile?.id);
  const { data: completion } = useProfileCompletion(profile);

  // Take only the 3 most recent reviews
  const recentReviews = reviews?.slice(0, 3) || [];

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <main className="p-4 space-y-6">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 text-center">
                  <Skeleton className="h-6 w-6 mx-auto mb-2" />
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <main className="p-4 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Dashboard do Restaurante</h1>
            <p className="text-muted-foreground">Complete seu perfil para começar</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/restaurant/profile')}
            >
              Completar Perfil
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      
      <main className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Olá, {profile.restaurant_name || 'Restaurante'}!</h1>
          <p className="text-muted-foreground">Gerencie seu restaurante e acompanhe o desempenho</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold">{views?.totalViews.toLocaleString() || '0'}</p>
              <p className="text-sm text-muted-foreground">Visualizações</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{stats?.averageRating || '0'}</p>
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{stats?.totalReviews || '0'}</p>
              <p className="text-sm text-muted-foreground">Avaliações</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{completion?.percentage || '0'}%</p>
              <p className="text-sm text-muted-foreground">Perfil Completo</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/restaurant/profile')}
            >
              <User className="w-6 h-6" />
              <span className="text-sm">Editar Perfil</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/restaurant/menu')}
            >
              <Menu className="w-6 h-6" />
              <span className="text-sm">Gerenciar Cardápio</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/restaurant/reviews')}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">Ver Avaliações</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/restaurant/settings')}
            >
              <Settings className="w-6 h-6" />
              <span className="text-sm">Configurações</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Avaliações Recentes</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/restaurant/reviews')}
              >
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">
                        {review.profiles?.display_name || 'Usuário Anônimo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {review.comment || 'Sem comentário'}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(review.created_at), "d 'de' MMMM", { locale: ptBR })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>Nenhuma avaliação ainda</p>
                <p className="text-sm">As avaliações dos clientes aparecerão aqui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantHome;