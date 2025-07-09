import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { ClientWithStatus } from '../../types';

interface RevenueChartProps {
  clients: ClientWithStatus[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ clients }) => {
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      // Simular dados de receita baseado no número de clientes ativos
      const activeClients = clients.filter(c => c.status === 'Ativo').length;
      const revenue = activeClients * (50 + Math.random() * 100); // Valor simulado
      
      months.push({
        month: monthName,
        revenue: Math.round(revenue),
        clients: activeClients + Math.floor(Math.random() * 10)
      });
    }
    
    return months;
  }, [clients]);

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Receita Mensal</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Evolução da receita nos últimos 6 meses</p>
      </div>
      
      <div className="space-y-4">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                {data.month}
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-32">
                <div
                  className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                R$ {data.revenue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {data.clients} clientes
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RevenueChart;