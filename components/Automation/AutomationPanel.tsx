import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { AiIcon, ClockIcon, BellIcon, CheckCircleIcon } from '../icons';

interface AutomationRule {
  id: string;
  name: string;
  trigger: 'expiring_soon' | 'expired' | 'new_client';
  action: 'send_email' | 'send_whatsapp' | 'create_task';
  isActive: boolean;
  lastRun?: string;
}

const AutomationPanel: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Lembrete de Vencimento',
      trigger: 'expiring_soon',
      action: 'send_whatsapp',
      isActive: true,
      lastRun: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: 'Cobrança Automática',
      trigger: 'expired',
      action: 'send_email',
      isActive: false
    },
    {
      id: '3',
      name: 'Boas-vindas',
      trigger: 'new_client',
      action: 'send_whatsapp',
      isActive: true,
      lastRun: '2024-01-14 09:15'
    }
  ]);

  const [showNewRule, setShowNewRule] = useState(false);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const getTriggerLabel = (trigger: string) => {
    const labels = {
      expiring_soon: 'Vencimento Próximo',
      expired: 'Vencido',
      new_client: 'Novo Cliente'
    };
    return labels[trigger as keyof typeof labels];
  };

  const getActionLabel = (action: string) => {
    const labels = {
      send_email: 'Enviar E-mail',
      send_whatsapp: 'Enviar WhatsApp',
      create_task: 'Criar Tarefa'
    };
    return labels[action as keyof typeof labels];
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <AiIcon className="w-5 h-5 mr-2 text-brand-500" />
            Automações Inteligentes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure ações automáticas para seus clientes
          </p>
        </div>
        <Button onClick={() => setShowNewRule(!showNewRule)} size="sm">
          Nova Regra
        </Button>
      </div>

      {showNewRule && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Nova Automação</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Nome da regra" />
            <select className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-gray-100">
              <option value="expiring_soon">Vencimento Próximo</option>
              <option value="expired">Vencido</option>
              <option value="new_client">Novo Cliente</option>
            </select>
            <select className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-gray-100">
              <option value="send_whatsapp">Enviar WhatsApp</option>
              <option value="send_email">Enviar E-mail</option>
              <option value="create_task">Criar Tarefa</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <Button variant="secondary" size="sm" onClick={() => setShowNewRule(false)}>
              Cancelar
            </Button>
            <Button size="sm">Salvar</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {rules.map(rule => (
          <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleRule(rule.id)}
                className={`w-10 h-6 rounded-full transition-colors ${
                  rule.isActive ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  rule.isActive ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{rule.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getTriggerLabel(rule.trigger)} → {getActionLabel(rule.action)}
                </p>
              </div>
            </div>
            <div className="text-right">
              {rule.isActive && (
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Ativa
                </div>
              )}
              {rule.lastRun && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {rule.lastRun}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AutomationPanel;