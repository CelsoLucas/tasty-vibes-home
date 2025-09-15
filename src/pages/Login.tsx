import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedInput } from "@/components/ui/animated-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Função para verificar se o email existe no banco de dados
  const checkEmailExists = async (email: string) => {
    if (!email) return false;
    
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking email:', error);
        return true; // Em caso de erro, assumir que existe para não bloquear
      }
      
      return data !== null; // Se data existe, o email foi encontrado
    } catch {
      return true; // Em caso de erro, assumir que existe
    }
  };

  // Validação do email sem verificação em tempo real
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError("");
  };

  // Validação da senha
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Verificar tipo específico de erro
        if (error.message.includes('Invalid login credentials')) {
          // Verificar se o email existe no banco de dados
          const emailExists = await checkEmailExists(email);
          if (!emailExists) {
            setEmailError("Este email não está cadastrado");
          } else {
            setPasswordError("Senha incorreta");
          }
        } else if (error.message.includes('Email not confirmed')) {
          setEmailError("Por favor, confirme seu email antes de fazer login");
        } else {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Erro no login social",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login social",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">L</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg border border-border/50">
          <CardHeader className="space-y-1 pb-4">
            <h2 className="text-xl font-semibold text-center text-card-foreground">Entrar</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <AnimatedInput
                id="email"
                type="email"
                label="E-mail"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                error={emailError}
                required
              />

              {/* Password Field */}
              <AnimatedInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Senha"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onRightIconClick={() => setShowPassword(!showPassword)}
                error={passwordError}
                required
              />

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Esqueci minha senha
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou continue com</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                className="h-12 border-border hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("facebook")}
                className="h-12 border-border hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            Não tem uma conta?{" "}
            <Link 
              to="/register" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;