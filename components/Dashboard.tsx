
import React, { useState } from 'react';
import { FilterOption } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { AiIcon } from './icons';
import { generateDashboardSummary } from '../services/geminiService';

interface DashboardProps {
  stats: {
    total: number;
    active: number;
    expired: number;
    expiringSoon: number;
  };
  onFilterSelect: (filter: FilterOption) => void;
}

const StatCard: React.FC<{ title: string; value: number; colorClass: string; onClick?: () => void }> = ({ title, value, colorClass, onClick }) => (
  <Card 
    onClick={onClick}
    className={`flex flex-col items-center justify-center text-center ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all transform hover:scale-105' : ''}`}
  >
    <span className={`text-4xl font-bold ${colorClass}`}>{value}</span>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{title}</p>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, onFilterSelect }) => {
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    const result = await generateDashboardSummary(stats);
    setSummary(result);
    setIsLoadingSummary(false);
  };

  return (
    <div className="mb-6">
      <Card className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border-brand-200 dark:border-brand-700">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-brand-900 dark:text-brand-100 flex items-center">
            <AiIcon className="w-5 h-5 mr-2 text-brand-500" />
            Insights com IA
          </h3>
          {isLoadingSummary ? (
            <div className="flex items-center mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-500 mr-2"></div>
              <p className="text-brand-600 dark:text-brand-400 italic animate-pulse">Analisando dados...</p>
            </div>
          ) : summary ? (
            <p className="text-brand-700 dark:text-brand-300 mt-2 leading-relaxed">{summary}</p>
          ) : (
             <p className="text-brand-600 dark:text-brand-400 italic mt-2">Obtenha insights inteligentes sobre sua carteira de clientes.</p>
          )}
        </div>
        <Button 
          onClick={handleGenerateSummary} 
          disabled={isLoadingSummary}
          className="bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <AiIcon className="mr-2" />
          {isLoadingSummary ? 'Analisando...' : 'Gerar Insights'}
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;