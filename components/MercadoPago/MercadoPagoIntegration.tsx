import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { CheckCircleIcon, ExclamationTriangleIcon, SettingsIcon } from '../icons';
import { AppSettings } from '../../types';
import { useToast } from '../ui/Toast';

interface MercadoPagoIntegrationProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const MercadoPagoIntegration: React.FC<MercadoPagoIntegrationProps> = ({ settings, onUpdateSettings }) => {
  const [accessToken, setAccessToken] = useState(settings.mercadoPago?.accessToken || '');
  const [publicKey, setPublicKey] = useState(settings.mercadoPago?.publicKey || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const { showToast } = useToast();

  const handleConnect = async () => {
    if (!accessToken || !publicKey) {
      showToast('error', 'Por favor, preencha o Access Token e a Public Key');
      return;
    }

    setIsConnecting(true);
    
    // Simular conexão com Mercado Pago
    setTimeout(() => {
      onUpdateSettings({
        ...settings,
        mercadoPago: {
          enabled: true,
          accessToken,
          publicKey
        }
      });
      showToast('success', 'Mercado Pago conectado com sucesso!');
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    onUpdateSettings({
      ...settings,
      mercadoPago: {
        enabled: false,
        accessToken: '',
        publicKey: ''
      }
    });
    setAccessToken('');
    setPublicKey('');
    showToast('info', 'Mercado Pago desconectado');
  };

  const generatePaymentLink = (clientName: string, amount: number) => {
    const baseUrl = 'https://www.mercadopago.com.br/checkout/v1/redirect';
    const params = new URLSearchParams({
      'pref_id': `client_${Date.now()}`,
      'source': 'link'
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mercado Pago</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Integração para pagamentos online</p>
        </div>
      </div>

      {/* Status */}
      <Card className={`${
        settings.mercadoPago?.enabled 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center space-x-2">
          {settings.mercadoPago?.enabled ? (
            <>
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <span className="text-green-800 dark:text-green-300 font-medium">Conectado</span>
            </>
          ) : (
            <>
              <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800 dark:text-gray-300 font-medium">Desconectado</span>
            </>
          )}
        </div>
        {settings.mercadoPago?.enabled && (
          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
            Pronto para processar pagamentos
          </p>
        )}
      </Card>

      {!settings.mercadoPago?.enabled ? (
        /* Configuração */
        <div className="space-y-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <SettingsIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-300">Como configurar</h4>
                <ol className="text-sm text-blue-800 dark:text-blue-400 mt-2 space-y-1 list-decimal list-inside">
                  <li>Acesse sua conta no <a href="https://www.mercadopago.com.br/developers" target="_blank" rel="noopener noreferrer" className="underline">Mercado Pago Developers</a></li>
                  <li>Vá em "Suas integrações" → "Criar aplicação"</li>
                  <li>Copie o Access Token e Public Key</li>
                  <li>Cole as credenciais abaixo</li>
                </ol>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Access Token</label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowTokens(!showTokens)}>
                  {showTokens ? '🙈' : '👁️'}
                </Button>
              </div>
              <Input
                type={showTokens ? "text" : "password"}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="APP_USR-..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Public Key</label>
              <Input
                type={showTokens ? "text" : "password"}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="APP_USR-..."
              />
            </div>

            <Button
              onClick={handleConnect}
              disabled={isConnecting || !accessToken || !publicKey}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Conectando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Conectar Mercado Pago
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* Painel Conectado */
        <div className="space-y-4">
          {/* Funcionalidades */}
          <Card>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Funcionalidades Disponíveis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-300">Links de pagamento</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-300">Cobrança por WhatsApp</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-300">Pagamento via PIX</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-300">Cartão de crédito</span>
              </div>
            </div>
          </Card>

          {/* Exemplo de uso */}
          <Card className="bg-gray-50 dark:bg-gray-900/50">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Exemplo de Link de Pagamento</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">João Silva - R$ 89,90</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mensalidade Internet</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const link = generatePaymentLink('João Silva', 89.90);
                      navigator.clipboard.writeText(link);
                      showToast('success', 'Link copiado!');
                    }}
                    title="Copiar link"
                  >
                    📋
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(generatePaymentLink('João Silva', 89.90), '_blank')}
                    title="Abrir link"
                  >
                    🔗
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Configurações */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Mercado Pago conectado</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Credenciais configuradas</p>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="secondary"
            >
              Desconectar
            </Button>
          </div>
        </div>
      )}

      {/* Avisos */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 dark:text-yellow-300">Importante</h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-400 mt-1 space-y-1">
              <li>• Mantenha suas credenciais seguras</li>
              <li>• Use sempre o ambiente de produção para clientes reais</li>
              <li>• Verifique as taxas do Mercado Pago</li>
              <li>• Configure webhooks para receber notificações de pagamento</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MercadoPagoIntegration;