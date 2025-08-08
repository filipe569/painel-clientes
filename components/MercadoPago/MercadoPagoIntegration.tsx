import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle, AlertCircle, Settings, Copy, ExternalLink } from 'lucide-react';

interface MercadoPagoIntegrationProps {
  settings: any;
  onUpdateSettings: (settings: any) => void;
}

export default function MercadoPagoIntegration({ settings, onUpdateSettings }: MercadoPagoIntegrationProps) {
  const [accessToken, setAccessToken] = useState(settings.mercadoPago?.accessToken || '');
  const [publicKey, setPublicKey] = useState(settings.mercadoPago?.publicKey || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showTokens, setShowTokens] = useState(false);

  const handleConnect = async () => {
    if (!accessToken || !publicKey) {
      alert('Por favor, preencha o Access Token e a Public Key');
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
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
        <div className="p-2 bg-blue-100 rounded-lg">
          <CreditCard className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mercado Pago</h3>
          <p className="text-sm text-gray-600">Integração para pagamentos online</p>
        </div>
      </div>

      {/* Status */}
      <div className={`p-4 rounded-lg border ${
        settings.mercadoPago?.enabled 
          ? 'bg-green-50 border-green-200' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          {settings.mercadoPago?.enabled ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Conectado</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800 font-medium">Desconectado</span>
            </>
          )}
        </div>
        {settings.mercadoPago?.enabled && (
          <p className="text-sm text-green-700 mt-1">
            Pronto para processar pagamentos
          </p>
        )}
      </div>

      {!settings.mercadoPago?.enabled ? (
        /* Configuração */
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Como configurar</h4>
                <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                  <li>Acesse sua conta no <a href="https://www.mercadopago.com.br/developers" target="_blank" rel="noopener noreferrer" className="underline">Mercado Pago Developers</a></li>
                  <li>Vá em "Suas integrações" → "Criar aplicação"</li>
                  <li>Copie o Access Token e Public Key</li>
                  <li>Cole as credenciais abaixo</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <div className="relative">
                <input
                  type={showTokens ? "text" : "password"}
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="APP_USR-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowTokens(!showTokens)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showTokens ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key
              </label>
              <input
                type={showTokens ? "text" : "password"}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="APP_USR-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleConnect}
              disabled={isConnecting || !accessToken || !publicKey}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Conectar Mercado Pago</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Painel Conectado */
        <div className="space-y-4">
          {/* Funcionalidades */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Funcionalidades Disponíveis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Links de pagamento</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Cobrança por WhatsApp</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Pagamento via PIX</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Cartão de crédito</span>
              </div>
            </div>
          </div>

          {/* Exemplo de uso */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Exemplo de Link de Pagamento</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <p className="font-medium">João Silva - R$ 89,90</p>
                  <p className="text-sm text-gray-600">Mensalidade Internet</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(generatePaymentLink('João Silva', 89.90))}
                    className="p-2 text-gray-600 hover:text-gray-800"
                    title="Copiar link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(generatePaymentLink('João Silva', 89.90), '_blank')}
                    className="p-2 text-blue-600 hover:text-blue-800"
                    title="Abrir link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">Mercado Pago conectado</p>
              <p className="text-xs text-gray-600">Credenciais configuradas</p>
            </div>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
            >
              Desconectar
            </button>
          </div>
        </div>
      )}

      {/* Avisos */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Importante</h4>
            <ul className="text-sm text-yellow-800 mt-1 space-y-1">
              <li>• Mantenha suas credenciais seguras</li>
              <li>• Use sempre o ambiente de produção para clientes reais</li>
              <li>• Verifique as taxas do Mercado Pago</li>
              <li>• Configure webhooks para receber notificações de pagamento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}