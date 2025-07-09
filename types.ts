export enum ClientStatus {
  Ativo = 'Ativo',
  Vencido = 'Vencido',
  ProximoVencimento = 'Próximo Vencimento',
}

export interface Client {
  id: string;
  nome: string;
  login: string;
  senha?: string;
  servidor: string;
  vencimento: string; // YYYY-MM-DD
  telefone?: string;
  notes?: string;
  position: number; // For drag and drop ordering
}

export type ClientWithStatus = Client & {
  status: ClientStatus;
  diasRestantes: number | null;
};

export enum FilterOption {
  Todos = 'Todos',
  Ativos = 'Ativos',
  Vencidos = 'Vencidos',
  ProximoVencimento = 'Próximo Vencimento',
}

export enum SortOption {
  Custom = 'custom',
  Nome = 'nome',
  Vencimento = 'vencimento',
  Status = 'status',
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  clientName: string;
  action: 'Criado' | 'Atualizado' | 'Excluído' | 'Renovado' | 'Sistema' | 'Anotado';
  details: string;
}

export interface AppSettings {
    panelTitle: string;
    logoUrl: string;
}

export interface GoogleFile {
  id: string;
  name: string;
  modifiedTime: string;
}

export interface AuthUser {
    uid: string;
    email: string | null;
}