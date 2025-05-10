import React, { useState } from 'react';

const Etapa6 = ({ formData, onUpdate }) => {
    const [documentPreview, setDocumentPreview] = useState(formData.documentoUrl ? [formData.documentoUrl] : []);
    const [espacoDocumentPreview, setEspacoDocumentPreview] = useState(formData.documentoEspacoUrl ? [formData.documentoEspacoUrl] : []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Aceita imagem ou PDF
        if (!['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'].includes(file.type)) {
            alert('Apenas imagens (PNG, JPG) ou PDF são permitidos.');
            return;
        }
        // Limita a 1 arquivo
        setDocumentPreview([file]);
        onUpdate({ documento: file });
    };

    const handleEspacoDocumentChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Aceita imagem ou PDF
        if (!['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'].includes(file.type)) {
            alert('Apenas imagens (PNG, JPG) ou PDF são permitidos.');
            return;
        }
        // Limita a 1 arquivo
        setEspacoDocumentPreview([file]);
        onUpdate({ documentoEspaco: file });
    };

    const removeDocument = () => {
        setDocumentPreview([]);
        onUpdate({ documento: null });
    };

    const removeEspacoDocument = () => {
        setEspacoDocumentPreview([]);
        onUpdate({ documentoEspaco: null });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Dados do Proprietário
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div>
                        <label htmlFor="nome_proprietario" className="block text-base font-medium text-gray-700">
                            Nome do Proprietário ou Empresa <span className="text-xs text-gray-400">(Nome Fantasia)</span>
                        </label>
                        <input
                            type="text"
                            id="nome_proprietario"
                            name="nome_proprietario"
                            value={formData.nome_proprietario || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf_cnpj" className="block text-base font-medium text-gray-700">
                            CPF / CNPJ
                        </label>
                        <input
                            type="text"
                            id="cpf_cnpj"
                            name="cpf_cnpj"
                            value={formData.cpf_cnpj || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                        />
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <label htmlFor="telefone" className="block text-base font-medium text-gray-700">
                            Telefone <span className="text-xs text-gray-400">(xx) xxxx-xxxx</span>
                        </label>
                        <input
                            type="text"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-base font-medium text-gray-700">
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                        />
                    </div>
                </div>
            </div>
            {/* Upload do documento do proprietário */}
            <div className="grid grid-cols-1 gap-6 mt-8">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Documento do Proprietário</h4>
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
                            <div className="mt-4 flex text-sm text-gray-600 justify-center">
                                <label
                                    htmlFor="document-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                >
                                    <span>Adicionar documento</span>
                                    <input
                                        id="document-upload"
                                        name="document-upload"
                                        type="file"
                                        className="sr-only"
                                        accept="image/*,application/pdf"
                                        onChange={handleDocumentChange}
                                    />
                                </label>
                                <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, PDF até 10MB
                            </p>
                        </div>
                    </div>
                </div>
                {documentPreview.length > 0 && (
                    <div className="flex justify-center mt-4">
                        {documentPreview.map((file, index) => {
                            let url = '';
                            let isImage = false;
                            if (file instanceof File) {
                                url = file.type.startsWith('image') ? URL.createObjectURL(file) : '';
                                isImage = file.type.startsWith('image');
                            } else if (typeof file === 'string') {
                                url = file;
                                isImage = file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg');
                            }
                            return (
                                <div key={index} className="relative group">
                                    {isImage && url ? (
                                        <img
                                            src={url}
                                            alt={`Documento ${index + 1}`}
                                            className="h-32 w-auto object-contain rounded-lg border"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-32 w-32 bg-gray-100 rounded-lg border">
                                            <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7v10M17 7v10M7 7h10M7 17h10" />
                                            </svg>
                                            <span className="text-xs text-gray-700 text-center break-all">{file.name || 'Documento.pdf'}</span>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={removeDocument}
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
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Upload do documento do espaço */}
            <div className="grid grid-cols-1 gap-6 mt-8">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Documento do Espaço</h4>
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
                            <div className="mt-4 flex text-sm text-gray-600 justify-center">
                                <label
                                    htmlFor="espaco-document-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                >
                                    <span>Adicionar documento do espaço</span>
                                    <input
                                        id="espaco-document-upload"
                                        name="espaco-document-upload"
                                        type="file"
                                        className="sr-only"
                                        accept="image/*,application/pdf"
                                        onChange={handleEspacoDocumentChange}
                                    />
                                </label>
                                <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, PDF até 10MB
                            </p>
                        </div>
                    </div>
                </div>
                {espacoDocumentPreview.length > 0 && (
                    <div className="flex justify-center mt-4">
                        {espacoDocumentPreview.map((file, index) => {
                            let url = '';
                            let isImage = false;
                            if (file instanceof File) {
                                url = file.type.startsWith('image') ? URL.createObjectURL(file) : '';
                                isImage = file.type.startsWith('image');
                            } else if (typeof file === 'string') {
                                url = file;
                                isImage = file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg');
                            }
                            return (
                                <div key={index} className="relative group">
                                    {isImage && url ? (
                                        <img
                                            src={url}
                                            alt={`Documento do Espaço ${index + 1}`}
                                            className="h-32 w-auto object-contain rounded-lg border"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-32 w-32 bg-gray-100 rounded-lg border">
                                            <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7v10M17 7v10M7 7h10M7 17h10" />
                                            </svg>
                                            <span className="text-xs text-gray-700 text-center break-all">{file.name || 'Documento.pdf'}</span>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={removeEspacoDocument}
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Etapa6; 