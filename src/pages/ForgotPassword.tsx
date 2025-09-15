import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedInput } from "@/components/ui/animated-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de recuperação de senha
    console.log("Password recovery request for:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-primary-foreground">L</span>
          </div>
        </div>

        {/* Forgot Password Card */}
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg border border-border/50">
          <CardHeader className="space-y-1 pb-4">
            <h2 className="text-xl font-semibold text-center text-card-foreground">
              {isSubmitted ? "E-mail enviado" : "Recuperar senha"}
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              {isSubmitted 
                ? "Verifique sua caixa de entrada e siga as instruções para redefinir sua senha"
                : "Digite seu e-mail para receber um link de redefinição de senha"
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <AnimatedInput
                  id="email"
                  type="email"
                  label="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  Enviar link de redefinição
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Success Message */}
                <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <Mail className="h-12 w-12 text-accent mx-auto mb-2" />
                  <p className="text-sm text-card-foreground">
                    Um e-mail foi enviado para <strong>{email}</strong> com instruções para redefinir sua senha.
                  </p>
                </div>

                {/* Resend Button */}
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full h-12 border-border hover:bg-accent/50 transition-all duration-200"
                >
                  Tentar com outro e-mail
                </Button>
              </div>
            )}

            {/* Back to Login Link */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            Não recebeu o e-mail?{" "}
            <button 
              onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Reenviar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;