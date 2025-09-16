import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
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

const RestaurantHome = () => {
  const navigate = useNavigate();

  // Mock data for restaurant dashboard
  const stats = {
    totalViews: 1247,
    averageRating: 4.6,
    totalReviews: 89,
    profileCompletion: 85
  };

  const recentReviews = [
    {
      id: "1",
      user: "Maria Silva",
      rating: 5,
      comment: "Excelente comida italiana! O risotto estava perfeito.",
      date: "2 dias atrás"
    },
    {
      id: "2", 
      user: "João Santos",
      rating: 4,
      comment: "Ambiente aconchegante e bom atendimento.",
      date: "3 dias atrás"
    },
    {
      id: "3",
      user: "Ana Costa",
      rating: 5,
      comment: "Melhor pizza da região! Recomendo muito.",
      date: "1 semana atrás"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      
      <main className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Dashboard do Restaurante</h1>
          <p className="text-muted-foreground">Gerencie seu restaurante e acompanhe o desempenho</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Visualizações</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{stats.averageRating}</p>
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{stats.totalReviews}</p>
              <p className="text-sm text-muted-foreground">Avaliações</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{stats.profileCompletion}%</p>
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
            {recentReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{review.user}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {review.date}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantHome;