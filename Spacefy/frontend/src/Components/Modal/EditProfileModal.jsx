import React, { useState } from 'react';

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    telephone: user?.telephone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para salvar as alterações
    console.log('Dados a serem salvos:', formData);
    onClose();
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
          <h2 id="modal-title" className="text-2xl font-semibold">Editar Perfil</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            aria-label="Fechar modal de edição de perfil"
          >
            ✕
          </button>
        </div>
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          role="form"
          aria-label="Formulário de edição de perfil"
        >
          <div role="group" aria-labelledby="name-label">
            <label 
              id="name-label"
              className="block text-base font-medium text-gray-700"
            >
              Nome
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3FF] focus:ring-[#00A3FF] h-12 text-lg"
              aria-required="true"
              aria-label="Digite seu nome"
            />
          </div>
          <div role="group" aria-labelledby="surname-label">
            <label 
              id="surname-label"
              className="block text-base font-medium text-gray-700"
            >
              Sobrenome
            </label>
            <input 
              type="text" 
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3FF] focus:ring-[#00A3FF] h-12 text-lg"
              aria-required="true"
              aria-label="Digite seu sobrenome"
            />
          </div>
          <div role="group" aria-labelledby="email-label">
            <label 
              id="email-label"
              className="block text-base font-medium text-gray-700"
            >
              E-mail
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3FF] focus:ring-[#00A3FF] h-12 text-lg"
              aria-required="true"
              aria-label="Digite seu e-mail"
            />
          </div>
          <div role="group" aria-labelledby="telephone-label">
            <label 
              id="telephone-label"
              className="block text-base font-medium text-gray-700"
            >
              Telefone
            </label>
            <input 
              type="tel" 
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3FF] focus:ring-[#00A3FF] h-12 text-lg"
              aria-required="true"
              aria-label="Digite seu número de telefone"
            />
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
              aria-label="Cancelar edição do perfil"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-3 text-base font-medium text-white bg-[#00A3FF] rounded-md hover:bg-[#0084CC] cursor-pointer"
              aria-label="Salvar alterações do perfil"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;