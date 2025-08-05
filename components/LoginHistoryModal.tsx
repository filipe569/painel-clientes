import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { LoginHistoryEntry } from '../types';
import { ClockIcon, UserIcon } from './icons';

interface LoginHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginHistoryModal: React.FC<LoginHistoryModalProps> = ({ isOpen, onClose }) => {
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Simular dados de histórico de login
      const mockHistory: LoginHistoryEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          userEmail: 'admin@exemplo.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Chrome 120.0.0.0'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          userEmail: 'admin@exemplo.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Chrome 120.0.0.0'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          userEmail: 'admin@exemplo.com',
          ipAddress: '192.168.1.101',
          userAgent: 'Firefox 121.0'
        }
      ];
      setLoginHistory(mockHistory);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Histórico de Logins">
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {loginHistory.length > 0 ? (
          <div className="space-y-4">
            {loginHistory.map((entry) => (
              <div key={entry.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0 mt-1">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {entry.userEmail}
                    </p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {new Date(entry.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {entry.ipAddress && (
                      <p>IP: {entry.ipAddress}</p>
                    )}
                    {entry.userAgent && (
                      <p>Navegador: {entry.userAgent}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Nenhum login registrado ainda.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LoginHistoryModal;