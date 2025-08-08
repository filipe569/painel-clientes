import React, { useState } from 'react';
import { ClientWithStatus, ClientStatus } from '../types';
import { EditIcon, DeleteIcon, RenewIcon, AiIcon, PhoneIcon, WhatsAppIcon, ClipboardDocumentListIcon, DragHandleIcon } from './icons';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { generateRenewalReminder } from '../services/geminiService';
import { useToast } from './ui/Toast';

interface ClientRowProps {
  client: ClientWithStatus;
  onEdit: (client: ClientWithStatus) => void;
  onDelete: (client: ClientWithStatus) => void;
  onRenewRequest: (client: ClientWithStatus) => void;
  isDropTarget: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: () => void;
  mercadoPagoEnabled?: boolean;
}

const statusClasses = {
  [ClientStatus.Ativo]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
  [ClientStatus.ProximoVencimento]: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30',
  [ClientStatus.Vencido]: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30',
};

const ClientRow: React.FC<ClientRowProps> = ({ client, onEdit, onDelete, onRenewRequest, isDropTarget, mercadoPagoEnabled = false, ...dragProps }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const [isLoadingReminder, setIsLoadingReminder] = useState(false);
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
    dragProps.onDragStart();
  }

  const handleDragEnd = () => {
    setIsDragging(false);
    dragProps.onDragEnd();
  }


  const handleGenerateReminderForModal = async () => {
    setIsLoadingReminder(true);
    setReminderMessage('');
    try {
      const message = await generateRenewalReminder(client.nome, new Date(client.vencimento + 'T00:00:00').toLocaleDateString('pt-BR'));
      setReminderMessage(message);
    } catch (e) {
      setReminderMessage("Não foi possível gerar a mensagem de renovação no momento.");
      console.error(e);
    } finally {
      setIsLoadingReminder(false);
    }
  };

  const openReminderModal = () => {
    setReminderModalOpen(true);
    handleGenerateReminderForModal();
  };

  const handleSendWhatsApp = async () => {
    if (!client.telefone) {
      showToast('error', 'Este cliente não tem um telefone cadastrado.');
      return;
    }

    let whatsappTab: Window | null = null;
    try {
      whatsappTab = window.open('', '_blank', 'noopener,noreferrer');
      if (whatsappTab) {
        whatsappTab.document.body.innerHTML = `<div style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #1f2937; color: #d1d5db;">Gerando mensagem com IA para enviar no WhatsApp...</div>`;
      } else {
        showToast('error', 'Pop-up bloqueado. Por favor, habilite pop-ups para este site.');
        return;
      }
    } catch (error) {
      showToast('error', 'Pop-up bloqueado. Por favor, habilite pop-ups para este site.');
      return;
    }

    setIsLoadingReminder(true);
    try {
      const message = await generateRenewalReminder(client.nome, new Date(client.vencimento + 'T00:00:00').toLocaleDateString('pt-BR'));

      if (message && !message.includes("indisponível") && !message.includes("Não foi possível")) {
        const phoneNumber = client.telefone.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        if (whatsappTab) {
          whatsappTab.location.href = whatsappUrl;
        }
      } else {
        showToast('error', 'Não foi possível gerar a mensagem de lembrete.');
        if (whatsappTab) {
          whatsappTab.document.body.innerHTML = `<div style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #1f2937; color: #d1d5db;">Falha ao gerar mensagem. Esta aba será fechada em 3 segundos.</div>`;
          setTimeout(() => whatsappTab.close(), 3000);
        }
      }
    } catch (error) {
      showToast('error', 'Ocorreu um erro ao gerar o lembrete.');
      console.error("Error sending to WhatsApp:", error);
      if (whatsappTab) {
        whatsappTab.document.body.innerHTML = `<div style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #1f2937; color: #d1d5db;">Ocorreu um erro. Esta aba será fechada em 3 segundos.</div>`;
        setTimeout(() => whatsappTab.close(), 3000);
      }
    } finally {
      setIsLoadingReminder(false);
    }
  };

  const generatePaymentLink = () => {
    if (!mercadoPagoEnabled) {
      alert('Configure o Mercado Pago nas configurações primeiro');
      return;
    }
    
    const baseUrl = 'https://www.mercadopago.com.br/checkout/v1/redirect';
    const params = new URLSearchParams({
      'pref_id': `client_${client.id}_${Date.now()}`,
      'source': 'link'
    });
    const paymentUrl = `${baseUrl}?${params.toString()}`;
    
    // Copiar para clipboard
    navigator.clipboard.writeText(paymentUrl).then(() => {
      alert('Link de pagamento copiado para a área de transferência!');
    });
  };


  return (
    <>
      <tr 
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={dragProps.onDrop}
        onDragOver={dragProps.onDragOver}
        onDragEnter={dragProps.onDragEnter}
        onDragLeave={dragProps.onDragLeave}
        className={`bg-white dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 group ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} ${isDropTarget ? 'outline-2 outline-dashed outline-offset-[-2px] outline-brand-500' : ''}`}
      >
        <td className="p-4 whitespace-nowrap">
            <div className="flex items-center gap-2">
                <DragHandleIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing"/>
                <div>
                    <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{client.nome}</div>
                        {client.notes && (
                            <div className="relative">
                                <ClipboardDocumentListIcon className="w-4 h-4 text-gray-400" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-pre-wrap">
                                    {client.notes}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{client.login}</div>
                </div>
            </div>
        </td>
        <td className="p-4 whitespace-nowrap">
          <div 
            className="flex items-center cursor-pointer" 
            onMouseEnter={() => setShowPassword(true)} 
            onMouseLeave={() => setShowPassword(false)}
          >
            {showPassword ? (
              <span className="font-mono text-gray-700 dark:text-gray-300">{client.senha || 'N/A'}</span>
            ) : (
              <span className="font-mono text-gray-700 dark:text-gray-300">{'*'.repeat(8)}</span>
            )}
          </div>
        </td>
        <td className="p-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{client.servidor}</td>
        <td className="p-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{client.telefone || 'N/A'}</td>
        <td className="p-4 whitespace-nowrap">
          <div className="text-gray-900 dark:text-gray-100">{new Date(client.vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
          {client.status !== ClientStatus.Vencido && client.diasRestantes !== null && (
             <div className="text-xs text-gray-500 dark:text-gray-400">{client.diasRestantes} dias restantes</div>
          )}
        </td>
        <td className="p-4 whitespace-nowrap">
          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusClasses[client.status]}`}>
            {client.status}
          </span>
        </td>
        <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-1">
            {(client.status === ClientStatus.ProximoVencimento || client.status === ClientStatus.Vencido) && (
              <>
                 {client.telefone && (
                    <Button variant="ghost" size="sm" onClick={handleSendWhatsApp} disabled={isLoadingReminder} title="Enviar lembrete via WhatsApp">
                        <WhatsAppIcon className="text-green-400" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={openReminderModal} title="Gerar lembrete de renovação com IA">
                    <AiIcon />
                  </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={generatePaymentLink}
              className={`${
                mercadoPagoEnabled 
                  ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300' 
                  : 'text-gray-400 cursor-not-allowed dark:text-gray-500'
              }`}
              title={mercadoPagoEnabled ? "Gerar link de pagamento" : "Configure o Mercado Pago primeiro"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onRenewRequest(client)} title="Renovar por 30 dias">
              <RenewIcon />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(client)} title="Editar cliente">
              <EditIcon />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(client)} className="text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300" title="Excluir cliente">
              <DeleteIcon />
            </Button>
          </div>
        </td>
      </tr>

      <Modal isOpen={isReminderModalOpen} onClose={() => setReminderModalOpen(false)} title={`Lembrete para ${client.nome}`}>
          {isLoadingReminder ? (
              <div className="flex items-center justify-center h-24">
                  <p className="text-gray-700 dark:text-gray-300 animate-pulse">Gerando mensagem com IA...</p>
              </div>
          ) : (
              <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 whitespace-pre-wrap">{reminderMessage}</p>
                  <Button onClick={() => navigator.clipboard.writeText(reminderMessage)}>Copiar Mensagem</Button>
              </div>
          )}
      </Modal>
    </>
  );
};

export default ClientRow;