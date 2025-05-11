import React from 'react';

// Componente para o campo de URL da imagem
const CampoImagem = ({ value, onChange }) => (
    <div className="border-2 border-gray-300 rounded-lg p-6">
        <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite a URL da imagem principal"
            value={value || ''}
            onChange={onChange}
        />
    </div>
);

// Componente principal da Etapa 2 - Upload de Imagens
const Etapa2 = ({ formData, onUpdate }) => {
    // Função para processar a URL da imagem
    const handleImageChange = (e) => {
        const urls = e.target.value.split(',').map(url => url.trim());
        onUpdate({ image_url: urls[0] || '' });
    };

    return (
        <div className="space-y-8">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Fotos do Espaço
                </h3>
                <p className="text-gray-600 mb-6">
                    Digite a URL da imagem principal do seu espaço.
                </p>
            </div>

            {/* Área de upload da imagem */}
            <div className="grid grid-cols-1 gap-6">
                <CampoImagem
                    value={formData.image_url}
                    onChange={handleImageChange}
                />
            </div>
        </div>
    );
};

export default Etapa2; 