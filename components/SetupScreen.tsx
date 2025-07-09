import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { AiIcon, ErrorIcon } from './icons';

const SetupScreen: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3">
                        <AiIcon className="w-10 h-10 text-brand-400"/>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Gerenciador de Clientes Pro</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Pronto para organizar seus clientes de forma inteligente.</p>
                </div>
                <Card className="border-brand-500/50">
                    <div className="text-center p-4">
                        <div className="flex justify-center items-center gap-2 mb-4">
                            <ErrorIcon className="w-7 h-7 text-yellow-500 dark:text-yellow-400"/>
                            <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">Configuração Inicial Necessária</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">Para começar, você precisa conectar a aplicação ao seu próprio Firebase. É grátis e seguro.</p>
                    </div>
                    
                    <div className="space-y-4 text-left bg-gray-100 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Siga os passos abaixo:</h3>
                        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                            <li>Acesse o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline font-semibold">Firebase Console</a> e vá para seu projeto.</li>
                            <li>Vá para <strong className="text-yellow-600 dark:text-yellow-400">Configurações do Projeto</strong> (ícone de engrenagem no topo do menu lateral).</li>
                            <li>Na aba "Geral", role para baixo até a seção <strong className="text-yellow-600 dark:text-yellow-400">"Seus apps"</strong>.</li>
                            <li>Selecione seu aplicativo da Web ou crie um novo.</li>
                            <li>Na caixa de configuração do SDK, escolha a opção <strong className="text-yellow-600 dark:text-yellow-400">"Config"</strong>.</li>
                            <li>Abra o arquivo <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-sm">services/firebaseService.ts</code> no seu editor de código.</li>
                            <li><strong className="text-yellow-600 dark:text-yellow-400">Copie o objeto `firebaseConfig` inteiro</strong> do Firebase e cole-o no lugar do objeto de exemplo em `firebaseService.ts`.</li>
                        </ol>
                    </div>

                    <div className="mt-8 text-center">
                        <Button onClick={() => window.location.reload()} size="lg" variant="primary">
                            Já configurei, Recarregar a Página
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SetupScreen;