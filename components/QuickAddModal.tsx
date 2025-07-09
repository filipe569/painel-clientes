import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onSubmit, isProcessing }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleClose = () => {
      setText('');
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Adição Rápida com IA">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Cole as informações do cliente no campo abaixo. A IA tentará extrair nome, login, senha, servidor, telefone e data de vencimento.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
          placeholder="Ex: Cliente: João da Silva, login joao.s, senha forte123, Servidor BR-01, vence em 25/12/2024, tel: (11) 98765-4321"
        />
        <div className="flex justify-end gap-4 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isProcessing}>
            Fechar
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit} disabled={isProcessing || !text.trim()}>
            {isProcessing ? 'Processando...' : 'Processar com IA'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QuickAddModal;