import React, { useState, useEffect } from 'react';
import { Client, ClientWithStatus, FilterOption, SortOption, ViewMode, AuthUser, AppSettings } from './types';
import { useClientManager } from './hooks/useClientManager';
import { useTheme, ThemeProvider } from './hooks/useTheme';
import { ToastProvider, useToast } from './components/ui/Toast';
import { onAuthChanged, isFirebaseConfigured } from './services/firebaseService';
import { exportToExcel } from './services/exportService';

// Components
import LoginScreen from './components/LoginScreen';
import SetupScreen from './components/SetupScreen';
import Dashboard from './components/Dashboard';
import ClientFormModal from './components/ClientFormModal';
import HistoryModal from './components/HistoryModal';
import ConfirmModal from './components/ui/ConfirmModal';
import ClientGrid from './components/ClientGrid';
import ClientTable from './components/ClientTable';
import ThemeToggle from './components/ThemeToggle';

// Icons
import { 
  AddIcon, 
  SearchIcon, 
  ExportIcon, 
  HistoryIcon, 
  LogoutIcon, 
  SettingsIcon,
  ViewGridIcon,
  ViewListIcon
} from './components/icons';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { showToast } = useToast();
  
  // Modal states
  const [showClientForm, setShowClientForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Client management
  const [clientToEdit, setClientToEdit] = useState<Partial<Client> | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientWithStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Grid);
  
  // Drag and drop
  const [draggedClient, setDraggedClient] = useState<ClientWithStatus | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    panelTitle: 'Gerenciador de Clientes Pro',
    logoUrl: '',
  });

  const {
    clients,
    allClientsWithStatus,
    history,
    appState,
    addClient,
    updateClient,
    updateClientOrder,
    deleteClient,
    renewClient,
    restoreState,
    setSearchTerm: setClientSearchTerm,
    setFilter,
    filter,
    setSort,
    sort,
    dashboardStats,
    isLoading,
    dbError,
  } = useClientManager(user);

  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      setUser(user);
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setClientSearchTerm(searchTerm);
  }, [searchTerm, setClientSearchTerm]);

  const handleAddClient = () => {
    setClientToEdit(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: ClientWithStatus) => {
    setClientToEdit(client);
    setShowClientForm(true);
  };

  const handleDeleteClient = (client: ClientWithStatus) => {
    setClientToDelete(client);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      showToast('success', `Cliente ${clientToDelete.nome} foi excluído.`);
    }
  };

  const handleSaveClient = (clientData: Client | Omit<Client, 'id' | 'position'>) => {
    if ('id' in clientData) {
      updateClient(clientData);
      showToast('success', 'Cliente atualizado com sucesso!');
    } else {
      addClient(clientData);
      showToast('success', 'Cliente adicionado com sucesso!');
    }
  };

  const handleRenewClient = (client: ClientWithStatus) => {
    renewClient(client.id);
    showToast('success', `Assinatura de ${client.nome} renovada por 30 dias!`);
  };

  const handleExport = () => {
    exportToExcel(allClientsWithStatus, 'clientes');
    showToast('success', 'Dados exportados com sucesso!');
  };

  const handleManualBackup = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_clientes_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Backup baixado com sucesso!');
  };

  const handleRestoreFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.clients && Array.isArray(data.clients)) {
          restoreState(data);
          showToast('success', 'Backup restaurado com sucesso!');
        } else {
          showToast('error', 'Arquivo de backup inválido.');
        }
      } catch (error) {
        showToast('error', 'Erro ao ler o arquivo de backup.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDragStart = (client: ClientWithStatus) => {
    setDraggedClient(client);
  };

  const handleDragEnd = () => {
    setDraggedClient(null);
    setDropTargetId(null);
  };

  const handleDrop = (targetClient: ClientWithStatus) => {
    if (!draggedClient || draggedClient.id === targetClient.id) return;

    const reorderedClients = [...clients];
    const draggedIndex = reorderedClients.findIndex(c => c.id === draggedClient.id);
    const targetIndex = reorderedClients.findIndex(c => c.id === targetClient.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      reorderedClients.splice(draggedIndex, 1);
      reorderedClients.splice(targetIndex, 0, draggedClient);
      updateClientOrder(reorderedClients);
    }
  };

  if (!isFirebaseConfigured) {
    return <SetupScreen />;
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen panelTitle={settings.panelTitle} logoUrl={settings.logoUrl} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Erro de Conexão</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{dbError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GP</span>
                </div>
              )}
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{settings.panelTitle}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Exportar dados"
              >
                <ExportIcon />
              </button>
              
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Histórico"
              >
                <HistoryIcon />
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Configurações"
              >
                <SettingsIcon />
              </button>
              
              <ThemeToggle />
              
              <button
                onClick={() => {/* Handle logout */}}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Sair"
              >
                <LogoutIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        <Dashboard stats={dashboardStats} onFilterSelect={setFilter} />
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterOption)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            >
              <option value={FilterOption.Todos}>Todos</option>
              <option value={FilterOption.Ativos}>Ativos</option>
              <option value={FilterOption.Vencidos}>Vencidos</option>
              <option value={FilterOption.ProximoVencimento}>Próximo Vencimento</option>
            </select>
            
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            >
              <option value={SortOption.Custom}>Ordem Personalizada</option>
              <option value={SortOption.Nome}>Nome</option>
              <option value={SortOption.Vencimento}>Vencimento</option>
              <option value={SortOption.Status}>Status</option>
            </select>
            
            <button
              onClick={() => setViewMode(viewMode === ViewMode.Grid ? ViewMode.List : ViewMode.Grid)}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={viewMode === ViewMode.Grid ? 'Visualização em lista' : 'Visualização em grade'}
            >
              {viewMode === ViewMode.Grid ? <ViewListIcon /> : <ViewGridIcon />}
            </button>
            
            <button
              onClick={handleAddClient}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md transition-colors flex items-center gap-2"
            >
              <AddIcon className="w-4 h-4" />
              Novo Cliente
            </button>
          </div>
        </div>

        {/* Client List/Grid */}
        {viewMode === ViewMode.Grid ? (
          <ClientGrid
            clients={clients}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            onRenewRequest={handleRenewClient}
            dropTargetId={dropTargetId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            setDropTargetId={setDropTargetId}
          />
        ) : (
          <ClientTable
            clients={clients}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            onRenewRequest={handleRenewClient}
            setSort={setSort}
            currentSort={sort}
            dropTargetId={dropTargetId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            setDropTargetId={setDropTargetId}
          />
        )}
      </main>

      {/* Modals */}
      <ClientFormModal
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        confirmText="Excluir"
        confirmVariant="danger"
      >
        <p>
          Tem certeza que deseja excluir o cliente <strong>{clientToDelete?.nome}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </ConfirmModal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;