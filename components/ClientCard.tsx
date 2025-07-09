
import React, { useState } from 'react';
import { ClientWithStatus, ClientStatus } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/DropdownMenu';
import { DotsVerticalIcon, EditIcon, DeleteIcon, RenewIcon, ClipboardDocumentListIcon } from './icons';
import { useToast } from './ui/Toast';

interface ClientCardProps {
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
}

const statusClasses = {
  [ClientStatus.Ativo]: {
    base: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
    dot: 'bg-green-500',
  },
  [ClientStatus.ProximoVencimento]: {
    base: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30',
    dot: 'bg-yellow-500',
  },
  [ClientStatus.Vencido]: {
    base: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30',
    dot: 'bg-red-500',
  },
};

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete, onRenewRequest, isDropTarget, ...dragProps }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { showToast } = useToast();

  const handleDragStart = () => {
    setIsDragging(true);
    dragProps.onDragStart();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragProps.onDragEnd();
  };
  
  const handleCopyToClipboard = (text: string | undefined, fieldName: string) => {
    if (!text) {
        showToast('info', `Campo ${fieldName} está vazio.`);
        return;
    }
    navigator.clipboard.writeText(text);
    showToast('success', `${fieldName} copiado para a área de transferência!`);
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      {...dragProps}
      className={`transition-all duration-300 ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} ${isDropTarget ? 'outline-2 outline-dashed outline-offset-2 outline-brand-500 rounded-xl' : ''}`}
    >
      <Card className="flex flex-col h-full group">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{client.nome}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate" onClick={(e) => { e.stopPropagation(); handleCopyToClipboard(client.login, 'Login')}}>{client.login}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="!p-1.5 -mr-2 flex-shrink-0">
                <DotsVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => onEdit(client)}>
                <EditIcon className="w-4 h-4 mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(client)}>
                <DeleteIcon className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                <span className="text-red-500 dark:text-red-400">Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="my-4 flex-grow space-y-3 text-sm">
            <div className="flex justify-between items-center cursor-pointer group/copy" onClick={() => handleCopyToClipboard(client.senha, 'Senha')}>
                <span className="text-gray-600 dark:text-gray-400">Senha</span>
                <span className="font-mono text-gray-800 dark:text-gray-200 group-hover/copy:opacity-50">{'*'.repeat(8)}</span>
            </div>
            <div className="flex justify-between items-center cursor-pointer group/copy" onClick={() => handleCopyToClipboard(client.servidor, 'Servidor')}>
                <span className="text-gray-600 dark:text-gray-400">Servidor</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate group-hover/copy:opacity-50">{client.servidor}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Vencimento</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(client.vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
            </div>
             {client.notes && (
                <div className="relative pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md border border-gray-200 dark:border-gray-700/50 whitespace-pre-wrap max-h-20 overflow-y-auto group-hover:max-h-40 transition-all">
                        <ClipboardDocumentListIcon className="w-4 h-4 inline mr-1 text-gray-400 dark:text-gray-500 flex-shrink-0"/>
                        {client.notes}
                    </p>
                </div>
            )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
           <span className={`px-2.5 py-1 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full border ${statusClasses[client.status].base}`}>
                <span className={`w-2 h-2 rounded-full ${statusClasses[client.status].dot}`}></span>
                {client.status}
            </span>
           {(client.status === ClientStatus.ProximoVencimento || client.status === ClientStatus.Vencido) && (
             <Button variant="secondary" size="sm" onClick={() => onRenewRequest(client)}>
                <RenewIcon className="w-4 h-4 mr-1" />
                Renovar
             </Button>
           )}
        </div>
      </Card>
    </div>
  );
};

export default ClientCard;
