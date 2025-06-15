import React, { useState } from 'react';
import { useUser } from '../../Contexts/UserContext';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BecomeRenterModal = ({ isOpen, onClose }) => {
  const [document, setDocument] = useState('');
  const [documentType, setDocumentType] = useState('cpf'); // 'cpf' ou 'cnpj'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { user, login, updateUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setError('Você precisa aceitar os termos para continuar');
      return;
    }
    
    const requiredLength = documentType === 'cpf' ? 11 : 14;
    if (document.length !== requiredLength) {
      setError(`O ${documentType.toUpperCase()} deve conter ${requiredLength} dígitos`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await userService.updateToLocatario(user.id, document);
      
      // Atualiza o token com os novos dados do usuário
      if (response.token) {
        login(response.token);
        updateUser({ role: 'locatario' });
        toast.success('Você agora é um locador!');
        onClose();
        // Recarrega a página para atualizar todos os componentes
        window.location.reload();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao atualizar para locador. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const maxLength = documentType === 'cpf' ? 11 : 14;
    
    if (value.length <= maxLength) {
      setDocument(value);
      setError(''); // Limpa o erro quando o usuário digita
    }
  };

  const formatDocument = (value) => {
    if (!value) return '';
    
    if (documentType === 'cpf') {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white rounded-lg p-12 w-[800px]" role="document">
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-semibold">Virar Locador</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Formulário para tornar-se locador">
          <div className="mb-6">
            <p id="modal-description" className="text-gray-600 text-base">
              Para se tornar um locador e começar a alugar seus espaços, precisamos do seu CPF (pessoa física) ou CNPJ (pessoa jurídica). 
              Este documento será utilizado para garantir a segurança das transações e a verificação da sua identidade.
            </p>
          </div>

          <div className="flex gap-4 mb-4" role="radiogroup" aria-label="Tipo de documento">
            <button
              type="button"
              onClick={() => {
                setDocumentType('cpf');
                setDocument('');
                setError('');
              }}
              className={`flex-1 py-3 px-4 rounded-lg border-2 text-base font-medium transition-colors ${
                documentType === 'cpf'
                  ? 'bg-[#00A3FF] text-white border-[#00A3FF]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#00A3FF]'
              }`}
              aria-pressed={documentType === 'cpf'}
              aria-label="Selecionar CPF"
            >
              CPF
            </button>
            <button
              type="button"
              onClick={() => {
                setDocumentType('cnpj');
                setDocument('');
                setError('');
              }}
              className={`flex-1 py-3 px-4 rounded-lg border-2 text-base font-medium transition-colors ${
                documentType === 'cnpj'
                  ? 'bg-[#00A3FF] text-white border-[#00A3FF]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#00A3FF]'
              }`}
              aria-pressed={documentType === 'cnpj'}
              aria-label="Selecionar CNPJ"
            >
              CNPJ
            </button>
          </div>

          <div>
            <label id="document-label" className="block text-base font-medium text-gray-700">
              {documentType === 'cpf' ? 'CPF' : 'CNPJ'}
            </label>
            <input 
              type="text" 
              value={formatDocument(document)}
              onChange={handleDocumentChange}
              placeholder={documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
              className={`mt-2 block w-full rounded-md shadow-sm focus:ring-[#00A3FF] h-12 text-lg ${
                error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#00A3FF]'
              }`}
              aria-labelledby="document-label"
              aria-invalid={!!error}
              aria-describedby={error ? "document-error" : undefined}
            />
            {error && (
              <p id="document-error" className="mt-2 text-sm text-red-500" role="alert">
                {error}
              </p>
            )}
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200" role="note" aria-label="Informação importante">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium text-blue-800">Informação importante</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Ao se tornar um locador na nossa plataforma, você receberá 90% do valor total de cada aluguel realizado. Os 10% restantes são destinados à manutenção da plataforma, suporte e divulgação dos espaços.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="h-4 w-4 text-[#00A3FF] rounded border-gray-300 focus:ring-[#00A3FF]"
                aria-required="true"
                aria-invalid={!termsAccepted}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                Eu li e concordo com os termos de distribuição de pagamento
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
              aria-label="Cancelar operação"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isLoading || !termsAccepted}
              className="px-6 py-3 text-base font-medium text-white bg-[#00A3FF] rounded-md hover:bg-[#0084CC] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isLoading ? "Processando solicitação" : "Confirmar solicitação"}
              aria-busy={isLoading}
            >
              {isLoading ? 'Processando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeRenterModal; 