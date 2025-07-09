import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Client } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { AiIcon, PhoneIcon, ClipboardDocumentListIcon } from './icons';
import { generateStrongPassword } from '../services/geminiService';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client | Omit<Client, 'id' | 'position'>) => void;
  clientToEdit: Partial<Client> | null;
}

type FormData = Omit<Client, 'id' | 'position'>;

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSave, clientToEdit }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (clientToEdit && Object.keys(clientToEdit).length > 0) {
            const defaultValues = {
                nome: '',
                login: '',
                senha: '',
                telefone: '',
                servidor: '',
                vencimento: '',
                notes: '',
                ...clientToEdit
            };
            if (!defaultValues.vencimento) {
                 defaultValues.vencimento = new Date().toISOString().split('T')[0];
            }
            reset(defaultValues);
        } else {
            reset({
                nome: '',
                login: '',
                senha: '',
                telefone: '',
                servidor: '',
                vencimento: new Date().toISOString().split('T')[0],
                notes: '',
            });
        }
    }
  }, [clientToEdit, isOpen, reset]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (clientToEdit && clientToEdit.id) {
      // Preserve position on edit
      onSave({ ...clientToEdit, ...data, position: clientToEdit.position ?? Date.now() } as Client);
    } else {
      onSave(data);
    }
    onClose();
  };
  
  const handleGeneratePassword = async () => {
      setIsGeneratingPassword(true);
      const password = await generateStrongPassword();
      setValue('senha', password, { shouldValidate: true });
      setIsGeneratingPassword(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={clientToEdit && clientToEdit.id ? 'Editar Cliente' : 'Adicionar Novo Cliente'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
        <Input
          label="Nome Completo"
          id="nome"
          {...register('nome', { required: 'O nome é obrigatório' })}
          placeholder="Ex: João da Silva"
          autoComplete="off"
        />
        {errors.nome && <p className="text-red-500 dark:text-red-400 text-sm">{errors.nome.message}</p>}

        <Input
          label="Login"
          id="login"
          {...register('login', { required: 'O login é obrigatório' })}
          placeholder="Ex: joao.silva"
          autoComplete="off"
        />
        {errors.login && <p className="text-red-500 dark:text-red-400 text-sm">{errors.login.message}</p>}

        <div>
            <div className="flex justify-between items-center mb-1">
                 <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                 <Button type="button" variant="ghost" size="sm" onClick={handleGeneratePassword} disabled={isGeneratingPassword}>
                    <AiIcon className="mr-1 w-4 h-4" />
                    {isGeneratingPassword ? 'Gerando...' : 'Gerar Senha'}
                 </Button>
            </div>
            <Input
              id="senha"
              type="text"
              {...register('senha')}
              placeholder="Deixe em branco para não alterar ou gere uma"
              autoComplete="new-password"
            />
        </div>
        
        <Input
          label="Servidor"
          id="servidor"
          {...register('servidor', { required: 'O servidor é obrigatório' })}
          placeholder="Ex: Servidor BR-01"
          autoComplete="off"
        />
        {errors.servidor && <p className="text-red-500 dark:text-red-400 text-sm">{errors.servidor.message}</p>}

        <Input
          label="Telefone (Opcional)"
          id="telefone"
          icon={<PhoneIcon className="w-5 h-5"/>}
          {...register('telefone')}
          placeholder="Ex: (11) 99999-8888"
          autoComplete="off"
        />

        <Input
          label="Data de Vencimento"
          id="vencimento"
          type="date"
          {...register('vencimento', { required: 'A data de vencimento é obrigatória' })}
        />
        {errors.vencimento && <p className="text-red-500 dark:text-red-400 text-sm">{errors.vencimento.message}</p>}

        <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anotações (Opcional)</label>
            <div className="relative">
                 <ClipboardDocumentListIcon className="w-5 h-5 absolute top-3 left-3 text-gray-400 pointer-events-none" />
                 <textarea
                  id="notes"
                  {...register('notes')}
                  rows={3}
                  placeholder="Informações adicionais sobre o cliente..."
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-10 pr-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                />
            </div>
        </div>


        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 py-4 -mx-6 px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientFormModal;