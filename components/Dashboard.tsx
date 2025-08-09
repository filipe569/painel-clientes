
import React, { useState } from 'react';
import { FilterOption } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { UsersIcon, ExclamationTriangleIcon, ClockIcon, CheckCircleIcon } from './icons';

interface DashboardProps {
  stats: {
    total: number;
    active: number;
    expired: number;
    expiringSoon: number;
  };
  onFilterSelect: (filter: FilterOption) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onFilterSelect }) => {
  return (
    <div className="mb-8">
      {/* Client Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <UsersIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total de Clientes</div>
        </Card>
        
        <Card className="text-center p-4 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" onClick={() => onFilterSelect(FilterOption.Ativos)}>
          <div className="flex items-center justify-center mb-2">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Clientes Ativos</div>
        </Card>
        
        <Card className="text-center p-4 cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors" onClick={() => onFilterSelect(FilterOption.ProximoVencimento)}>
          <div className="flex items-center justify-center mb-2">
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.expiringSoon}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Próximo Vencimento</div>
        </Card>
        
        <Card className="text-center p-4 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" onClick={() => onFilterSelect(FilterOption.Vencidos)}>
          <div className="flex items-center justify-center mb-2">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expired}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Clientes Vencidos</div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;