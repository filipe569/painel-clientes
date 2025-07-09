import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { BellIcon, ExclamationTriangleIcon, InfoIcon, CheckCircleIcon } from '../icons';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Clientes Vencendo',
      message: '5 clientes vencem nos próximos 3 dias',
      timestamp: '2024-01-15 14:30',
      isRead: false,
      actionLabel: 'Ver Clientes',
      onAction: () => console.log('Ver clientes vencendo')
    },
    {
      id: '2',
      type: 'success',
      title: 'Pagamento Recebido',
      message: 'João Silva renovou sua assinatura',
      timestamp: '2024-01-15 12:15',
      isRead: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Backup Automático',
      message: 'Backup realizado com sucesso',
      timestamp: '2024-01-15 09:00',
      isRead: true
    },
    {
      id: '4',
      type: 'error',
      title: 'Falha na Automação',
      message: 'Erro ao enviar WhatsApp para Maria Santos',
      timestamp: '2024-01-14 16:45',
      isRead: false,
      actionLabel: 'Tentar Novamente',
      onAction: () => console.log('Tentar enviar novamente')
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    const icons = {
      warning: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />,
      info: <InfoIcon className="w-5 h-5 text-blue-500" />,
      success: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
      error: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
    };
    return icons[type as keyof typeof icons];
  };

  const getBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50 dark:bg-gray-900/30';
    
    const colors = {
      warning: 'bg-yellow-50 dark:bg-yellow-900/20',
      info: 'bg-blue-50 dark:bg-blue-900/20',
      success: 'bg-green-50 dark:bg-green-900/20',
      error: 'bg-red-50 dark:bg-red-900/20'
    };
    return colors[type as keyof typeof colors];
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 mr-2 text-brand-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Notificações
          </h3>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition-colors ${getBgColor(notification.type, notification.isRead)} ${
              notification.isRead ? 'border-gray-200 dark:border-gray-700' : 'border-current border-opacity-20'
            }`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {notification.title}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.timestamp}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  notification.isRead ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  {notification.actionLabel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={notification.onAction}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      {notification.actionLabel}
                    </Button>
                  )}
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="ml-auto text-gray-500 hover:text-gray-700"
                    >
                      Marcar como lida
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NotificationCenter;