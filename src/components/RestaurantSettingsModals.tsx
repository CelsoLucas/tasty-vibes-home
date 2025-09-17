import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Edit3, Save, X, Eye, EyeOff } from "lucide-react";
import { useRestaurantProfile, useUpdateRestaurantProfile } from "@/hooks/useRestaurants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Schemas de validação
const personalInfoSchema = z.object({
  display_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
});

const passwordSchema = z.object({
  current_password: z.string().min(6, "Senha atual é obrigatória"),
  new_password: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
  confirm_password: z.string().min(6, "Confirmação é obrigatória"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Senhas não conferem",
  path: ["confirm_password"],
});

const restaurantDataSchema = z.object({
  restaurant_name: z.string().min(2, "Nome do restaurante é obrigatório"),
  business_name: z.string().optional(),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
});

const notificationSchema = z.object({
  new_orders: z.boolean(),
  new_reviews: z.boolean(),
  promotions: z.boolean(),
  newsletter: z.boolean(),
});

const privacySchema = z.object({
  public_profile: z.boolean(),
  show_phone: z.boolean(),
  show_whatsapp: z.boolean(),
  receive_messages: z.boolean(),
});

interface RestaurantSettingsModalsProps {
  openModal: string | null;
  setOpenModal: (modal: string | null) => void;
}

export const RestaurantSettingsModals: React.FC<RestaurantSettingsModalsProps> = ({
  openModal,
  setOpenModal,
}) => {
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const { data: profile, isLoading: profileLoading } = useRestaurantProfile();
  const updateRestaurantProfile = useUpdateRestaurantProfile();

  const toggleEditMode = (modal: string) => {
    setEditMode(prev => ({ ...prev, [modal]: !prev[modal] }));
  };

  const closeModal = () => {
    setOpenModal(null);
    setEditMode({});
  };

  // Form para informações pessoais
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    values: {
      display_name: profile?.restaurant_name || '',
      email: profile?.email || '',
    },
  });

  // Form para senha
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  // Form para dados do restaurante
  const restaurantForm = useForm<z.infer<typeof restaurantDataSchema>>({
    resolver: zodResolver(restaurantDataSchema),
    values: {
      restaurant_name: profile?.restaurant_name || '',
      business_name: profile?.business_name || '',
      cnpj: profile?.cnpj || '',
      phone: profile?.phone || '',
      whatsapp: profile?.whatsapp || '',
      address: profile?.address || '',
      category: profile?.category || '',
      description: profile?.description || '',
      website: profile?.website || '',
    },
  });

  // Form para notificações
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      new_orders: true,
      new_reviews: true,
      promotions: false,
      newsletter: false,
    },
  });

  // Form para privacidade
  const privacyForm = useForm<z.infer<typeof privacySchema>>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      public_profile: true,
      show_phone: true,
      show_whatsapp: true,
      receive_messages: true,
    },
  });

  // Handlers para salvar
  const handleSavePersonalInfo = async (data: z.infer<typeof personalInfoSchema>) => {
    try {
      toast.success("Informações pessoais atualizadas com sucesso!");
      setEditMode(prev => ({ ...prev, personal: false }));
    } catch (error) {
      toast.error("Erro ao atualizar informações pessoais");
    }
  };

  const handleSavePassword = async (data: z.infer<typeof passwordSchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password
      });
      
      if (error) throw error;
      
      toast.success("Senha alterada com sucesso!");
      passwordForm.reset();
      setEditMode(prev => ({ ...prev, security: false }));
    } catch (error) {
      toast.error("Erro ao alterar senha");
    }
  };

  const handleSaveRestaurantData = async (data: z.infer<typeof restaurantDataSchema>) => {
    try {
      if (!profile?.id) return;
      
      await updateRestaurantProfile.mutateAsync({
        id: profile.id,
        updates: data,
      });
      
      toast.success("Dados do restaurante atualizados com sucesso!");
      setEditMode(prev => ({ ...prev, restaurant: false }));
    } catch (error) {
      toast.error("Erro ao atualizar dados do restaurante");
    }
  };

  const handleSaveNotifications = async (data: z.infer<typeof notificationSchema>) => {
    try {
      toast.success("Configurações de notificação salvas!");
      setEditMode(prev => ({ ...prev, notifications: false }));
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

  const handleSavePrivacy = async (data: z.infer<typeof privacySchema>) => {
    try {
      toast.success("Configurações de privacidade salvas!");
      setEditMode(prev => ({ ...prev, privacy: false }));
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

  // Modal Informações Pessoais
  const PersonalInfoModal = () => (
    <Dialog open={openModal === 'personal'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Informações Pessoais</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleEditMode('personal')}
            className="h-8 w-8 p-0"
          >
            {editMode.personal ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </DialogHeader>

        {editMode.personal ? (
          <Form {...personalInfoForm}>
            <form onSubmit={personalInfoForm.handleSubmit(handleSavePersonalInfo)} className="space-y-4">
              <FormField
                control={personalInfoForm.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Exibição</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do restaurante" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={personalInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Salvar</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditMode(prev => ({ ...prev, personal: false }))}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
              <p className="text-sm">{profile?.restaurant_name || 'Não informado'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-sm">{profile?.email || 'Não informado'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Membro desde</Label>
              <p className="text-sm">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'Não informado'}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Modal Segurança
  const SecurityModal = () => (
    <Dialog open={openModal === 'security'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Segurança</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleEditMode('security')}
            className="h-8 w-8 p-0"
          >
            {editMode.security ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </DialogHeader>

        {editMode.security ? (
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handleSavePassword)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          type={showPasswords.current ? "text" : "password"}
                          placeholder="Digite sua senha atual"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          type={showPasswords.new ? "text" : "password"}
                          placeholder="Digite a nova senha"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          type={showPasswords.confirm ? "text" : "password"}
                          placeholder="Confirme a nova senha"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Alterar Senha</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditMode(prev => ({ ...prev, security: false }))}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Senha</Label>
              <p className="text-sm">••••••••</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Último login</Label>
              <p className="text-sm">Hoje às 14:30</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Conta criada em</Label>
              <p className="text-sm">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'Não informado'}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Modal Dados do Restaurante
  const RestaurantDataModal = () => (
    <Dialog open={openModal === 'restaurant'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Dados do Restaurante</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleEditMode('restaurant')}
            className="h-8 w-8 p-0"
          >
            {editMode.restaurant ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </DialogHeader>

        {editMode.restaurant ? (
          <Form {...restaurantForm}>
            <form onSubmit={restaurantForm.handleSubmit(handleSaveRestaurantData)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={restaurantForm.control}
                  name="restaurant_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Restaurante *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome do restaurante" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={restaurantForm.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão Social</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Razão social" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={restaurantForm.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="00.000.000/0000-00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={restaurantForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Italiana, Brasileira" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={restaurantForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(11) 99999-9999" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={restaurantForm.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(11) 99999-9999" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={restaurantForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Endereço completo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={restaurantForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={restaurantForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Descreva seu restaurante..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Salvar</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditMode(prev => ({ ...prev, restaurant: false }))}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Nome do Restaurante</Label>
                <p className="text-sm">{profile?.restaurant_name || 'Não informado'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                <p className="text-sm">{profile?.business_name || 'Não informado'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                <p className="text-sm">{profile?.cnpj || 'Não informado'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Categoria</Label>
                <p className="text-sm">{profile?.category || 'Não informado'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                <p className="text-sm">{profile?.phone || 'Não informado'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">WhatsApp</Label>
                <p className="text-sm">{profile?.whatsapp || 'Não informado'}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
              <p className="text-sm">{profile?.address || 'Não informado'}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Website</Label>
              <p className="text-sm">{profile?.website || 'Não informado'}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
              <p className="text-sm">{profile?.description || 'Não informado'}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Modal Notificações
  const NotificationsModal = () => (
    <Dialog open={openModal === 'notifications'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Notificações</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleEditMode('notifications')}
            className="h-8 w-8 p-0"
          >
            {editMode.notifications ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </DialogHeader>

        {editMode.notifications ? (
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(handleSaveNotifications)} className="space-y-6">
              <FormField
                control={notificationForm.control}
                name="new_orders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Novos Pedidos</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações quando houver novos pedidos
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={notificationForm.control}
                name="new_reviews"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Novas Avaliações</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Seja notificado sobre novas avaliações do seu restaurante
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={notificationForm.control}
                name="promotions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Promoções</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Receba ofertas especiais e promoções
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={notificationForm.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Newsletter</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Receba dicas e novidades por email
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Salvar</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditMode(prev => ({ ...prev, notifications: false }))}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Novos Pedidos</p>
                <p className="text-sm text-muted-foreground">Ativado</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Novas Avaliações</p>
                <p className="text-sm text-muted-foreground">Ativado</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Promoções</p>
                <p className="text-sm text-muted-foreground">Desativado</p>
              </div>
              <Switch checked={false} disabled />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-muted-foreground">Desativado</p>
              </div>
              <Switch checked={false} disabled />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Modal Privacidade
  const PrivacyModal = () => (
    <Dialog open={openModal === 'privacy'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Privacidade</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleEditMode('privacy')}
            className="h-8 w-8 p-0"
          >
            {editMode.privacy ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </DialogHeader>

        {editMode.privacy ? (
          <Form {...privacyForm}>
            <form onSubmit={privacyForm.handleSubmit(handleSavePrivacy)} className="space-y-6">
              <FormField
                control={privacyForm.control}
                name="public_profile"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Perfil Público</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Seu restaurante aparece nas buscas públicas
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={privacyForm.control}
                name="show_phone"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mostrar Telefone</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Clientes podem ver seu número de telefone
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={privacyForm.control}
                name="show_whatsapp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mostrar WhatsApp</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Clientes podem ver seu WhatsApp
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={privacyForm.control}
                name="receive_messages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Receber Mensagens</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Clientes podem entrar em contato diretamente
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Salvar</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditMode(prev => ({ ...prev, privacy: false }))}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Perfil Público</p>
                <p className="text-sm text-muted-foreground">Ativado</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Mostrar Telefone</p>
                <p className="text-sm text-muted-foreground">Ativado</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Mostrar WhatsApp</p>
                <p className="text-sm text-muted-foreground">Ativado</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Receber Mensagens</p>
                <p className="text-sm text-muted-foreground">Ativado</p>
              </div>
              <Switch checked={true} disabled />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Modal Ajuda
  const HelpModal = () => (
    <Dialog open={openModal === 'help'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajuda e Suporte</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Perguntas Frequentes</h3>
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <p className="font-medium text-sm">Como editar meu cardápio?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Acesse a seção "Cardápio" no menu principal e clique em "Editar" para adicionar ou remover itens.
                </p>
              </div>
              
              <div className="border rounded-lg p-3">
                <p className="font-medium text-sm">Como alterar informações do restaurante?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Vá em Configurações → Dados do Restaurante e clique no ícone de edição.
                </p>
              </div>
              
              <div className="border rounded-lg p-3">
                <p className="font-medium text-sm">Como cancelar minha assinatura?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Entre em contato conosco através do suporte para cancelar sua assinatura.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Contato</h3>
            <div className="space-y-2">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p className="text-sm">suporte@tasty.com.br</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">WhatsApp</Label>
                <p className="text-sm">(11) 9 9999-9999</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Horário de Atendimento</Label>
                <p className="text-sm">Segunda a Sexta, 9h às 18h</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Informações do App</h3>
            <div className="space-y-2">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Versão</Label>
                <p className="text-sm">1.0.0</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Política de Privacidade</Label>
                <p className="text-sm text-primary cursor-pointer">Ver documento</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Termos de Uso</Label>
                <p className="text-sm text-primary cursor-pointer">Ver documento</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <PersonalInfoModal />
      <SecurityModal />
      <RestaurantDataModal />
      <NotificationsModal />
      <PrivacyModal />
      <HelpModal />
    </>
  );
};