import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ArrowLeft, Plus, Edit3, Trash2, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RestaurantMenu = () => {
  const navigate = useNavigate();

  // Mock menu data
  const menuCategories = [
    {
      id: "1",
      name: "Massas",
      items: [
        {
          id: "1",
          name: "Spaghetti Carbonara",
          description: "Massa tradicional italiana com bacon, ovos e queijo parmesão",
          price: 42.90,
          available: true
        },
        {
          id: "2", 
          name: "Lasanha da Casa",
          description: "Lasanha artesanal com molho bolonhesa e queijo gratinado",
          price: 38.50,
          available: true
        },
        {
          id: "3",
          name: "Risotto de Funghi",
          description: "Risotto cremoso com mix de cogumelos e vinho branco",
          price: 45.00,
          available: false
        }
      ]
    },
    {
      id: "2",
      name: "Pizzas",
      items: [
        {
          id: "4",
          name: "Margherita",
          description: "Pizza clássica com molho de tomate, mussarela e manjericão",
          price: 35.00,
          available: true
        },
        {
          id: "5",
          name: "Quattro Stagioni", 
          description: "Pizza com quatro sabores: presunto, cogumelos, alcachofra e azeitonas",
          price: 48.00,
          available: true
        }
      ]
    },
    {
      id: "3",
      name: "Bebidas",
      items: [
        {
          id: "6",
          name: "Vinho Chianti",
          description: "Vinho tinto italiano selecionado",
          price: 65.00,
          available: true
        },
        {
          id: "7",
          name: "Água Mineral",
          description: "Água mineral sem gás 500ml",
          price: 8.00,
          available: true
        }
      ]
    }
  ];

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
          
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      <main className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {menuCategories.reduce((total, cat) => total + cat.items.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total de Itens</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {menuCategories.reduce((total, cat) => 
                  total + cat.items.filter(item => item.available).length, 0
                )}
              </p>
              <p className="text-xs text-muted-foreground">Disponíveis</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {menuCategories.reduce((total, cat) => 
                  total + cat.items.filter(item => !item.available).length, 0
                )}
              </p>
              <p className="text-xs text-muted-foreground">Indisponíveis</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Categories */}
        {menuCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Button variant="ghost" size="sm">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`border rounded-lg p-4 ${!item.available ? 'opacity-60 bg-muted/50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{item.name}</h4>
                        {!item.available && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            Indisponível
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-3">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar item em {category.name}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add Category Button */}
        <Card className="border-dashed">
          <CardContent className="p-6">
            <Button variant="ghost" className="w-full h-20 flex-col gap-2">
              <Plus className="w-8 h-8 text-muted-foreground" />
              <span className="text-muted-foreground">Adicionar Nova Categoria</span>
            </Button>
          </CardContent>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantMenu;