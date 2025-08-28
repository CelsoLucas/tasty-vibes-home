
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Heart, X, Users, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateSession, useJoinSession, useSession, useSwipe, useSessionSwipes, useSessionMatches } from "@/hooks/useMatching";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useCategories } from "@/hooks/useCategories";

const MatchingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'create' | 'join' | 'session'>('create');
  const [sessionCode, setSessionCode] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  
  // Filters for creating session
  const [filters, setFilters] = useState({
    category: "",
    price_range: "",
    distance: ""
  });

  const createSessionMutation = useCreateSession();
  const joinSessionMutation = useJoinSession();
  const swipeMutation = useSwipe();
  
  const { data: restaurants } = useRestaurants();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: session, refetch: refetchSession } = useSession(currentSessionId || "");
  const { data: swipes } = useSessionSwipes(currentSessionId || "");
  const { data: matches } = useSessionMatches(currentSessionId || "");

  // Check for session code in URL
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setSessionCode(code);
      setMode('join');
    }
  }, [searchParams]);

  // Check for new matches
  useEffect(() => {
    if (matches && matches.length > 0) {
      const latestMatch = matches[0];
      if (latestMatch && currentMatch?.id !== latestMatch.id) {
        setCurrentMatch(latestMatch);
        setShowMatchModal(true);
      }
    }
  }, [matches, currentMatch]);

  const handleCreateSession = async () => {
    try {
      const newSession = await createSessionMutation.mutateAsync(filters);
      if (newSession) {
        console.log('Created session:', newSession);
        setCurrentSessionId(newSession.id);
        setMode('session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleJoinSession = async () => {
    try {
      const joinedSession = await joinSessionMutation.mutateAsync(sessionCode);
      console.log('Joined session:', joinedSession);
      if (joinedSession) {
        setCurrentSessionId(joinedSession.id);
        setMode('session');
        // Force refresh the session data after joining
        setTimeout(() => {
          refetchSession();
        }, 1000);
      }
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const handleSwipe = async (liked: boolean) => {
    if (!session || !availableRestaurants.length) return;

    const restaurant = availableRestaurants[currentRestaurantIndex];
    
    try {
      await swipeMutation.mutateAsync({
        sessionId: session.id,
        restaurantId: restaurant.id,
        liked
      });
      
      // Move to next restaurant
      if (currentRestaurantIndex < availableRestaurants.length - 1) {
        setCurrentRestaurantIndex(prev => prev + 1);
      } else {
        // No more restaurants
        toast({
          title: "Fim dos restaurantes!",
          description: "Vocês avaliaram todos os restaurantes disponíveis.",
        });
      }
    } catch (error) {
      console.error('Error swiping:', error);
    }
  };

  const copyInviteLink = () => {
    if (session) {
      const url = `https://4a4c3db0-159e-45f8-8229-b1e96d6c7615.sandbox.lovable.dev/matching?code=${session.session_code}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "Compartilhe este link com seu amigo.",
      });
    }
  };

  // Filter restaurants that haven't been swiped yet
  const swipedRestaurantIds = swipes?.map(s => s.restaurant_id) || [];
  const availableRestaurants = restaurants?.filter(r => 
    session?.restaurant_ids.includes(r.id) && 
    !swipedRestaurantIds.includes(r.id)
  ) || [];

  const currentRestaurant = availableRestaurants[currentRestaurantIndex];

  // Add debug logging for session state
  useEffect(() => {
    if (session) {
      console.log('Current session state:', {
        id: session.id,
        participants: session.participants,
        participantCount: session.participants?.length || 0,
        status: session.status
      });
    }
  }, [session]);

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                Encontrar Restaurante com Amigos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Tipo de comida</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="" disabled>Carregando categorias...</SelectItem>
                    ) : (
                      categories?.map((category: string) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Faixa de preço</Label>
                <Select value={filters.price_range} onValueChange={(value) => setFilters(prev => ({ ...prev, price_range: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a faixa de preço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$ - Econômico</SelectItem>
                    <SelectItem value="$$">$$ - Moderado</SelectItem>
                    <SelectItem value="$$$">$$$ - Caro</SelectItem>
                    <SelectItem value="$$$$">$$$$ - Muito caro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleCreateSession}
                  className="w-full"
                  disabled={createSessionMutation.isPending}
                >
                  {createSessionMutation.isPending ? "Criando..." : "Criar Sessão"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setMode('join')}
                  className="w-full"
                >
                  Entrar em uma Sessão
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-8">
          <Button
            variant="ghost"
            onClick={() => setMode('create')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Entrar na Sessão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code">Código da sessão</Label>
                <Input
                  id="code"
                  placeholder="Digite o código"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono"
                />
              </div>
              
              <Button
                onClick={handleJoinSession}
                className="w-full"
                disabled={!sessionCode || joinSessionMutation.isPending}
              >
                {joinSessionMutation.isPending ? "Entrando..." : "Entrar na Sessão"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'session') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sair
            </Button>
            
            {session && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Participantes: {session.participants?.length || 0}/2
                </div>
                {session.participants && session.participants.length < 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyInviteLink}
                    className="mt-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {session.session_code}
                  </Button>
                )}
              </div>
            )}
            
            <div className="w-20" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {session && session.participants && session.participants.length < 2 ? (
            <div className="max-w-md mx-auto text-center pt-20">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Aguardando segundo participante...</h2>
              <p className="text-muted-foreground mb-2">
                Participantes: {session.participants?.length || 0}/2
              </p>
              <p className="text-muted-foreground mb-6">
                Compartilhe o código <span className="font-mono font-bold">{session.session_code}</span> com seu amigo
              </p>
              <Button onClick={copyInviteLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link de Convite
              </Button>
            </div>
          ) : currentRestaurant ? (
            <div className="max-w-md mx-auto">
              {/* Restaurant Card */}
              <div className="relative">
                <Card className="overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={currentRestaurant.image_url || '/placeholder-restaurant.jpg'}
                      alt={currentRestaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{currentRestaurant.name}</h3>
                    <p className="text-muted-foreground mb-2">{currentRestaurant.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">⭐ {currentRestaurant.rating}</span>
                      <span className="text-sm">{currentRestaurant.distance}</span>
                    </div>
                    {currentRestaurant.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {currentRestaurant.description}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Swipe Buttons */}
                <div className="flex justify-center gap-6 mt-6">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-16 h-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleSwipe(false)}
                    disabled={swipeMutation.isPending}
                  >
                    <X className="w-8 h-8" />
                  </Button>
                  
                  <Button
                    size="lg"
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                    onClick={() => handleSwipe(true)}
                    disabled={swipeMutation.isPending}
                  >
                    <Heart className="w-8 h-8" />
                  </Button>
                </div>

                {/* Progress */}
                <div className="text-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    {currentRestaurantIndex + 1} de {availableRestaurants.length}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center pt-20">
              <h2 className="text-xl font-semibold mb-2">Nenhum restaurante disponível</h2>
              <p className="text-muted-foreground">
                Vocês já avaliaram todos os restaurantes ou não há restaurantes que atendam aos filtros.
              </p>
            </div>
          )}
        </div>

        {/* Match Modal */}
        <Dialog open={showMatchModal} onOpenChange={setShowMatchModal}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">🎉 É um Match!</DialogTitle>
            </DialogHeader>
            
            {currentMatch?.restaurants && (
              <div className="space-y-4">
                <div className="text-center">
                  <img
                    src={currentMatch.restaurants.image_url || '/placeholder-restaurant.jpg'}
                    alt={currentMatch.restaurants.name}
                    className="w-32 h-32 mx-auto rounded-lg object-cover mb-4"
                  />
                  <h3 className="text-xl font-bold">{currentMatch.restaurants.name}</h3>
                  <p className="text-muted-foreground">{currentMatch.restaurants.category}</p>
                  <p className="text-sm mt-2">⭐ {currentMatch.restaurants.rating}</p>
                </div>
                
                <Button
                  onClick={() => {
                    setShowMatchModal(false);
                    navigate(`/restaurant/${currentMatch.restaurants.id}`);
                  }}
                  className="w-full"
                >
                  Conhecer Restaurante
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
};

export default MatchingPage;
