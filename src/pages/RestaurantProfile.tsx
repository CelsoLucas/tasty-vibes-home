import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, User, MapPin, Phone, Clock, Edit, Save, X, Camera, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  useRestaurantProfile, 
  useRestaurantStats, 
  useProfileCompletion,
  useUpdateRestaurantProfile 
} from "@/hooks/useRestaurants";

const RestaurantProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch real data from database
  const { data: profile, isLoading: profileLoading } = useRestaurantProfile();
  const { data: stats } = useRestaurantStats(profile?.id);
  const { data: completion } = useProfileCompletion(profile);
  const updateProfile = useUpdateRestaurantProfile();

  // Editable form data
  const [formData, setFormData] = useState({
    restaurant_name: "",
    category: "", 
    description: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    opening_hours: {
      monday: "",
      tuesday: "", 
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: ""
    }
  });

  const [originalData, setOriginalData] = useState(formData);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      const newFormData = {
        restaurant_name: profile.restaurant_name || "",
        category: profile.category || "",
        description: profile.description || "",
        address: profile.address || "",
        phone: profile.phone || "",
        whatsapp: profile.whatsapp || "",
        email: profile.email || "",
        website: profile.website || "",
        opening_hours: profile.opening_hours || {
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: ""
        }
      };
      setFormData(newFormData);
      setOriginalData(newFormData);
    }
  }, [profile]);

  // Load avatar on component mount
  useEffect(() => {
    loadAvatar();
  }, []);

  const loadAvatar = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${user.id}/avatar.jpg`);
        
        // Check if the image actually exists
        const response = await fetch(data.publicUrl);
        if (response.ok) {
          setAvatarUrl(data.publicUrl);
        }
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro no upload",
        description: "Por favor, selecione um arquivo de imagem válido.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, selecione uma imagem menor que 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if it exists
      await supabase.storage
        .from('avatars')
        .remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.jpeg`]);

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(data.publicUrl + '?t=' + new Date().getTime()); // Add timestamp to force refresh

      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
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

  const handleEdit = () => {
    setOriginalData(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
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
      opening_hours: {
        ...prev.opening_hours,
        [day]: value
      }
    }));
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-16" />
          </div>
        </div>
        <main className="p-4 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </main>
        <BottomNavigation />
      </div>
    );
  }

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
                disabled={updateProfile.isPending}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={updateProfile.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateProfile.isPending ? "Salvando..." : "Salvar"}
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
              <div className="relative w-20 h-20 mx-auto mb-4">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Avatar do restaurante" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                )}
                
                {/* Upload button - always visible */}
                <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  {uploadingImage ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </label>
                
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={formData.restaurant_name}
                    onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
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
                  <h2 className="text-2xl font-bold">
                    {formData.restaurant_name || 'Nome do Restaurante'}
                  </h2>
                  <p className="text-muted-foreground">
                    {formData.category || 'Categoria não informada'}
                  </p>
                </>
              )}
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-yellow-500">
                  ★ {stats?.averageRating || '0'}
                </span>
                <span className="text-muted-foreground">
                  ({stats?.totalReviews || 0} avaliações)
                </span>
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
                  <p className="text-muted-foreground">
                    {formData.description || 'Descrição não informada'}
                  </p>
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
                <span className="text-sm">{formData.address || 'Não informado'}</span>
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
                <span className="text-sm">{formData.phone || 'Não informado'}</span>
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
                <span className="text-sm">{formData.whatsapp || 'Não informado'}</span>
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
                <span className="text-sm">{formData.email || 'Não informado'}</span>
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
                <span className="text-sm">{formData.website || 'Não informado'}</span>
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
              {Object.entries(formData.opening_hours).map(([day, hours]) => (
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
                    <span className="text-sm text-muted-foreground">
                      {hours || 'Não informado'}
                    </span>
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
                <span className="text-sm font-semibold">{completion?.percentage || 0}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${completion?.percentage || 0}%` }}
                />
              </div>
              {completion?.missingFields && completion.missingFields.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Campos faltantes: {completion.missingFields.map(field => {
                    const fieldNames: Record<string, string> = {
                      restaurant_name: 'Nome',
                      description: 'Descrição',
                      phone: 'Telefone',
                      address: 'Endereço',
                      category: 'Categoria',
                      email: 'Email',
                      opening_hours: 'Horários'
                    };
                    return fieldNames[field] || field;
                  }).join(', ')}
                </p>
              ) : (
                <p className="text-xs text-green-600">
                  ✓ Perfil completo!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantProfile;