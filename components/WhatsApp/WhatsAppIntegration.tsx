import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CheckCircleIcon, ExclamationTriangleIcon } from '../icons';
import { AppSettings } from '../../types';
import { useToast } from '../ui/Toast';

interface WhatsAppIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (updater: (prev: AppSettings) => AppSettings) => void;
}

const WhatsAppIntegration: React.FC<WhatsAppIntegrationProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { showToast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simular processo de conexão
    setTimeout(() => {
      // Gerar QR Code simulado
      setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    onSettingsChange(prev => ({
      ...prev,
      whatsappConnected: false,
      whatsappNumber: ''
    }));
    setQrCode(null);
    showToast('info', 'WhatsApp desconectado com sucesso.');
  };

  const simulateConnection = () => {
    onSettingsChange(prev => ({
      ...prev,
      whatsappConnected: true,
      whatsappNumber: '+55 11 99999-8888'
    }));
    setQrCode(null);
    showToast('success', 'WhatsApp conectado com sucesso!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Integração WhatsApp">
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            WhatsApp Business
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Conecte seu WhatsApp para enviar cobranças automaticamente
          </p>
        </div>

        {!settings.whatsappConnected ? (
          <div className="space-y-4">
            {!qrCode ? (
              <div className="text-center">
                <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
                  {isConnecting ? 'Iniciando conexão...' : 'Conectar WhatsApp'}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Você precisará escanear um QR Code com seu celular
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="w-48 h-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">QR Code</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    1. Abra o WhatsApp no seu celular
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    2. Vá em Configurações → Aparelhos conectados
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    3. Escaneie o QR Code acima
                  </p>
                  <Button onClick={simulateConnection} variant="secondary" size="sm">
                    Simular Conexão (Demo)
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">
                  WhatsApp Conectado
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {settings.whatsappNumber}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Funcionalidades Disponíveis:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  Envio de lembretes de vencimento
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  Cobranças automáticas
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  Mensagens personalizadas
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  Relatórios de entrega
                </li>
              </ul>
            </div>

            <Button onClick={handleDisconnect} variant="secondary" className="w-full">
              Desconectar WhatsApp
            </Button>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                Importante:
              </p>
              <p className="text-yellow-700 dark:text-yellow-400">
                Use apenas números de WhatsApp Business. O envio em massa pode resultar em bloqueio da conta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WhatsAppIntegration;