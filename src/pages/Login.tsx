import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MagicBentoCard } from '@/components/bento/MagicBento';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LightRays from '@/components/backgrounds/LightRays';
import Particles from '@/components/backgrounds/Particles';

export default function Login() {
  const [email, setEmail] = useState('admin@email.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    const roleToRoute: Record<string, string> = {
      owner: '/dashboard',
      doctor: '/agenda',
      secretary: '/agenda',
    };
    const target = roleToRoute[(user?.role || '')] || '/agenda';
    return <Navigate to={target} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <Particles particleCount={80} particleColor="#00FFFF" />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LightRays raysColor="#00FFFF" followMouse={true} />
      </div>
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center gap-4">
          <img src="/medx-logo.png" alt="MedX" className="w-48 h-48 object-contain" />
          <p className="text-muted-foreground mt-1">Sistema de Gestão Médica</p>
        </div>
        <MagicBentoCard>
          <CardHeader>
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>Digite suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </MagicBentoCard>
      </div>
    </div>
  );
}
