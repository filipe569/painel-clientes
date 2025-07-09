import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { 
  AddIcon, 
  ExportIcon, 
  ImportIcon, 
  BellIcon, 
  AiIcon, 
  WhatsAppIcon,
  CloudIcon,
  SettingsIcon 
} from '../icons';

interface QuickActionsProps {
  onAddClient: () => void;
  onExport: () => void;
  onQuickAdd: () => void;
  onBulkMessage: () => void;
  onBackup: () => void;
  onSettings: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsProps> = ({
  onAddClient,
  onExport,
  onQuickAdd,
  onBulkMessage,
  onBackup,
  onSettings
}) => {
  const actions = [
    {
      label: 'Novo Cliente',
      icon: <AddIcon className="w-5 h-5" />,
      onClick: onAddClient,
      color: 'bg-brand-500 hover:bg-brand-600',
      description: 'Adicionar cliente manualmente'
    },
    {
      label: 'Adição Rápida IA',
      icon: <AiIcon className="w-5 h-5" />,
      onClick: onQuickAdd,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Extrair dados com IA'
    },
    {
      label: 'Mensagem em Massa',
      icon: <WhatsAppIcon className="w-5 h-5" />,
      onClick: onBulkMessage,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Enviar para múltiplos clientes'
    },
    {
      label: 'Exportar Dados',
      icon: <ExportIcon className="w-5 h-5" />,
      onClick: onExport,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Baixar planilha Excel'
    },
    {
      label: 'Backup Nuvem',
      icon: <CloudIcon className="w-5 h-5" />,
      onClick: onBackup,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      description: 'Sincronizar com Google Drive'
    },
    {
      label: 'Configurações',
      icon: <SettingsIcon className="w-5 h-5" />,
      onClick: onSettings,
      color: 'bg-gray-500 hover:bg-gray-600',
      description: 'Personalizar sistema'
    }
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Ações Rápidas
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.label}</span>
              <span className="text-xs opacity-80 mt-1">{action.description}</span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActionsPanel;