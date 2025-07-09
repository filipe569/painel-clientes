
import React from 'react';
import { ClientWithStatus } from '../types';
import ClientCard from './ClientCard';

interface ClientGridProps {
  clients: ClientWithStatus[];
  onEdit: (client: ClientWithStatus) => void;
  onDelete: (client: ClientWithStatus) => void;
  onRenewRequest: (client: ClientWithStatus) => void;
  
  // Drag and Drop props
  dropTargetId: string | null;
  onDragStart: (client: ClientWithStatus) => void;
  onDragEnd: () => void;
  onDrop: (targetClient: ClientWithStatus) => void;
  setDropTargetId: (id: string | null) => void;
}

const ClientGrid: React.FC<ClientGridProps> = ({ clients, onEdit, onDelete, onRenewRequest, ...dndProps }) => {
  if (clients.length === 0) {
    return (
      <div className="text-center p-16 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
        <p className="font-semibold">Nenhum cliente encontrado</p>
        <p className="text-sm">Tente ajustar seus filtros ou adicione um novo cliente.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clients.map(client => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
          onRenewRequest={onRenewRequest}
          isDropTarget={dndProps.dropTargetId === client.id}
          onDragStart={() => dndProps.onDragStart(client)}
          onDragEnd={dndProps.onDragEnd}
          onDrop={() => dndProps.onDrop(client)}
          onDragEnter={(e) => { e.preventDefault(); dndProps.setDropTargetId(client.id); }}
          onDragLeave={() => dndProps.setDropTargetId(null)}
          onDragOver={(e) => e.preventDefault()}
        />
      ))}
    </div>
  );
};

export default ClientGrid;
