import React, { useState } from 'react';
import { uploadImages, deleteImageFromCloudinary } from '../../../services/imageService';

// Constante para o tamanho máximo (5MB em bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Modal para visualização de imagem
const ModalImagem = ({ url, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true" aria-label="Visualização de imagem">
        <div className="bg-white rounded-lg p-4 max-w-3xl w-full flex flex-col items-center relative">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                title="Fechar"
                aria-label="Fechar visualização"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img src={url} alt="Visualização da imagem do espaço" className="max-w-full max-h-[70vh] rounded" />
        </div>
    </div>
);

// Componente para o upload de imagem
const CampoImagem = ({ value, onChange }) => {
    const [previewUrls, setPreviewUrls] = useState(value || []);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [modalUrl, setModalUrl] = useState(null);

    // Efeito para atualizar previewUrls quando value mudar
    React.useEffect(() => {
        if (value) {
            setPreviewUrls(value);
        }
    }, [value]);

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
        <div className="" role="group" aria-label="Upload de imagens do espaço">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="upload-imagem">
                    Selecione as imagens (máximo 5MB cada)
                </label>
                <input
                    id="upload-imagem"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                    multiple
                    aria-label="Selecionar imagens para upload"
                />
                <label
                    htmlFor="upload-imagem"
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-disabled={isUploading}
                >
                    {isUploading ? 'Enviando...' : 'Selecionar Imagem'}
                </label>
                {error && (
                    <p className="mt-2 text-sm text-red-600" role="alert" aria-label="Mensagem de erro">
                        {error}
                    </p>
                )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4" role="list" aria-label="Lista de imagens carregadas">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative group" role="listitem">
                        <img
                            src={url}
                            alt={`Imagem ${index + 1} do espaço`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer"
                            onClick={() => setModalUrl(url)}
                            role="button"
                            aria-label={`Visualizar imagem ${index + 1}`}
                        />
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remover imagem"
                            aria-label={`Remover imagem ${index + 1}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {isUploading && (
                <div className="text-center py-4" role="status" aria-label="Enviando imagens">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" aria-hidden="true"></div>
                    <p className="mt-2 text-sm text-gray-600">Enviando imagens...</p>
                </div>
            )}

            {value && value.length > 0 && !isUploading && (
                <div className="mt-4" role="status" aria-label="Total de imagens carregadas">
                    <p className="text-sm text-gray-600">
                        Total de imagens: {value.length}
                    </p>
                </div>
            )}

            {modalUrl && <ModalImagem url={modalUrl} onClose={() => setModalUrl(null)} />}
        </div>
    );
};

// Componente principal da Etapa 2 - Upload de Imagens
const Etapa2 = ({ formData, onUpdate }) => {
    const handleImageChange = (e) => {
        onUpdate({ image_url: e.target.value });
    };

    return (
        <div className="space-y-8" role="form" aria-label="Etapa 3: Fotos do Espaço">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4" id="etapa3-titulo">
                    Fotos do Espaço
                </h3>
                <p className="text-gray-600 mb-6" role="doc-subtitle">
                    Faça upload das imagens do seu espaço. Você pode adicionar várias imagens e removê-las se necessário.
                    <br />
                    <span className="text-sm text-gray-500">Tamanho máximo por imagem: 5MB</span>
                </p>
            </div>

            {/* Área de upload da imagem */}
            <div className="grid grid-cols-1 gap-6" role="group" aria-labelledby="etapa3-titulo">
                <CampoImagem
                    value={formData.image_url}
                    onChange={handleImageChange}
                />
            </div>
        </div>
    );
};

export default Etapa2; 