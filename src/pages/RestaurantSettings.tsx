import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Shield,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RestaurantSettings = () => {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      section: "Conta",
      items: [
        {
          icon: User,
          title: "Informações Pessoais",
          description: "Edite seus dados pessoais",
          action: () => {}
        },
        {
          icon: Lock,
          title: "Segurança",
          description: "Altere sua senha e configurações de segurança",
          action: () => {}
        }
      ]
    },
    {
      section: "Restaurante",
      items: [
        {
          icon: FileText,
          title: "Dados do Restaurante",
          description: "Informações legais e documentos",
          action: () => {}
        },
        {
          icon: Bell,
          title: "Notificações",
          description: "Configure quando receber notificações",
          action: () => {}
        }
      ]
    },
    {
      section: "Assinatura",
      items: [
        {
          icon: CreditCard,
          title: "Plano Atual",
          description: "Gerencie sua assinatura e pagamentos",
          action: () => {}
        },
        {
          icon: Shield,
          title: "Privacidade",
          description: "Controle quem pode ver suas informações",
          action: () => {}
        }
      ]
    },
    {
      section: "Suporte",
      items: [
        {
          icon: HelpCircle,
          title: "Ajuda",
          description: "FAQ e suporte técnico",
          action: () => {}
        }
      ]
    }
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
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
          
          <h1 className="text-xl font-semibold">Configurações</h1>
          
          <div className="w-16" />
        </div>
      </div>

      <main className="p-4 space-y-6">
        {/* Restaurant Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Bistro da Vila</h3>
                <p className="text-muted-foreground">Restaurante Italiano</p>
                <p className="text-sm text-muted-foreground">contato@bistrodavila.com.br</p>
              </div>
              
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingsOptions.map((section) => (
          <Card key={section.section}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{section.section}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Plan Information */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Plano Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Plano atual</span>
                <span className="font-semibold text-primary">Premium</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Próximo pagamento</span>
                <span className="text-sm text-muted-foreground">15/02/2024</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Valor mensal</span>
                <span className="font-semibold">R$ 99,90</span>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Gerenciar Assinatura
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Versão 1.0.0</p>
          <p>© 2024 Tasty - Todos os direitos reservados</p>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantSettings;