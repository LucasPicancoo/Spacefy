import React, { useState } from 'react';

const Etapa2 = ({ formData, onUpdate }) => {
    const [previewUrls, setPreviewUrls] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Limita o número de imagens a 5
        if (files.length + previewUrls.length > 5) {
            alert('Você pode adicionar no máximo 5 imagens');
            return;
        }

        // Cria URLs para preview das imagens
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

        // Aqui você pode adicionar a lógica para fazer upload das imagens
        // e atualizar o formData com as URLs das imagens
        onUpdate({ images: [...formData.images || [], ...files] });
    };

    const removeImage = (index) => {
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        const newImages = formData.images?.filter((_, i) => i !== index) || [];
        onUpdate({ images: newImages });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Fotos do Espaço
                </h3>
                <p className="text-gray-600 mb-6">
                    Adicione fotos do seu espaço para torná-lo mais atrativo para os locatários.
                    Você pode adicionar até 5 imagens.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="mt-4 flex justify-center items-center text-sm text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                                <span>Adicionar fotos</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                            </label>
                            <p className="pl-1">ou arraste e solte</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, GIF até 10MB
                        </p>
                    </div>
                </div>

                {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="h-32 w-full object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Etapa2; 