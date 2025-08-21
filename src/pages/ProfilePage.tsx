import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { 
  User, 
  Edit3, 
  Star, 
  Trophy, 
  MapPin, 
  MessageSquare,
  Settings,
  Lock,
  CreditCard,
  Sliders,
  HelpCircle,
  Info,
  LogOut,
  Trash2,
  MoreHorizontal
} from "lucide-react";

// Mock user data
const mockUser = {
  name: "João Silva",
  avatar: "/placeholder.svg",
  bio: "Amante da gastronomia e explorador de novos sabores 🍕✨",
  stats: {
    reviews: 42,
    level: "Expert",
    restaurants: 38
  }
};

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    restaurant: "Burger Palace",
    rating: 5,
    comment: "Excelente hambúrguer! O melhor da cidade, sem dúvida. Atendimento impecável e ambiente aconchegante.",
    photos: ["/placeholder.svg", "/placeholder.svg"],
    date: "2024-01-15"
  },
  {
    id: 2,
    restaurant: "Pasta Italiana",
    rating: 4,
    comment: "Massa muito boa, mas o molho poderia ter mais tempero. No geral, uma experiência positiva.",
    photos: ["/placeholder.svg"],
    date: "2024-01-10"
  },
  {
    id: 3,
    restaurant: "Sushi Zen",
    rating: 5,
    comment: "Peixes fresquíssimos e apresentação impecável. Recomendo demais!",
    photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    date: "2024-01-05"
  }
];

const configOptions = [
  { icon: Edit3, label: "Editar Perfil", action: "edit-profile" },
  { icon: Lock, label: "Alterar Senha", action: "change-password" },
  { icon: CreditCard, label: "Gerenciar Assinatura", action: "subscription" },
  { icon: Sliders, label: "Preferências", action: "preferences" },
  { icon: HelpCircle, label: "Ajuda", action: "help" },
  { icon: Info, label: "Sobre", action: "about" },
  { icon: LogOut, label: "Sair", action: "logout", danger: true }
];

const ProfilePage = () => {
  const [user] = useState(mockUser);
  const [reviews] = useState(mockReviews);

  const handleEditProfile = () => {
    // TODO: Implementar edição de perfil
    console.log("Edit profile");
  };

  const handleConfigAction = (action: string) => {
    // TODO: Implementar ações de configuração
    console.log("Config action:", action);
  };

  const handleEditReview = (reviewId: number) => {
    // TODO: Implementar edição de avaliação
    console.log("Edit review:", reviewId);
  };

  const handleDeleteReview = (reviewId: number) => {
    // TODO: Implementar exclusão de avaliação
    console.log("Delete review:", reviewId);
  };

  const truncateComment = (comment: string, maxLength: number = 100) => {
    return comment.length > maxLength ? comment.substring(0, maxLength) + "..." : comment;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <AppHeader />
      
      <div className="p-4 space-y-6">
        {/* Perfil do usuário */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Info do usuário */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {user.bio}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={handleEditProfile}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mx-auto mb-2">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{user.stats.reviews}</p>
              <p className="text-sm text-muted-foreground">Avaliações</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/10 rounded-full mx-auto mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">{user.stats.level}</p>
              <p className="text-sm text-muted-foreground">Nível</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-full mx-auto mb-2">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">{user.stats.restaurants}</p>
              <p className="text-sm text-muted-foreground">Restaurantes</p>
            </CardContent>
          </Card>
        </div>

        {/* Minhas Avaliações */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Minhas Avaliações</h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {reviews.map((review) => (
                <div key={review.id} className="flex-shrink-0 w-80 border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{review.restaurant}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          {new Date(review.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditReview(review.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {truncateComment(review.comment)}
                  </p>
                  
                  {/* Miniaturas das fotos */}
                  {review.photos.length > 0 && (
                    <div className="flex gap-2">
                      {review.photos.slice(0, 3).map((photo, index) => (
                        <div key={index} className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                          <img 
                            src={photo} 
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {review.photos.length > 3 && (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">+{review.photos.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Configurações</h3>
            <div className="space-y-1">
              {configOptions.map((option, index) => (
                <div key={option.action}>
                  <button
                    onClick={() => handleConfigAction(option.action)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      option.danger 
                        ? "hover:bg-red-50 text-red-600" 
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    <option.icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{option.label}</span>
                  </button>
                  {index < configOptions.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu inferior */}
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;