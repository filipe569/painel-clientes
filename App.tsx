
import React, { useState, useEffect } from 'react';
import { useClientManager } from './hooks/useClientManager';
import { Client, ClientWithStatus, FilterOption, SortOption, AppSettings, HistoryEntry, AuthUser } from './types';
import ClientTable from './components/ClientTable';
import ClientGrid from './components/ClientGrid';
import ClientFormModal from './components/ClientFormModal';
import Dashboard from './components/Dashboard';
import AnalyticsCard from './components/Analytics/AnalyticsCard';
import RevenueChart from './components/Analytics/RevenueChart';
import AutomationPanel from './components/Automation/AutomationPanel';
import NotificationCenter from './components/Notifications/NotificationCenter';
import QuickActionsPanel from './components/QuickActions/QuickActionsPanel';
import BulkMessageModal from './components/BulkActions/BulkMessageModal';
import LoginScreen from './components/LoginScreen';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import CloudSyncModal from './components/CloudSyncModal';
import ConfirmModal from './components/ui/ConfirmModal';
import { ToastProvider, useToast } from './components/ui/Toast';
import { exportToExcel } from './services/exportService';
import { onAuthChanged, logOut, getDataForUser, isFirebaseConfigured } from './services/firebaseService';
import SetupScreen from './components/SetupScreen';
import { parseClientDataWithAI } from './services/geminiService';
import QuickAddModal from './components/QuickAddModal';
import { ThemeProvider } from './hooks/useTheme';
import ThemeToggle from './components/ThemeToggle';

import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UsersIcon, 
  TrendingUpIcon,
  ClockIcon 
} from './components/icons';

import Button from './components/ui/Button';
import Input from './components/ui/Input';
import { AddIcon, SearchIcon, ExportIcon, LogoutIcon, AiIcon, SettingsIcon, HistoryIcon, CloudIcon, ErrorIcon, ViewGridIcon, ViewListIcon } from './components/icons';

const APP_SETTINGS_KEY_PREFIX = 'app_manager_settings_';
const DEFAULT_PANEL_TITLE = 'Gerenciador de Clientes Pro';

type ViewMode = 'table' | 'grid';

const AppContent: React.FC<{ user: AuthUser }> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [isCloudSyncModalOpen, setCloudSyncModalOpen] = useState(false);
  const [isQuickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [isBulkMessageModalOpen, setBulkMessageModalOpen] = useState(false);
  const [isParsingClient, setIsParsingClient] = useState(false);

  const [clientToEdit, setClientToEdit] = useState<Partial<ClientWithStatus> | null>(null);

  const [clientToDelete, setClientToDelete] = useState<ClientWithStatus | null>(null);
  const [clientToRenew, setClientToRenew] = useState<ClientWithStatus | null>(null);
  
  const { showToast } = useToast();
  const {
    clients,
    addClient,
    updateClient,
    updateClientOrder,
    deleteClient,
    renewClient,
    setSearchTerm,
    setFilter,
    filter,
    setSort,
    sort,
    dashboardStats,
    allClientsWithStatus,
    appState,
    history,
    restoreState,
    isLoading,
    dbError,
  } = useClientManager(user);
  
  const SETTINGS_KEY = `${APP_SETTINGS_KEY_PREFIX}${user.uid}`;
  
  const [settings, setSettings] = useState<AppSettings>(() => {
      try {
          const storedSettings = localStorage.getItem(SETTINGS_KEY);
          if (storedSettings) {
              const parsed = JSON.parse(storedSettings);
              return {
                  panelTitle: parsed.panelTitle || DEFAULT_PANEL_TITLE,
                  logoUrl: parsed.logoUrl || '',
              };
          }
      } catch { /* Use default */ }
      return { panelTitle: DEFAULT_PANEL_TITLE, logoUrl: '' };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12); // Grid fits more
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState<ClientWithStatus | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);


  const totalPages = Math.ceil(clients.length / rowsPerPage);

  // This effect prevents staying on a page that no longer exists after filtering or changing page size.
  useEffect(() => {
      const newTotalPages = Math.ceil(clients.length / rowsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages); // Go to the last available page
      } else if (clients.length > 0 && currentPage === 0) {
          setCurrentPage(1); // Go to the first page if list is populated
      }
  }, [clients.length, rowsPerPage, currentPage]);


  const paginatedClients = clients.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, SETTINGS_KEY]);

  const handleOpenModal = (client: Partial<ClientWithStatus> | null = null) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClientToEdit(null);
  };

  const handleSaveClient = (clientData: Client | Omit<Client, 'id' | 'position'>) => {
    if ('id' in clientData && clientData.id) {
      updateClient(clientData as Client);
      showToast('success', 'Cliente atualizado com sucesso!');
    } else {
      addClient(clientData);
      showToast('success', 'Cliente adicionado com sucesso!');
    }
  };

  const handleDeleteRequest = (client: ClientWithStatus) => {
    setClientToDelete(client);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      showToast('info', `Cliente ${clientToDelete.nome} foi excluído.`);
      setClientToDelete(null);
    }
  };
  
  const handleRenewRequest = (client: ClientWithStatus) => {
    setClientToRenew(client);
  };

  const handleConfirmRenew = () => {
    if (clientToRenew) {
      renewClient(clientToRenew.id);
      showToast('success', `Assinatura de ${clientToRenew.nome} foi renovada.`);
      setClientToRenew(null);
    }
  };

  const handleLogout = () => {
      logOut().catch(error => {
          showToast('error', `Erro ao sair: ${error.message}`);
      });
  }

  const handleExport = () => {
    exportToExcel(allClientsWithStatus);
    showToast('success', 'A lista de clientes foi exportada para Excel.');
  };

  const handleManualBackup = async () => {
      try {
        const dataToBackup = await getDataForUser(user.uid);
        const dataStr = JSON.stringify(dataToBackup, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `backup_clientes_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showToast('success', 'Backup gerado com sucesso.');
      } catch (error: any) {
        showToast('error', `Falha ao gerar backup: ${error.message}`);
      }
  };

  const handleRestoreData = (dataString: string) => {
    if (!dataString) {
        showToast('error', 'Nenhum dado recebido para restauração.');
        return;
    }
    try {
        const data = JSON.parse(dataString);
        if (data.clients !== undefined && Array.isArray(Object.values(data.clients)) && data.history !== undefined && Array.isArray(Object.values(data.history))) {
             const restoredState = {
                clients: Object.values(data.clients) as Client[],
                history: Object.values(data.history) as HistoryEntry[],
             }
             restoreState(restoredState);
             showToast('success', 'Backup restaurado com sucesso!');
             setSettingsModalOpen(false);
             setCloudSyncModalOpen(false);
        } else {
           showToast('error', "Arquivo de backup inválido ou corrompido.");
        }
    } catch (error) {
        showToast('error', "Erro ao processar o arquivo de backup.");
        console.error(error);
    }
  };

  const handleRestoreFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === "application/json") {
          const reader = new FileReader();
          reader.onload = (e) => {
              handleRestoreData(e.target?.result as string);
          };
          reader.readAsText(file);
      } else if (file) {
          showToast('error', "Por favor, selecione um arquivo JSON válido.");
      }
      if(event.target) event.target.value = '';
  };
  
  const handleQuickAddSubmit = async (text: string) => {
      setIsParsingClient(true);
      setQuickAddModalOpen(false);
      try {
          const parsedData = await parseClientDataWithAI(text);
          showToast('success', 'Dados extraídos! Revise e salve.');
          handleOpenModal(parsedData);
      } catch (error: any) {
          showToast('error', error.message || 'Falha ao processar dados com IA.');
      } finally {
          setIsParsingClient(false);
      }
  };

  const handleBulkMessage = () => {
    setBulkMessageModalOpen(true);
  };

  // Drag and Drop Handlers
  const handleDragStart = (client: ClientWithStatus) => {
    setDraggedItem(client);
    setSort(SortOption.Custom); // Switch to custom sort on drag
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTargetId(null);
  };

  const handleDrop = (targetClient: ClientWithStatus) => {
    if (!draggedItem || draggedItem.id === targetClient.id) {
        setDropTargetId(null);
        return;
    };

    const currentClients = [...clients];
    const draggedIndex = currentClients.findIndex(c => c.id === draggedItem.id);
    const targetIndex = currentClients.findIndex(c => c.id === targetClient.id);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = currentClients.splice(draggedIndex, 1);
    currentClients.splice(targetIndex, 0, removed);
    
    updateClientOrder(currentClients);
    
    setDropTargetId(null);
  };


  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400"></div>
                <p className="text-lg">Carregando dados do usuário...</p>
            </div>
        </div>
    );
  }

  if (dbError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="text-center max-w-2xl bg-white dark:bg-gray-800/50 border border-red-200 dark:border-red-500/30 rounded-xl p-8 shadow-2xl">
                <ErrorIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Erro de Banco de Dados</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{dbError}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Isso geralmente acontece se a URL no arquivo <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">services/firebaseService.ts</code> estiver incorreta ou se as <strong className="text-yellow-500 dark:text-yellow-300">regras de segurança</strong> do Realtime Database não estiverem configuradas corretamente.
                </p>
                <Button onClick={handleLogout} size="lg" variant="secondary" className="mt-8">
                    Sair e Tentar Novamente
                </Button>
            </div>
        </div>
      );
  }

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
               {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-9 h-9 rounded-full object-cover"/>
              ) : (
                  <AiIcon className="w-8 h-8 text-brand-400"/>
              )}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{settings.panelTitle}</h1>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline mr-2">{user.email}</span>
                <ThemeToggle />
                <Button onClick={() => setCloudSyncModalOpen(true)} variant="ghost" title="Sincronização com a Nuvem">
                    <CloudIcon className="w-5 h-5"/>
                    <span className="hidden md:inline ml-2">Nuvem</span>
                </Button>
                <Button onClick={() => setHistoryModalOpen(true)} variant="ghost" title="Histórico de Alterações">
                    <HistoryIcon className="w-5 h-5"/>
                    <span className="hidden md:inline ml-2">Histórico</span>
                </Button>
                <Button onClick={() => setSettingsModalOpen(true)} variant="ghost" title="Configurações">
                    <SettingsIcon className="w-5 h-5"/>
                    <span className="hidden md:inline ml-2">Configurações</span>
                </Button>
                <Button onClick={handleLogout} variant="secondary">
                  <LogoutIcon className="w-5 h-5 md:mr-2" />
                  <span className="hidden md:inline">Sair</span>
                </Button>
            </div>
          </header>

          <Dashboard stats={dashboardStats} onFilterSelect={setFilter} />
          
          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnalyticsCard
              title="Receita Mensal"
              value={`R$ ${(dashboardStats.active * 89.90).toLocaleString()}`}
              change={{ value: 12.5, type: 'increase', period: 'mês anterior' }}
              icon={<CurrencyDollarIcon />}
              color="green"
            />
            <AnalyticsCard
              title="Taxa de Renovação"
              value="87.3%"
              change={{ value: 3.2, type: 'increase', period: 'mês anterior' }}
              icon={<TrendingUpIcon />}
              color="blue"
            />
            <AnalyticsCard
              title="Novos Clientes"
              value="23"
              change={{ value: 8.1, type: 'increase', period: 'mês anterior' }}
              icon={<UsersIcon />}
              color="purple"
            />
            <AnalyticsCard
              title="Tempo Médio"
              value="4.2 meses"
              icon={<ClockIcon />}
              color="yellow"
            />
          </div>

          {/* Modern Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <RevenueChart clients={allClientsWithStatus} />
              <AutomationPanel />
            </div>
            <div className="space-y-6">
              <QuickActionsPanel
                onAddClient={() => handleOpenModal()}
                onExport={handleExport}
                onQuickAdd={() => setQuickAddModalOpen(true)}
                onBulkMessage={handleBulkMessage}
                onBackup={() => setCloudSyncModalOpen(true)}
                onSettings={() => setSettingsModalOpen(true)}
              />
              <NotificationCenter />
            </div>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                  <div className="lg:col-span-4">
                      <Input
                          id="search"
                          placeholder="Buscar por nome, login ou telefone..."
                          icon={<SearchIcon className="w-5 h-5"/>}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <div className="lg:col-span-2">
                      <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filtrar Status</label>
                      <select
                          id="filter-status"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value as FilterOption)}
                          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                      >
                          {Object.values(FilterOption).map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                          ))}
                      </select>
                  </div>
                  <div className="lg:col-span-6 flex gap-2 justify-start md:justify-end items-center">
                      <div className="isolate inline-flex rounded-md shadow-sm">
                          <Button onClick={() => setViewMode('grid')} variant="secondary" className={`!rounded-r-none !scale-100 ${viewMode === 'grid' ? '!bg-brand-600 !text-white' : ''}`} title="Visualização em Grade">
                              <ViewGridIcon />
                          </Button>
                          <Button onClick={() => setViewMode('table')} variant="secondary" className={`!rounded-l-none !scale-100 ${viewMode === 'table' ? '!bg-brand-600 !text-white' : ''}`} title="Visualização em Tabela">
                              <ViewListIcon />
                          </Button>
                      </div>
                      <Button onClick={handleExport} variant="secondary">
                          <ExportIcon className="mr-2" />
                          Exportar
                      </Button>
                      <Button onClick={() => setQuickAddModalOpen(true)} variant="secondary" disabled={isParsingClient}>
                          <AiIcon className="mr-2" />
                          Adição Rápida
                      </Button>
                      <Button onClick={() => handleOpenModal()} variant="primary">
                          <AddIcon className="mr-2"/>
                          Adicionar
                      </Button>
                  </div>
              </div>
          </div>
          
          {viewMode === 'table' ? (
              <ClientTable
                clients={paginatedClients}
                onEdit={handleOpenModal}
                onDelete={handleDeleteRequest}
                onRenewRequest={handleRenewRequest}
                setSort={setSort}
                currentSort={sort}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                dropTargetId={dropTargetId}
                setDropTargetId={setDropTargetId}
              />
          ) : (
              <ClientGrid
                clients={paginatedClients}
                onEdit={handleOpenModal}
                onDelete={handleDeleteRequest}
                onRenewRequest={handleRenewRequest}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                dropTargetId={dropTargetId}
                setDropTargetId={setDropTargetId}
              />
          )}
          
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 text-sm text-gray-600 dark:text-gray-400 gap-4">
              <div className="flex items-center gap-2">
                  <label htmlFor="rows-per-page-select" className="sr-only">Itens por página</label>
                  <select
                      id="rows-per-page-select"
                      value={rowsPerPage}
                      onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                      className="bg-gray-200 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
                      aria-label="Itens por página"
                  >
                      <option value={8}>8 por página</option>
                      <option value={12}>12 por página</option>
                      <option value={24}>24 por página</option>
                      <option value={48}>48 por página</option>
                  </select>
                  <span className="hidden lg:block text-gray-500 dark:text-gray-500">
                     {clients.length > 0
                      ? `| Exibindo de ${((currentPage - 1) * rowsPerPage) + 1} a ${Math.min(currentPage * rowsPerPage, clients.length)} de ${clients.length} clientes.`
                      : 'Nenhum cliente para exibir.'
                     }
                  </span>
              </div>

              {totalPages > 1 && (
                  <div className="flex items-center gap-4">
                      <span className="whitespace-nowrap">
                          Página {currentPage} de {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                          <Button 
                              onClick={() => setCurrentPage(p => p - 1)} 
                              disabled={currentPage <= 1}
                              variant="secondary"
                              size="sm"
                              aria-label="Página anterior"
                          >
                              Anterior
                          </Button>
                          <Button
                              onClick={() => setCurrentPage(p => p + 1)}
                              disabled={currentPage >= totalPages}
                              variant="secondary"
                              size="sm"
                              aria-label="Próxima página"
                          >
                              Próxima
                          </Button>
                      </div>
                  </div>
              )}
          </div>
        </div>
      </div>

      <ClientFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveClient} 
        clientToEdit={clientToEdit}
      />
      
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onManualBackup={handleManualBackup}
        onRestoreBackup={handleRestoreFromFile}
      />

      <HistoryModal isOpen={isHistoryModalOpen} onClose={() => setHistoryModalOpen(false)} history={history} />

      <CloudSyncModal 
        isOpen={isCloudSyncModalOpen} 
        onClose={() => setCloudSyncModalOpen(false)}
        appState={appState}
        onRestoreFromFile={handleRestoreFromFile}
        onRestoreFromDrive={handleRestoreData}
      />
      
      <QuickAddModal
        isOpen={isQuickAddModalOpen}
        onClose={() => setQuickAddModalOpen(false)}
        onSubmit={handleQuickAddSubmit}
        isProcessing={isParsingClient}
      />
      
      <ConfirmModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Excluir Cliente ${clientToDelete?.nome}?`}
        confirmText="Sim, Excluir"
        confirmVariant="danger"
      >
        <p>Você tem certeza que deseja excluir <strong>{clientToDelete?.nome}</strong>? Esta ação não pode ser desfeita.</p>
      </ConfirmModal>

       <ConfirmModal
        isOpen={!!clientToRenew}
        onClose={() => setClientToRenew(null)}
        onConfirm={handleConfirmRenew}
        title={`Renovar Cliente ${clientToRenew?.nome}?`}
        confirmText="Sim, Renovar"
      >
        <p>Você tem certeza que deseja renovar a assinatura de <strong>{clientToRenew?.nome}</strong> por 30 dias?</p>
      </ConfirmModal>

      <BulkMessageModal
        isOpen={isBulkMessageModalOpen}
        onClose={() => setBulkMessageModalOpen(false)}
        clients={allClientsWithStatus}
      />
    </>
  );
};


function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (needsSetup) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [needsSetup]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-400"></div>
      </div>
    );
  }
  
  if (needsSetup) {
      return <SetupScreen />;
  }
  
  const defaultSettings = { panelTitle: DEFAULT_PANEL_TITLE, logoUrl: '' };

  if (!user) {
    return <LoginScreen panelTitle={defaultSettings.panelTitle} logoUrl={defaultSettings.logoUrl} />;
  }
  
  return <AppContent user={user} />;
}


const AppWrapper: React.FC = () => (
  <ThemeProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>
);

export default AppWrapper;
