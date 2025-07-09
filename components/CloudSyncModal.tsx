import React, { useRef, useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { CloudIcon, ExportIcon, ImportIcon, GoogleDriveIcon, LogoutIcon } from './icons';
import * as drive from '../services/googleDriveService';
import { useToast } from './ui/Toast';
import { GoogleFile } from '../types';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreFromFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRestoreFromDrive: (data: string) => void;
  appState: any;
}

const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onRestoreFromFile,
  onRestoreFromDrive,
  appState,
}) => {
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const [isGapiReady, setIsGapiReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // For saving or restoring
  const [error, setError] = useState<string | null>(null);
  const [backupFiles, setBackupFiles] = useState<GoogleFile[]>([]);

  const handleSignOut = () => {
    drive.signOut();
    setIsSignedIn(false);
    showToast('info', "Você foi desconectado do Google Drive.");
  };

  const fetchBackupFiles = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const files = await drive.listBackupFiles();
      setBackupFiles(files);
      if (files.length === 0) {
        console.log("Nenhum arquivo de backup encontrado no Google Drive.");
      }
    } catch (err: any) {
      console.error("Erro ao buscar arquivos de backup:", err);
       if (err.code === 401 || err.code === 403) {
          setError("Sua sessão do Google expirou. Por favor, faça login novamente.");
          handleSignOut();
          return;
      }
      setError(err.message || "Não foi possível carregar a lista de backups do Drive.");
      setBackupFiles([]);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (isOpen) {
      setIsGapiReady(drive.isGapiLoaded());
      const token = drive.getToken();
      if (token) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isSignedIn && isOpen) {
      fetchBackupFiles();
    } else {
      setBackupFiles([]);
    }
  }, [isSignedIn, isOpen]);

  const updateAuthStatus = (signedIn: boolean) => {
    setIsSignedIn(signedIn);
  };

  const handleInitGapi = () => {
    setIsLoading(true);
    drive.initGapiClient(updateAuthStatus)
      .then(() => setIsGapiReady(true))
      .catch((err: Error) => {
        setError("Não foi possível carregar a API do Google. Tente recarregar a página.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };
  
  const handleSignIn = () => drive.signIn();
  
  const handleSaveToDrive = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const content = JSON.stringify(appState, null, 2);
      await drive.uploadBackup(content);
      showToast('success', "Backup salvo no Google Drive com sucesso!");
      await fetchBackupFiles(); // Refresh the list
    } catch (err: any) {
      if (err.code === 401 || err.code === 403) {
          setError("Sua sessão do Google expirou. Por favor, faça login novamente.");
          handleSignOut();
          return;
      }
      const errorMessage = err.message || "Falha ao salvar o backup no Google Drive.";
      setError(errorMessage);
      showToast('error', errorMessage);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreFromDriveClick = async (fileId: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const content = await drive.getBackupContent(fileId);
      onRestoreFromDrive(content);
      // Modal will be closed by App.tsx on success
    } catch (err: any) {
      console.error("Erro ao restaurar do Drive:", err);
      // Handle auth errors first
      if (err.code === 401 || err.code === 403) {
          setError("Sua sessão do Google expirou. Por favor, faça login novamente.");
          handleSignOut();
          return;
      }

      // Handle not found error
      if (err.code === 404) {
        const friendlyError = "O arquivo de backup não foi encontrado. Pode ter sido excluído. Atualizando a lista...";
        setError(friendlyError);
        showToast('error', "Arquivo não encontrado. Atualizando lista...");
        await fetchBackupFiles(); // Refresh the file list to remove the stale entry
        return;
      }
      
      // Handle other errors
      const errorMessage = err.message || "Falha ao carregar o backup do Google Drive.";
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreFromFileClick = () => {
    restoreInputRef.current?.click();
  };

  const parseBackupDate = (fileName: string): string => {
    // Filename format is client_manager_backup_YYYY-MM-DDTHH_mm_ss.json
    const match = fileName.match(/(\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2})/);
    if (!match) return "Data desconhecida";

    // Convert filename part to a valid ISO 8601 UTC string
    const isoTimestamp = match[1].replace(/_/g, ':') + 'Z';
    const date = new Date(isoTimestamp);

    if (isNaN(date.getTime())) {
        return "Data inválida";
    }

    // toLocaleString automatically converts the UTC date to the user's local timezone for display.
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sincronização com a Nuvem">
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
            
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <GoogleDriveIcon className="w-6 h-6" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Google Drive</h3>
              </div>
              
              {!isGapiReady && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Clique para iniciar a integração com o Google Drive.</p>
                  <Button onClick={handleInitGapi} disabled={isLoading}>
                    {isLoading ? 'Carregando API...' : 'Conectar ao Google'}
                  </Button>
                </div>
              )}

              {isGapiReady && !isSignedIn && (
                <div className="text-center">
                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Faça login para salvar e carregar backups do seu Google Drive.</p>
                  <Button onClick={handleSignIn}>Fazer login com o Google</Button>
                </div>
              )}
              
              {isGapiReady && isSignedIn && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-600 dark:text-green-400">Conectado ao Google Drive.</p>
                    <Button onClick={handleSignOut} variant="ghost" size="sm">
                       <LogoutIcon className="w-4 h-4 mr-1" /> Sair
                    </Button>
                  </div>
                  <Button onClick={handleSaveToDrive} disabled={isProcessing || isLoading} className="w-full">
                    <CloudIcon className="w-5 h-5 mr-2" />
                    {isProcessing ? 'Salvando...' : 'Salvar Novo Backup no Drive'}
                  </Button>
                  
                  <div className="space-y-2 pt-2">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">Backups disponíveis (até 3 dias)</h4>
                    {isLoading ? <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">Buscando backups...</p> : 
                     backupFiles.length > 0 ? (
                       <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {backupFiles.map((file, index) => (
                          <li key={file.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                            <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">Backup de {parseBackupDate(file.name)}</p>
                                {index === 0 && <span className="text-xs text-brand-500 dark:text-brand-400 font-bold">Mais Recente</span>}
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => handleRestoreFromDriveClick(file.id)} disabled={isProcessing}>
                                <ImportIcon className="w-4 h-4 mr-1"/> Restaurar
                            </Button>
                          </li>
                        ))}
                       </ul>
                     ) : (
                       <p className="text-center text-sm text-gray-500 dark:text-gray-500 py-4">Nenhum backup encontrado no Drive.</p>
                     )
                    }
                  </div>
                </div>
              )}
               {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Restaurar de Arquivo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Se você tem um arquivo de backup local, pode carregá-lo aqui. Isso substituirá os dados do usuário atual.</p>
                <div className="grid grid-cols-1">
                    <Button onClick={handleRestoreFromFileClick} variant="secondary">
                       <ImportIcon className="w-5 h-5 mr-2" /> Carregar Arquivo de Backup
                    </Button>
                </div>
                <input type="file" ref={restoreInputRef} onChange={onRestoreFromFile} accept=".json" className="hidden" />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                <Button variant="ghost" onClick={onClose}>Fechar</Button>
            </div>
        </div>
    </Modal>
  );
};

export default CloudSyncModal;