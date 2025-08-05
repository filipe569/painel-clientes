import React, { useRef } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { TagIcon, PhotoIcon } from './icons';
import { AppSettings } from '../types';
import AutomationPanel from './Automation/AutomationPanel';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (updater: (prev: AppSettings) => AppSettings) => void;
  onManualBackup: () => void;
  onRestoreBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onManualBackup,
  onRestoreBackup: onRestoreFromFile,
}) => {
  const restoreInputRef = useRef<HTMLInputElement>(null);

  const handleRestoreClick = () => {
    restoreInputRef.current?.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurações">
      <div className="max-h-[75vh] overflow-y-auto pr-4 space-y-8">
        
        {/* Personalization Section */}
        <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Personalização do Painel</h3>
            <div className="space-y-4">
                <Input
                    id="panelTitle"
                    label="Nome do Painel"
                    icon={<TagIcon />}
                    value={settings.panelTitle}
                    onChange={(e) => onSettingsChange(s => ({ ...s, panelTitle: e.target.value }))}
                    placeholder="Ex: Meu Painel Pro"
                />
                <Input
                    id="logoUrl"
                    label="URL do Logo (Opcional)"
                    icon={<PhotoIcon />}
                    value={settings.logoUrl}
                    onChange={(e) => onSettingsChange(s => ({ ...s, logoUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                />
            </div>
        </section>

        {/* Automation Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Automações</h3>
          <AutomationPanel />
        </section>

        {/* Backup Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Backup e Restauração</h3>
          <div className="space-y-4">
             <p className="text-sm text-gray-600 dark:text-gray-400">
                Os dados são salvos em tempo real na nuvem do Firebase. Use as opções abaixo para criar um backup local (arquivo) ou para restaurar a partir de um arquivo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="secondary" onClick={onManualBackup}>Baixar Backup (JSON)</Button>
              <Button variant="secondary" onClick={handleRestoreClick}>Restaurar de Arquivo</Button>
              <input type="file" ref={restoreInputRef} onChange={onRestoreFromFile} accept=".json" className="hidden" />
            </div>
             <p className="text-xs text-gray-500 dark:text-gray-500 text-center">A restauração substituirá todos os dados do usuário atual. Use com cuidado.</p>
          </div>
        </section>

         <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose}>Fechar</Button>
        </div>

      </div>
    </Modal>
  );
};

export default SettingsModal;