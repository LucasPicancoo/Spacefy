import React from 'react';

const Etapa2 = ({ formData, onUpdate }) => {
    const handleImageChange = (e) => {
        // Pega a primeira URL da lista de imagens
        const urls = e.target.value.split(',').map(url => url.trim());
        onUpdate({ images: urls[0] || '' });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Fotos do Espaço
                </h3>
                <p className="text-gray-600 mb-6">
                    Digite a URL da imagem principal do seu espaço.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="border-2 border-gray-300 rounded-lg p-6">
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Digite a URL da imagem principal"
                        value={formData.images || ''}
                        onChange={handleImageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Etapa2; 