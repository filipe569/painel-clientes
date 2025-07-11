import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ClientWithStatus, ClientStatus } from '../../types';
import { WhatsAppIcon, AiIcon } from '../icons';
import { generateRenewalReminder } from '../../services/geminiService';

interface BulkMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: ClientWithStatus[];
}

const BulkMessageModal: React.FC<BulkMessageModalProps> = ({ isOpen, onClose, clients }) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'all'>('all');

  const filteredClients = clients.filter(client => 
    filterStatus === 'all' || client.status === filterStatus
  );

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const generateTemplate = async () => {
    setIsGenerating(true);
    try {
      const template = await generateRenewalReminder('{{nome}}', '{{vencimento}}');
      setMessageTemplate(template);
    } catch (error) {
      console.error('Erro ao gerar template:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendMessages = () => {
    const selectedClientData = clients.filter(c => selectedClients.includes(c.id));
    
    selectedClientData.forEach(client => {
      if (client.telefone) {
        // Explicitly declare local variables to avoid ReferenceError
        const clientName = client.nome;
        const clientVencimento = client.vencimento;
        const clientServidor = client.servidor;
        const clientLogin = client.login;
        
        const personalizedMessage = messageTemplate
          .replace(/\{\{nome\}\}/g, String(client.nome || ''))
          .replace(/\{\{vencimento\}\}/g, new Date(client.vencimento + 'T00:00:00').toLocaleDateString('pt-BR'))
          .replace(/\{\{servidor\}\}/g, String(client.servidor || ''))
          .replace(/\{\{login\}\}/g, String(client.login || ''));

        const phoneNumber = client.telefone.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(personalizedMessage)}`;
        window.open(whatsappUrl, '_blank');
      }
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mensagem em Massa" maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Template de Mensagem */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Template da Mensagem
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateTemplate}
              disabled={isGenerating}
            >
              <AiIcon className="w-4 h-4 mr-1" />
              {isGenerating ? 'Gerando...' : 'Gerar com IA'}
            </Button>
          </div>
          <textarea
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            rows={4}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            placeholder="Digite sua mensagem aqui. Use {{nome}}, {{vencimento}}, {{servidor}}, {{login}} para personalizar."
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Variáveis disponíveis: {{nome}}, {{vencimento}}, {{servidor}}, {{login}}
          </p>
        </div>

        {/* Filtros e Seleção */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ClientStatus | 'all')}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Todos os Status</option>
              <option value={ClientStatus.Ativo}>Ativos</option>
              <option value={ClientStatus.ProximoVencimento}>Próximo Vencimento</option>
              <option value={ClientStatus.Vencido}>Vencidos</option>
            </select>
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              {selectedClients.length === filteredClients.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </Button>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedClients.length} de {filteredClients.length} selecionados
          </span>
        </div>

        {/* Lista de Clientes */}
        <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          {filteredClients.map(client => (
            <div
              key={client.id}
              className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={() => handleClientToggle(client.id)}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{client.nome}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {client.telefone || 'Sem telefone'} • {client.status}
                  </p>
                </div>
              </div>
              {client.telefone && (
                <WhatsAppIcon className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={sendMessages}
            disabled={selectedClients.length === 0 || !messageTemplate.trim()}
          >
            <WhatsAppIcon className="w-4 h-4 mr-2" />
            Enviar {selectedClients.length} Mensagens
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkMessageModal;