import React from 'react';

const EditProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-12 w-[800px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Editar Perfil</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-700">Nome</label>
            <input 
              type="text" 
              defaultValue={user?.name}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3FF] focus:ring-[#00A3FF] h-12 text-lg"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700">Sobrenome</label>
            <input 
              type="text" 
              defaultValue={user?.surname}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3FF] focus:ring-[#00A3FF] h-12 text-lg"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700">E-mail</label>
            <input 
              type="email" 
              defaultValue={user?.email}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3FF] focus:ring-[#00A3FF] h-12 text-lg"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700">Telefone</label>
            <input 
              type="tel" 
              defaultValue={user?.telephone}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A3FF] focus:ring-[#00A3FF] h-12 text-lg"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button 
            className="px-6 py-3 text-base font-medium text-white bg-[#00A3FF] rounded-md hover:bg-[#0084CC]"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;