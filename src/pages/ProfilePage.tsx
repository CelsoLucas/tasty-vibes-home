import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AnimatedInput } from "@/components/ui/animated-input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from '@supabase/supabase-js';
import { 
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
  MoreHorizontal,
  Camera,
  Upload,
  Eye,
  EyeOff
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
  { icon: Settings, label: "Informações Pessoais", action: "personal-info" },
  { icon: Sliders, label: "Preferências", action: "preferences" },
  { icon: LogOut, label: "Sair", action: "logout", danger: true }
];

const ProfilePage = () => {
  console.log("ProfilePage component rendering");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews] = useState(mockReviews);
  
  // Estados para modal de editar perfil (foto, nome, bio)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '',
    bio: '',
    avatar_url: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Estados para modal de informações pessoais (email, senha)
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfoForm, setPersonalInfoForm] = useState({
    email: '',
    newPassword: '',
    currentPassword: ''
  });
  const [savingPersonalInfo, setSavingPersonalInfo] = useState(false);
  
  // Estados para controlar visibilidade das senhas
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do perfil.",
          variant: "destructive",
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Logout realizado com sucesso!",
        description: "Até a próxima!",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditProfile = () => {
    // Carrega os dados atuais no formulário de editar perfil
    setEditForm({
      display_name: profile?.display_name || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || ''
    });
    setAvatarPreview(profile?.avatar_url || '');
    setAvatarFile(null);
    setIsEditModalOpen(true);
  };

  const handlePersonalInfo = () => {
    // Carrega os dados atuais no formulário de informações pessoais
    setPersonalInfoForm({
      email: user?.email || '',
      newPassword: '',
      currentPassword: ''
    });
    setIsEditingPersonalInfo(false);
    setIsPersonalInfoModalOpen(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSavingProfile(true);
    try {
      let avatarUrl = editForm.avatar_url;
      
      // Upload do avatar se um arquivo foi selecionado
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Atualiza o perfil na tabela profiles
      const { error } = await (supabase as any)
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: editForm.display_name,
          bio: editForm.bio,
          avatar_url: avatarUrl,
          email: user.email
        });

      if (error) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as alterações.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Perfil atualizado!",
          description: "Suas alterações foram salvas com sucesso.",
        });
        
        // Recarrega o perfil
        await fetchProfile(user.id);
        setIsEditModalOpen(false);
        setAvatarFile(null);
        setAvatarPreview('');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePersonalInfo = async () => {
    if (!user) return;

    setSavingPersonalInfo(true);
    try {
      // Verifica se há mudanças no email ou senha
      const emailChanged = personalInfoForm.email !== user.email;
      const passwordChanged = personalInfoForm.newPassword.trim() !== '';

      if (emailChanged || passwordChanged) {
        if (!personalInfoForm.currentPassword) {
          toast({
            title: "Senha necessária",
            description: "Para alterar email ou senha, confirme sua senha atual.",
            variant: "destructive",
          });
          setSavingPersonalInfo(false);
          return;
        }

        // Verifica a senha atual
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: personalInfoForm.currentPassword
        });

        if (signInError) {
          toast({
            title: "Senha incorreta",
            description: "A senha atual está incorreta.",
            variant: "destructive",
          });
          setSavingPersonalInfo(false);
          return;
        }

        // Atualiza email se mudou
        if (emailChanged) {
          const { error: emailError } = await supabase.auth.updateUser({
            email: personalInfoForm.email
          });

          if (emailError) {
            toast({
              title: "Erro ao atualizar email",
              description: emailError.message,
              variant: "destructive",
            });
            setSavingPersonalInfo(false);
            return;
          }
        }

        // Atualiza senha se mudou
        if (passwordChanged) {
          const { error: passwordError } = await supabase.auth.updateUser({
            password: personalInfoForm.newPassword
          });

          if (passwordError) {
            toast({
              title: "Erro ao atualizar senha",
              description: passwordError.message,
              variant: "destructive",
            });
            setSavingPersonalInfo(false);
            return;
          }
        }

        // Atualiza o email na tabela profiles se mudou
        if (emailChanged) {
          const { error } = await (supabase as any)
            .from('profiles')
            .update({
              email: personalInfoForm.email
            })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating profile email:', error);
          }
        }

        toast({
          title: "Informações atualizadas!",
          description: "Suas alterações foram salvas. Você pode precisar fazer login novamente.",
        });
        
        // Recarrega o perfil
        await fetchProfile(user.id);
        setIsPersonalInfoModalOpen(false);
        setIsEditingPersonalInfo(false);

        // Se mudou email ou senha, faz logout para reautenticação
        setTimeout(() => {
          handleLogout();
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setSavingPersonalInfo(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditForm({
      display_name: '',
      bio: '',
      avatar_url: ''
    });
  };

  const handleCancelPersonalInfo = () => {
    setIsPersonalInfoModalOpen(false);
    setIsEditingPersonalInfo(false);
    setPersonalInfoForm({
      email: '',
      newPassword: '',
      currentPassword: ''
    });
  };

  const handleBackPersonalInfo = () => {
    setIsEditingPersonalInfo(false);
    setPersonalInfoForm({
      email: user?.email || '',
      newPassword: '',
      currentPassword: ''
    });
  };

  const handleConfigAction = (action: string) => {
    if (action === 'logout') {
      handleLogout();
    } else if (action === 'edit-profile') {
      handleEditProfile();
    } else if (action === 'personal-info') {
      handlePersonalInfo();
    } else {
      // TODO: Implementar outras ações de configuração
      console.log("Config action:", action);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Erro ao carregar perfil</p>
      </div>
    );
  }

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
                  src={profile?.avatar_url || "/placeholder.svg"} 
                  alt={profile?.display_name || user.email || "Usuário"}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Info do usuário */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">
                  {profile?.display_name || user.email?.split('@')[0] || "Usuário"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {profile?.bio || "Bio Vazia"}
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
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/10 rounded-full mx-auto mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">Nível</p>
              <p className="text-2xl font-bold text-foreground">Iniciante</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-full mx-auto mb-2">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">Restaurantes</p>
              <p className="text-2xl font-bold text-foreground">0</p>
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

      {/* Modal de Edição de Perfil */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Avatar Upload */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src={avatarPreview || profile?.avatar_url || "/placeholder.svg"} 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <AnimatedInput
                id="display_name"
                label="Nome de Exibição"
                value={editForm.display_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Conte um pouco sobre você..."
                rows={3}
              />
            </div>

          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit} disabled={savingProfile}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Informações Pessoais */}
      <Dialog open={isPersonalInfoModalOpen} onOpenChange={setIsPersonalInfoModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Informações Pessoais</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <AnimatedInput
                id="personal_email"
                type="email"
                label="Email"
                value={personalInfoForm.email}
                onChange={(e) => setPersonalInfoForm(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditingPersonalInfo}
              />
            </div>

            <div className="grid gap-2">
              <AnimatedInput
                id="personal_password"
                type={showNewPassword ? "text" : "password"}
                label="Nova Senha"
                value={personalInfoForm.newPassword}
                onChange={(e) => setPersonalInfoForm(prev => ({ ...prev, newPassword: e.target.value }))}
                disabled={!isEditingPersonalInfo}
                rightIcon={showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onRightIconClick={() => setShowNewPassword(!showNewPassword)}
              />
            </div>

            <div className="grid gap-2">
              <AnimatedInput
                id="current_password"
                type={showCurrentPassword ? "text" : "password"}
                label="Senha Atual"
                value={personalInfoForm.currentPassword}
                onChange={(e) => setPersonalInfoForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                disabled={!isEditingPersonalInfo}
                rightIcon={showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onRightIconClick={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            </div>
          </div>
          
          <DialogFooter>
            {!isEditingPersonalInfo ? (
              <>
                <Button variant="outline" onClick={handleCancelPersonalInfo}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsEditingPersonalInfo(true)}>
                  Editar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleBackPersonalInfo}>
                  Voltar
                </Button>
                <Button onClick={handleSavePersonalInfo} disabled={savingPersonalInfo}>
                  {savingPersonalInfo ? "Salvando..." : "Salvar"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;