'use client';

import { useState } from 'react';
import { loginWithEmail } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { user, error } = await loginWithEmail(email, password);
    
    if (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
      setLoading(false);
      return;
    }

    if (user) {
      // Salvar no sessionStorage assim como no site original
      sessionStorage.setItem('loggedIn', 'true');
      router.push('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-background/50 backdrop-blur-lg rounded-lg border border-border/50 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-2">Bem-vindo de volta!</h2>
      <p className="text-muted-foreground text-center mb-6">Acesse sua conta para ver análises premium</p>
      
      <form onSubmit={handleLogin}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></span>
                Entrando...
              </>
            ) : 'Entrar'}
          </Button>
        </div>
      </form>
    </div>
  );
}