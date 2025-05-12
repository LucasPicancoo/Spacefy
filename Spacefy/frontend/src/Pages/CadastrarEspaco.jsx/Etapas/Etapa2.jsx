import React, { useState } from 'react';
import { uploadImages, deleteImageFromCloudinary } from '../../../services/imageService';

// Constante para o tamanho máximo (5MB em bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Componente para o upload de imagem
const CampoImagem = ({ value, onChange }) => {
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setError(''); // Limpa erros anteriores

        // Verifica o tamanho de cada arquivo
        const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE);
        if (invalidFiles.length > 0) {
            setError(`Algumas imagens excedem o limite de 5MB. Por favor, reduza o tamanho das imagens.`);
            return;
        }

        if (files.length > 0) {
            setIsUploading(true);

            try {
                // Cria URLs temporários para preview
                const newPreviewUrls = files.map(file => URL.createObjectURL(file));
                setPreviewUrls([...previewUrls, ...newPreviewUrls]);

                // Faz o upload das imagens usando o serviço
                const uploadedUrls = await uploadImages(files);

                // Atualiza o valor com as URLs do Cloudinary
                const newValue = [...(value || []), ...uploadedUrls];
                onChange({ target: { value: newValue } });
            } catch (error) {
                console.error('Erro ao fazer upload das imagens:', error);
                setError('Erro ao fazer upload das imagens. Tente novamente.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemoveImage = async (index) => {
        try {
            const imageUrl = value[index];
            
            // Tenta excluir a imagem do Cloudinary
            await deleteImageFromCloudinary(imageUrl);
            
            // Se a exclusão for bem-sucedida, atualiza o estado local
            const newUrls = [...(value || [])];
            const newPreviewUrls = [...previewUrls];
            newUrls.splice(index, 1);
            newPreviewUrls.splice(index, 1);
            onChange({ target: { value: newUrls } });
            setPreviewUrls(newPreviewUrls);
        } catch (error) {
            console.error('Erro ao excluir imagem:', error);
            setError('Erro ao excluir imagem. Tente novamente.');
        }
    };

    return (
        <div className="border-2 border-gray-300 rounded-lg p-6">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione as imagens (máximo 5MB cada)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isUploading}
                    multiple
                />
                {error && (
                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>
            
            {isUploading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Enviando imagens...</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remover imagem"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {value && value.length > 0 && !isUploading && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                        Total de imagens: {value.length}
                    </p>
                </div>
            )}
        </div>
    );
};

// Componente principal da Etapa 2 - Upload de Imagens
const Etapa2 = ({ formData, onUpdate }) => {
    const handleImageChange = (e) => {
        onUpdate({ image_url: e.target.value });
    };

    return (
        <div className="space-y-8">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Fotos do Espaço
                </h3>
                <p className="text-gray-600 mb-6">
                    Faça upload das imagens do seu espaço. Você pode adicionar várias imagens e removê-las se necessário.
                    <br />
                    <span className="text-sm text-gray-500">Tamanho máximo por imagem: 5MB</span>
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