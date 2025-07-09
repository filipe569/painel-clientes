

import React from 'react';
import { ClientWithStatus, SortOption } from '../types';
import ClientRow from './ClientRow';

interface ClientTableProps {
  clients: ClientWithStatus[];
  onEdit: (client: ClientWithStatus) => void;
  onDelete: (client: ClientWithStatus) => void;
  onRenewRequest: (client: ClientWithStatus) => void;
  setSort: (sort: SortOption) => void;
  currentSort: SortOption;
  
  // Drag and Drop props
  dropTargetId: string | null;
  onDragStart: (client: ClientWithStatus) => void;
  onDragEnd: () => void;
  onDrop: (targetClient: ClientWithStatus) => void;
  setDropTargetId: (id: string | null) => void;
}

const TableHeader: React.FC<{ title: string; sortKey: SortOption; currentSort: SortOption; setSort: (sort: SortOption) => void }> = ({ title, sortKey, currentSort, setSort }) => {
  const isCurrentSort = currentSort === sortKey;
  return (
    <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      <button onClick={() => setSort(sortKey)} className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        {title}
        {isCurrentSort && <span className="text-brand-400">↓</span>}
      </button>
    </th>
  );
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onEdit, onDelete, onRenewRequest, setSort, currentSort, ...dndProps }) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <TableHeader title="Cliente / Login" sortKey={SortOption.Nome} currentSort={currentSort} setSort={setSort} />
            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Senha</th>
            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Servidor</th>
            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Telefone</th>
            <TableHeader title="Vencimento" sortKey={SortOption.Vencimento} currentSort={currentSort} setSort={setSort} />
            <TableHeader title="Status" sortKey={SortOption.Status} currentSort={currentSort} setSort={setSort} />
            <th scope="col" className="relative p-4">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {clients.length > 0 ? (
            clients.map(client => (
              <ClientRow
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
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center p-8 text-gray-500 dark:text-gray-400">
                Nenhum cliente encontrado. Tente ajustar seus filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;