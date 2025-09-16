import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ArrowLeft, User, MapPin, Phone, Clock, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RestaurantProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Editable form data
  const [formData, setFormData] = useState({
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
    }
  });

  const [originalData, setOriginalData] = useState(formData);

  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira", 
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  const handleEdit = () => {
    setOriginalData(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would normally save to Supabase
      // const { error } = await supabase
      //   .from('restaurant_profiles')
      //   .update(formData)
      //   .eq('user_id', user.id);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHoursChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value
      }
    }));
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
          
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancel}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
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
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-center text-2xl font-bold"
                    placeholder="Nome do restaurante"
                  />
                  <Input
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="text-center"
                    placeholder="Categoria"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{formData.name}</h2>
                  <p className="text-muted-foreground">{formData.category}</p>
                </>
              )}
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-yellow-500">★ 4.6</span>
                <span className="text-muted-foreground">(89 avaliações)</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                {isEditing ? (
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descrição do restaurante"
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{formData.description}</p>
                )}
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
              {isEditing ? (
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Endereço"
                  className="flex-1"
                />
              ) : (
                <span className="text-sm">{formData.address}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Telefone"
                  className="flex-1"
                />
              ) : (
                <span className="text-sm">{formData.phone}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 text-center text-xs text-muted-foreground">📱</span>
              {isEditing ? (
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="WhatsApp"
                  className="flex-1"
                />
              ) : (
                <span className="text-sm">{formData.whatsapp}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 text-center text-xs text-muted-foreground">📧</span>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="E-mail"
                  className="flex-1"
                />
              ) : (
                <span className="text-sm">{formData.email}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 text-center text-xs text-muted-foreground">🌐</span>
              {isEditing ? (
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="Website"
                  className="flex-1"
                />
              ) : (
                <span className="text-sm">{formData.website}</span>
              )}
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
              {Object.entries(formData.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium">{dayNames[day as keyof typeof dayNames]}</span>
                  {isEditing ? (
                    <Input
                      value={hours}
                      onChange={(e) => handleHoursChange(day, e.target.value)}
                      placeholder="00:00 - 00:00"
                      className="w-32 h-8 text-sm"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">{hours}</span>
                  )}
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