import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ArrowLeft, User, MapPin, Phone, Clock, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RestaurantProfile = () => {
  const navigate = useNavigate();

  // Mock restaurant data
  const restaurant = {
    name: "Bistro da Vila",
    category: "Italiana",
    description: "Restaurante italiano autêntico com massas artesanais e ambiente aconchegante. Especialidades da casa incluem risotto de funghi porcini e lasanha da nonna.",
    address: "Rua das Flores, 123 - Vila Madalena, São Paulo - SP",
    phone: "(11) 3456-7890",
    whatsapp: "(11) 99876-5432",
    email: "contato@bistrodavila.com.br",
    website: "www.bistrodavila.com.br",
    openingHours: {
      monday: "18:00 - 23:00",
      tuesday: "18:00 - 23:00", 
      wednesday: "18:00 - 23:00",
      thursday: "18:00 - 23:00",
      friday: "18:00 - 00:00",
      saturday: "12:00 - 00:00",
      sunday: "12:00 - 22:00"
    },
    rating: 4.6,
    totalReviews: 89
  };

  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira", 
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
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
          
          <h1 className="text-xl font-semibold">Perfil do Restaurante</h1>
          
          <Button size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <main className="p-4 space-y-6">
        {/* Restaurant Info */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{restaurant.name}</h2>
              <p className="text-muted-foreground">{restaurant.category}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-yellow-500">★ {restaurant.rating}</span>
                <span className="text-muted-foreground">({restaurant.totalReviews} avaliações)</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">{restaurant.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{restaurant.address}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{restaurant.phone}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 text-center text-xs text-muted-foreground">📱</span>
              <span className="text-sm">{restaurant.whatsapp}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 text-center text-xs text-muted-foreground">📧</span>
              <span className="text-sm">{restaurant.email}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 text-center text-xs text-muted-foreground">🌐</span>
              <span className="text-sm">{restaurant.website}</span>
            </div>
          </CardContent>
        </Card>

        {/* Opening Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horário de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium">{dayNames[day as keyof typeof dayNames]}</span>
                  <span className="text-sm text-muted-foreground">{hours}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completude do perfil</span>
                <span className="text-sm font-semibold">85%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Adicione fotos do cardápio para completar seu perfil
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantProfile;