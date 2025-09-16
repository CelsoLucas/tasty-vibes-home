import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserMatches } from "@/hooks/useMatching";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const MyMatchesPage = () => {
  const navigate = useNavigate();
  const { data: matches, isLoading } = useUserMatches();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center">Carregando seus matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-xl font-semibold">Meus Matches</h1>
          
          <div className="w-20" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          {!matches || matches.length === 0 ? (
            <div className="text-center pt-20">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Nenhum match ainda</h2>
              <p className="text-muted-foreground mb-6">
                Participe de sessões de matching com seus amigos para encontrar restaurantes que vocês dois gostem!
              </p>
              <Button onClick={() => navigate('/matching')}>
                Começar Matching
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold">
                  Você tem {matches.length} match{matches.length !== 1 ? 'es' : ''}! 🎉
                </h2>
              </div>

              {matches.map((match) => (
                <Card key={match.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Restaurant Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={match.restaurants?.image_url || '/placeholder-restaurant.jpg'}
                          alt={match.restaurants?.name || 'Restaurant'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Restaurant Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {match.restaurants?.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-1">
                              {match.restaurants?.category}
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <span>⭐ {match.restaurants?.rating}</span>
                              <span className="text-muted-foreground">•</span>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(new Date(match.created_at), {
                                  addSuffix: true,
                                  locale: ptBR
                                })}
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/restaurant/${match.restaurants?.id}`)}
                            className="ml-2"
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Action Button */}
              <div className="text-center pt-6">
                <Button onClick={() => navigate('/matching')}>
                  Fazer Novo Matching
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMatchesPage;