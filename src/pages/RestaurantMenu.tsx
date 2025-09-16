import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ArrowLeft, Plus, Edit3, Trash2, DollarSign, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRestaurantProfile, useRestaurantMenu, useUpdateMenuItem, useDeleteMenuItem } from "@/hooks/useRestaurants";
import { MenuItemFormDialog } from "@/components/MenuItemFormDialog";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: restaurantProfile, isLoading: isLoadingProfile } = useRestaurantProfile();
  const { data: menuData, isLoading: isLoadingMenu } = useRestaurantMenu(restaurantProfile?.id || '');
  const updateItemMutation = useUpdateMenuItem();
  const deleteItemMutation = useDeleteMenuItem();

  const isLoading = isLoadingProfile || isLoadingMenu;
  const menuItems = menuData?.items || [];

  // Filter items based on search term
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleItemAvailability = async (itemId: string, currentAvailability: boolean) => {
    if (!restaurantProfile?.id) return;
    
    try {
      await updateItemMutation.mutateAsync({
        itemId,
        restaurantId: restaurantProfile.id,
        isAvailable: !currentAvailability
      });
      toast({
        title: "Atualizado",
        description: `Item ${!currentAvailability ? 'disponibilizado' : 'indisponibilizado'} com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!restaurantProfile?.id) return;
    
    try {
      await deleteItemMutation.mutateAsync({
        itemId,
        restaurantId: restaurantProfile.id
      });
      toast({
        title: "Item excluído",
        description: "O item foi excluído com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o item.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="bg-card border-b p-4">
          <Skeleton className="h-8 w-48 mx-auto" />
        </div>
        <main className="p-4 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-8 w-12 mx-auto mb-2" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!restaurantProfile) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Perfil não encontrado</h2>
          <p className="text-muted-foreground mb-4">Complete seu perfil de restaurante primeiro.</p>
          <Button onClick={() => navigate('/restaurant/profile')}>
            Ir para Perfil
          </Button>
        </div>
      </div>
    );
  }

  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.is_available).length;
  const unavailableItems = totalItems - availableItems;

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
          
          <h1 className="text-xl font-semibold">Gerenciar Cardápio</h1>
          
          <MenuItemFormDialog restaurantId={restaurantProfile.id}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </MenuItemFormDialog>
        </div>
      </div>

      <main className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{totalItems}</p>
              <p className="text-xs text-muted-foreground">Total de Itens</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{availableItems}</p>
              <p className="text-xs text-muted-foreground">Disponíveis</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{unavailableItems}</p>
              <p className="text-xs text-muted-foreground">Indisponíveis</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar itens do cardápio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              {menuItems.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">Nenhum item encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece criando seu primeiro item do cardápio.
                  </p>
                  <MenuItemFormDialog restaurantId={restaurantProfile.id}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Item
                    </Button>
                  </MenuItemFormDialog>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">Nenhum item encontrado</h3>
                  <p className="text-muted-foreground">
                    Nenhum item corresponde à sua busca.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className={!item.is_available ? 'opacity-60 bg-muted/50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`px-2 py-1 h-6 text-xs ${
                            item.is_available 
                              ? 'text-green-700 hover:bg-green-100' 
                              : 'text-red-700 hover:bg-red-100'
                          }`}
                          onClick={() => toggleItemAvailability(item.id, item.is_available)}
                          disabled={updateItemMutation.isPending}
                        >
                          {item.is_available ? 'Disponível' : 'Indisponível'}
                        </Button>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          R$ {Number(item.price).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                    
                    {item.image_url && (
                      <div className="w-16 h-16 mr-4">
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <MenuItemFormDialog
                        restaurantId={restaurantProfile.id}
                        item={item}
                      >
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </MenuItemFormDialog>
                      
                      <ConfirmDeleteDialog
                        title="Excluir Item"
                        description={`Tem certeza que deseja excluir o item "${item.name}"?`}
                        onConfirm={() => handleDeleteItem(item.id)}
                        disabled={deleteItemMutation.isPending}
                      >
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </ConfirmDeleteDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Item Button */}
        {menuItems.length > 0 && (
          <Card className="border-dashed">
            <CardContent className="p-6">
              <MenuItemFormDialog restaurantId={restaurantProfile.id}>
                <Button variant="ghost" className="w-full h-20 flex-col gap-2">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                  <span className="text-muted-foreground">Adicionar Novo Item</span>
                </Button>
              </MenuItemFormDialog>
            </CardContent>
          </Card>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantMenu;