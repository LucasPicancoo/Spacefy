import React from 'react';

const Etapa7 = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Etapa 7</h2>
                <button 
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p className="text-gray-600">
                Nesta sétima etapa, você revisará todas as informações e confirmará o cadastro do seu espaço.
            </p>
        </div>
    );
};

export default Etapa7; 