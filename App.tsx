import { useClientManager } from './hooks/useClientManager';
import { useTheme, ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './components/ui/Toast';
import { onAuthChanged, isFirebaseConfigured } from './services/firebaseService';
import { AuthUser } from './types';
import SetupScreen from './components/SetupScreen';

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCloudSync, setShowCloudSync] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isProcessingQuickAdd, setIsProcessingQuickAdd] = useState(false);

  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    panelTitle: 'Gerenciador de Clientes Pro',
    logoUrl: '',
    whatsappConnected: false,
    whatsappNumber: ''
  });

            <Button variant="ghost" onClick={() => setShowCloudSync(true)} title="Sincronização com a nuvem">
              <CloudIcon />
            </Button>
            <Button variant="ghost" onClick={() => setShowHistory(true)} title="Histórico de alterações">
              <HistoryIcon />
            </Button>

        onRestoreFromDrive={handleRestoreFromDrive}
        appState={appState}
      />

      <QuickAddModal
        isOpen={showQuickAdd}