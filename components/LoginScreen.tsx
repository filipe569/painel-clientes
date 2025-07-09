import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { EnvelopeIcon, LockIcon, AiIcon } from './icons';
import { signIn } from '../services/firebaseService';

interface LoginScreenProps {
  panelTitle: string;
  logoUrl: string;
}

const mapAuthCodeToMessage = (code: string) => {
    switch (code) {
        case 'auth/wrong-password':
            return 'Senha incorreta. Tente novamente.';
        case 'auth/user-not-found':
            return 'Nenhum usuário encontrado com este e-mail.';
        case 'auth/invalid-email':
            return 'O formato do e-mail é inválido.';
        default:
            return 'Ocorreu um erro. Verifique os dados e tente novamente.';
    }
}

const LoginScreen: React.FC<LoginScreenProps> = ({ panelTitle, logoUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      // On success, App.tsx will handle the redirect
    } catch (err: any) {
      setError(mapAuthCodeToMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
                {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-9 h-9 rounded-full object-cover"/>
                ) : (
                    <AiIcon className="w-8 h-8 text-brand-400"/>
                )}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{panelTitle}</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
                Faça login para acessar seu painel.
            </p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<EnvelopeIcon className="w-5 h-5"/>}
              placeholder="seu@email.com"
              required
              autoFocus
            />
            <Input
              id="password"
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<LockIcon className="w-5 h-5"/>}
              placeholder="Digite sua senha"
              required
            />
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Processando...' : 'Entrar'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;