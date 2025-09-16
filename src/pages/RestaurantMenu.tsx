import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ArrowLeft, Plus, Edit3, Trash2, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRestaurantProfile, useRestaurantMenu, useUpdateMenuItem, useDeleteMenuCategory, useDeleteMenuItem } from "@/hooks/useRestaurants";
import { CategoryFormDialog } from "@/components/CategoryFormDialog";
import { MenuItemFormDialog } from "@/components/MenuItemFormDialog";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: restaurantProfile, isLoading: isLoadingProfile } = useRestaurantProfile();
  const { data: menuCategories = [], isLoading: isLoadingMenu } = useRestaurantMenu(restaurantProfile?.id || '');
  const updateItemMutation = useUpdateMenuItem();
  const deleteCategoryMutation = useDeleteMenuCategory();
  const deleteItemMutation = useDeleteMenuItem();

  const isLoading = isLoadingProfile || isLoadingMenu;

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

  const handleDeleteCategory = async (categoryId: string) => {
    if (!restaurantProfile?.id) return;
    
    try {
      await deleteCategoryMutation.mutateAsync({
        categoryId,
        restaurantId: restaurantProfile.id
      });
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria.",
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
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
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

  const totalItems = menuCategories.reduce((total, cat) => total + (cat.menu_items?.length || 0), 0);
  const availableItems = menuCategories.reduce(
    (total, cat) => total + (cat.menu_items?.filter(item => item.is_available).length || 0), 
    0
  );
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
          
          <CategoryFormDialog restaurantId={restaurantProfile.id}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CategoryFormDialog>
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

        {/* Menu Categories */}
        {menuCategories.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhuma categoria encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira categoria de cardápio.
              </p>
              <CategoryFormDialog restaurantId={restaurantProfile.id}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Categoria
                </Button>
              </CategoryFormDialog>
            </CardContent>
          </Card>
        ) : (
          menuCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <CategoryFormDialog 
                      restaurantId={restaurantProfile.id} 
                      category={category}
                    >
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </CategoryFormDialog>
                    
                    <ConfirmDeleteDialog
                      title="Excluir Categoria"
                      description={`Tem certeza que deseja excluir a categoria "${category.name}"? ${category.menu_items?.length ? 'Todos os itens desta categoria também serão excluídos.' : ''}`}
                      onConfirm={() => handleDeleteCategory(category.id)}
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </ConfirmDeleteDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.menu_items?.map((item) => (
                  <div 
                    key={item.id} 
                    className={`border rounded-lg p-4 ${!item.is_available ? 'opacity-60 bg-muted/50' : ''}`}
                  >
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
                          categories={menuCategories}
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
                  </div>
                ))}
                
                <MenuItemFormDialog
                  restaurantId={restaurantProfile.id}
                  categories={menuCategories}
                  defaultCategoryId={category.id}
                >
                  <Button variant="outline" className="w-full mt-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar item em {category.name}
                  </Button>
                </MenuItemFormDialog>
              </CardContent>
            </Card>
          ))
        )}

        {/* Add Category Button */}
        {menuCategories.length > 0 && (
          <Card className="border-dashed">
            <CardContent className="p-6">
              <CategoryFormDialog restaurantId={restaurantProfile.id}>
                <Button variant="ghost" className="w-full h-20 flex-col gap-2">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                  <span className="text-muted-foreground">Adicionar Nova Categoria</span>
                </Button>
              </CategoryFormDialog>
            </CardContent>
          </Card>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantMenu;