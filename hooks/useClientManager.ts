import { useState, useMemo, useCallback, useEffect } from 'react';
import { Client, ClientWithStatus, ClientStatus, FilterOption, SortOption, HistoryEntry, AuthUser } from '../types';
import { listenToData, writeData } from '../services/firebaseService';

const EXPIRATION_THRESHOLD_DAYS = 7;

const generateSafeId = (): string => {
  // Firebase keys can't contain '.', '#', '$', '/', '[', or ']'.
  // This creates a key that is a combination of timestamp and a random string, which is safe.
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const createHistoryEntry = (action: HistoryEntry['action'], clientName: string, details: string): HistoryEntry => {
    return {
        id: generateSafeId(),
        timestamp: new Date().toISOString(),
        clientName,
        action,
        details,
    };
};

export const useClientManager = (user: AuthUser | null) => {
  const [appState, setAppState] = useState<{ clients: Client[], history: HistoryEntry[] }>({ clients: [], history: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterOption>(FilterOption.Todos);
  const [sort, setSort] = useState<SortOption>(SortOption.Custom);
  
  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        setAppState({ clients: [], history: [] }); // Clear data on logout
        return;
    }

    setIsLoading(true);
    const unsubscribe = listenToData(
      user.uid,
      (data) => {
        setAppState(data);
        setIsLoading(false);
        setDbError(null);
      },
      (error) => {
        console.error("Firebase read failed:", error);
        setDbError(`Não foi possível conectar ao banco de dados. Verifique a URL e as regras de segurança do Firebase. (Erro: ${error.message})`);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const clientsWithStatus = useMemo<ClientWithStatus[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appState.clients.map(client => {
      const vencimentoDate = new Date(client.vencimento + 'T00:00:00-03:00');
      vencimentoDate.setHours(0,0,0,0);
      
      const diffTime = vencimentoDate.getTime() - today.getTime();
      const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status: ClientStatus;
      if (diasRestantes < 0) {
        status = ClientStatus.Vencido;
      } else if (diasRestantes <= EXPIRATION_THRESHOLD_DAYS) {
        status = ClientStatus.ProximoVencimento;
      } else {
        status = ClientStatus.Ativo;
      }
      
      return { ...client, status, diasRestantes: diasRestantes < 0 ? null : diasRestantes };
    });
  }, [appState.clients]);

  const filteredAndSortedClients = useMemo(() => {
    let processedClients = clientsWithStatus;

    if (filter !== FilterOption.Todos) {
      processedClients = processedClients.filter(c => {
        if (filter === FilterOption.Ativos) return c.status === ClientStatus.Ativo;
        if (filter === FilterOption.Vencidos) return c.status === ClientStatus.Vencido;
        if (filter === FilterOption.ProximoVencimento) return c.status === ClientStatus.ProximoVencimento;
        return true;
      });
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const numericTerm = lowercasedTerm.replace(/\D/g, '');
      
      processedClients = processedClients.filter(c => 
        c.nome.toLowerCase().includes(lowercasedTerm) || 
        c.login.toLowerCase().includes(lowercasedTerm) ||
        (c.telefone && c.telefone.replace(/\D/g, '').includes(numericTerm)) ||
        (c.notes && c.notes.toLowerCase().includes(lowercasedTerm))
      );
    }

    processedClients.sort((a, b) => {
      if (sort === SortOption.Custom) return (a.position || 0) - (b.position || 0);
      if (sort === SortOption.Nome) return a.nome.localeCompare(b.nome);
      if (sort === SortOption.Vencimento) return new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime();
      if (sort === SortOption.Status) {
         const statusOrder = { [ClientStatus.ProximoVencimento]: 1, [ClientStatus.Vencido]: 2, [ClientStatus.Ativo]: 3 };
         return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });

    return processedClients;
  }, [clientsWithStatus, filter, searchTerm, sort]);

  const addClient = useCallback((client: Omit<Client, 'id' | 'position'>) => {
    if(!user) return;
    const newClient = { ...client, id: generateSafeId(), position: Date.now() };
    const newEntry = createHistoryEntry('Criado', newClient.nome, `Cliente ${newClient.nome} foi adicionado.`);
    const newState = {
        clients: [...appState.clients, newClient],
        history: [newEntry, ...appState.history],
    };
    writeData(user.uid, newState);
  }, [appState, user]);

  const updateClient = useCallback((updatedClient: Client) => {
    if(!user) return;
    
    const originalClient = appState.clients.find(c => c.id === updatedClient.id);
    if (!originalClient) return;

    const entries: HistoryEntry[] = [];
    const changedFields: string[] = [];

    // Compare fields except for notes, id, and position
    const coreFields: (keyof Omit<Client, 'id'|'notes'|'position'>)[] = ['nome', 'login', 'senha', 'servidor', 'vencimento', 'telefone'];
    coreFields.forEach(key => {
        if (originalClient[key] !== updatedClient[key]) {
            changedFields.push(key);
        }
    });

    if (changedFields.length > 0) {
        entries.push(createHistoryEntry('Atualizado', updatedClient.nome, `Dados de ${updatedClient.nome} foram alterados.`));
    }
    
    // Specifically check for changes in notes
    if (originalClient.notes !== updatedClient.notes) {
        const details = updatedClient.notes 
          ? `Anotação adicionada/modificada: "${updatedClient.notes.substring(0, 50)}..."` 
          : 'Anotação removida.';
        entries.push(createHistoryEntry('Anotado', updatedClient.nome, details));
    }

    const newState = {
        history: [...entries, ...appState.history],
        clients: appState.clients.map(c => (c.id === updatedClient.id ? updatedClient : c)),
    };
    writeData(user.uid, newState);
  }, [appState, user]);
  
  const updateClientOrder = useCallback((orderedClients: ClientWithStatus[]) => {
    if (!user) return;

    const newOrderMap = new Map(orderedClients.map((c, index) => [c.id, index]));

    const updatedClients = appState.clients.map(client => ({
        ...client,
        position: newOrderMap.get(client.id) ?? client.position,
    }));
    
    const newState = {
        ...appState,
        clients: updatedClients,
    };
    writeData(user.uid, newState);
  }, [appState, user]);


  const deleteClient = useCallback((id: string) => {
    if(!user) return;
    const clientToDelete = appState.clients.find(c => c.id === id);
    if (!clientToDelete) return;

    const newEntry = createHistoryEntry('Excluído', clientToDelete.nome, `Cliente ${clientToDelete.nome} foi removido.`);
    const newState = {
        history: [newEntry, ...appState.history],
        clients: appState.clients.filter(c => c.id !== id),
    };
    writeData(user.uid, newState);
  }, [appState, user]);

  const renewClient = useCallback((id: string, days: number = 30) => {
    if(!user) return;
    let clientToRenew: Client | undefined;
    const updatedClients = appState.clients.map(c => {
      if (c.id === id) {
        clientToRenew = c;
        const today = new Date();
        const currentVencimento = new Date(c.vencimento + 'T00:00:00');
        const startDate = currentVencimento > today ? currentVencimento : today;
        
        startDate.setDate(startDate.getDate() + days);
        const newVencimento = startDate.toISOString().split('T')[0];
        return { ...c, vencimento: newVencimento };
      }
      return c;
    });

    if (clientToRenew) {
      const renewedClient = updatedClients.find(c => c.id === id)!;
      const newEntry = createHistoryEntry('Renovado', clientToRenew.nome, `Assinatura renovada por ${days} dias. Novo vencimento: ${new Date(renewedClient.vencimento+'T00:00:00').toLocaleDateString('pt-BR')}.`);
      const newState = {
        history: [newEntry, ...appState.history],
        clients: updatedClients,
      };
      writeData(user.uid, newState);
    }
  }, [appState, user]);

  const restoreState = useCallback((data: { clients: Client[], history: HistoryEntry[] }) => {
    if(!user) return;
    const newEntry = createHistoryEntry('Sistema', 'Sistema', 'Backup restaurado com sucesso.');

    // Ensure all clients have a position value for compatibility with old backups
    const clientsWithPosition = data.clients.map((client, index) => ({
      ...client,
      position: client.position ?? Date.now() + index,
    }));

    const newState = {
        clients: clientsWithPosition,
        history: [newEntry, ...data.history],
    };
    writeData(user.uid, newState);
  }, [user]);
  
  const dashboardStats = useMemo(() => {
    return {
        total: appState.clients.length,
        active: clientsWithStatus.filter(c => c.status === ClientStatus.Ativo).length,
        expired: clientsWithStatus.filter(c => c.status === ClientStatus.Vencido).length,
        expiringSoon: clientsWithStatus.filter(c => c.status === ClientStatus.ProximoVencimento).length,
    }
  }, [appState.clients.length, clientsWithStatus]);

  return {
    clients: filteredAndSortedClients,
    allClientsWithStatus: clientsWithStatus,
    history: appState.history,
    appState,
    addClient,
    updateClient,
    updateClientOrder,
    deleteClient,
    renewClient,
    restoreState,
    setSearchTerm,
    setFilter,
    filter,
    setSort,
    sort,
    dashboardStats,
    isLoading,
    dbError,
  };
};