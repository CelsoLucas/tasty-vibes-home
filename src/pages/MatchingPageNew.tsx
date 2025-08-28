import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Heart, X, Users, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MatchingPageNew = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'create' | 'join' | 'session'>('create');
  const [sessionCode, setSessionCode] = useState("");
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters for creating session
  const [filters, setFilters] = useState({
    category: "",
    price_range: "",
  });

  // Check for session code in URL
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setSessionCode(code);
      setMode('join');
    }
  }, [searchParams]);

  const handleCreateSession = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get restaurants based on filters
      let query = (supabase as any).from('restaurants').select('id');
      
      if (filters.category && filters.category !== "") {
        query = query.eq('category', filters.category);
      }
      if (filters.price_range && filters.price_range !== "") {
        query = query.eq('price_range', filters.price_range);
      }

      const { data: restaurants, error: restaurantsError } = await query;
      if (restaurantsError) throw restaurantsError;

      const restaurantIds = restaurants?.map((r: any) => r.id) || [];
      
      // Se não encontrou restaurantes com os filtros, pega todos
      if (restaurantIds.length === 0) {
        const { data: allRestaurants, error: allError } = await (supabase as any)
          .from('restaurants')
          .select('id');
        
        if (allError) throw allError;
        restaurantIds.push(...(allRestaurants?.map((r: any) => r.id) || []));
      }
      
      const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data, error } = await (supabase as any)
        .from('matching_sessions')
        .insert({
          created_by: user.user.id,
          session_code: sessionCode,
          filters,
          restaurant_ids: restaurantIds,
          participants: [user.user.id]
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentSession(data);
      setMode('session');
      
      toast({
        title: "Sessão criada!",
        description: "Compartilhe o código com seu amigo para começar.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar sessão",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSession = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Find session by code
      const { data: sessions, error: sessionError } = await (supabase as any)
        .from('matching_sessions')
        .select('*')
        .eq('session_code', sessionCode.toUpperCase())
        .maybeSingle();

      if (sessionError) throw sessionError;
      if (!sessions) throw new Error('Código de sessão não encontrado');
      
      // Check if user is already in the session
      if ((sessions as any).participants.includes(user.user.id)) {
        setCurrentSession(sessions);
        setMode('session');
        return;
      }

      if ((sessions as any).participants.length >= 2) {
        throw new Error('Esta sessão já está cheia');
      }

      const { data, error } = await (supabase as any).rpc('add_participant_to_session', {
        p_session_id: (sessions as any).id,
        p_user_id: user.user.id
      });

      if (error) {
        console.error('RPC error, trying direct update:', error);
        const updatedParticipants = [...(sessions as any).participants, user.user.id];
        const { data: updateData, error: updateError } = await (supabase as any)
          .from('matching_sessions')
          .update({
            participants: updatedParticipants,
            status: updatedParticipants.length >= 2 ? 'active' : 'waiting'
          })
          .eq('id', (sessions as any).id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        setCurrentSession(updateData);
      } else {
        setCurrentSession(data);
      }
      
      setMode('session');
      
      toast({
        title: "Entrou na sessão!",
        description: "Redirecionando para a sessão.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao entrar na sessão",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (currentSession) {
      const url = `${window.location.origin}/matching?code=${currentSession.session_code}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "Compartilhe este link com seu amigo.",
      });
    }
  };

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
                    <SelectItem value="Italiana">Italiana</SelectItem>
                    <SelectItem value="Brasileira">Brasileira</SelectItem>
                    <SelectItem value="Japonesa">Japonesa</SelectItem>
                    <SelectItem value="Fast Food">Fast Food</SelectItem>
                    <SelectItem value="Pizzaria">Pizzaria</SelectItem>
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
                  disabled={isLoading}
                >
                  {isLoading ? "Criando..." : "Criar Sessão"}
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
                disabled={!sessionCode || isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar na Sessão"}
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
            
            {currentSession && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Participantes: {currentSession.participants?.length || 0}/2
                </div>
                <div className="text-sm font-mono">
                  Código: {currentSession.session_code}
                </div>
                {currentSession.participants && currentSession.participants.length < 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyInviteLink}
                    className="mt-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Link
                  </Button>
                )}
              </div>
            )}
            
            <div className="w-20" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {currentSession && currentSession.participants && currentSession.participants.length < 2 ? (
            <div className="max-w-md mx-auto text-center pt-20">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Aguardando segundo participante...</h2>
              <p className="text-muted-foreground mb-2">
                Participantes: {currentSession.participants?.length || 0}/2
              </p>
              <p className="text-muted-foreground mb-6">
                Compartilhe o código <span className="font-mono font-bold">{currentSession.session_code}</span> com seu amigo
              </p>
              <Button onClick={copyInviteLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link de Convite
              </Button>
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center pt-20">
              <h2 className="text-xl font-semibold mb-2">Sessão Ativa!</h2>
              <p className="text-muted-foreground">
                Ambos participantes estão conectados. Função de swipe será implementada em breve.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default MatchingPageNew;