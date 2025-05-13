import React, { useState } from 'react';

const BecomeRenterModal = ({ isOpen, onClose }) => {
  const [document, setDocument] = useState('');
  const [documentType, setDocumentType] = useState('cpf'); // 'cpf' ou 'cnpj'
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const requiredLength = documentType === 'cpf' ? 11 : 14;
    if (document.length !== requiredLength) {
      setError(`O ${documentType.toUpperCase()} deve conter ${requiredLength} dígitos`);
      return;
    }

    // Aqui você pode adicionar a lógica para processar o documento
    console.log('Documento:', document);
    onClose();
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-12 w-[800px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Virar Locatário</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <p className="text-gray-600 text-base">
              Para se tornar um locatário e começar a alugar seus espaços, precisamos do seu CPF (pessoa física) ou CNPJ (pessoa jurídica). 
              Este documento será utilizado para garantir a segurança das transações e a verificação da sua identidade.
            </p>
          </div>

          <div className="flex gap-4 mb-4">
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
            >
              CNPJ
            </button>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">
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
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-3 text-base font-medium text-white bg-[#00A3FF] rounded-md hover:bg-[#0084CC] cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeRenterModal; 