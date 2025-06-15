import React, { useState } from 'react';
import { uploadDocument, deleteDocumentFromCloudinary } from '../../../services/documentService';

// Componente reutilizável para campos de texto
// Recebe props para label, id, name, value, onChange e type (opcional)
const CampoTexto = ({ label, id, name, value, onChange, type = "text" }) => (
    <div role="group" aria-labelledby={`${id}-label`}>
        <label htmlFor={id} id={`${id}-label`} className="block text-base font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 focus:outline-none py-2 px-3"
            aria-label={label}
        />
    </div>
);

// Componente para visualização de documentos (PDFs e imagens)
// Gerencia um modal para visualização e download de documentos
const VisualizadorDocumento = ({ url }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!url) return null;

    const fileType = url.split('.').pop().toLowerCase();
    const isPDF = fileType === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileType);

    const handleOpen = (e) => {
        e.preventDefault();
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="mt-2">
            <button
                onClick={handleOpen}
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 cursor-pointer"
                aria-label="Visualizar documento"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Visualizar Documento
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Visualização do documento"
                >
                    <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-[80vh] flex flex-col shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold" id="modal-titulo">Visualização do Documento</h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                aria-label="Fechar visualização"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto" role="region" aria-labelledby="modal-titulo">
                            {isPDF ? (
                                <div className="h-full flex flex-col">
                                    <iframe
                                        src={`${url}?fl_attachment=true`}
                                        className="flex-1 w-full"
                                        title="Visualizador de PDF"
                                        aria-label="Visualizador de PDF"
                                    />
                                    <div className="mt-4 flex justify-center">
                                        <a
                                            href={`${url}?fl_attachment=true`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                                            aria-label="Abrir PDF em nova aba"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                            Abrir PDF em nova aba
                                        </a>
                                    </div>
                                </div>
                            ) : isImage ? (
                                <img
                                    src={url}
                                    alt="Documento"
                                    className="max-w-full max-h-full mx-auto"
                                    aria-label="Visualização do documento"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <a
                                        href={`${url}?fl_attachment=true`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                        aria-label="Abrir documento em nova aba"
                                    >
                                        Abrir documento em nova aba
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para upload e gerenciamento de documentos
// Inclui funcionalidades de upload, remoção e visualização
const CampoDocumento = ({ titulo, id, name, value, onChange }) => {
    // Estados para controlar o upload e erros
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    // Função para lidar com o upload de arquivos
    // Inclui validação de tamanho e tratamento de erros
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Verifica o tamanho do arquivo (máximo 10MB)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
            setError('O arquivo excede o limite de 10MB. Por favor, reduza o tamanho do arquivo.');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const url = await uploadDocument(file);
            onChange({ target: { name, value: url } });
        } catch (error) {
            console.error('Erro ao fazer upload do documento:', error);
            setError('Erro ao fazer upload do documento. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };

    // Função para remover documentos já enviados
    const handleRemoveDocument = async () => {
        if (!value) return;

        try {
            await deleteDocumentFromCloudinary(value);
            onChange({ target: { name, value: '' } });
        } catch (error) {
            console.error('Erro ao excluir documento:', error);
            setError('Erro ao excluir documento. Tente novamente.');
        }
    };

    return (
        <div role="group" aria-labelledby={`${id}-titulo`}>
            <h4 className="text-lg font-medium text-gray-900 mb-4" id={`${id}-titulo`}>{titulo}</h4>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        id={id}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        disabled={isUploading}
                        aria-label={`Selecionar arquivo para ${titulo}`}
                    />
                    <label
                        htmlFor={id}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors ${
                            isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        aria-disabled={isUploading}
                    >
                        {isUploading ? 'Enviando...' : 'Selecionar Arquivo'}
                    </label>
                    {value && (
                        <button
                            type="button"
                            onClick={handleRemoveDocument}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                            aria-label={`Remover ${titulo}`}
                        >
                            Remover
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-red-600" role="alert" aria-label="Mensagem de erro">
                        {error}
                    </p>
                )}
                {value && (
                    <div className="mt-2">
                        <VisualizadorDocumento url={value} />
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente principal da Etapa 6 - Formulário de Dados do Proprietário
// Organiza os campos em um layout de duas colunas e inclui seções para documentos
const Etapa7 = ({ formData, onUpdate }) => {
    // Função para atualizar os dados do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    return (
        <div className="space-y-8" role="form" aria-label="Etapa 7: Dados do Proprietário">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4" id="etapa7-titulo">
                    Dados do Proprietário
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" role="group" aria-labelledby="etapa7-titulo">
                <div className="space-y-8" role="group" aria-label="Dados pessoais">
                    <CampoTexto
                        label="Nome do Proprietário"
                        id="owner_name"
                        name="owner_name"
                        value={formData.owner_name}
                        onChange={handleChange}
                    />
                    <CampoTexto
                        label="CPF / CNPJ"
                        id="document_number"
                        name="document_number"
                        value={formData.document_number}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-8" role="group" aria-label="Informações de contato">
                    <CampoTexto
                        label="Telefone"
                        id="owner_phone"
                        name="owner_phone"
                        value={formData.owner_phone}
                        onChange={handleChange}
                    />
                    <CampoTexto
                        label="E-mail"
                        id="owner_email"
                        name="owner_email"
                        value={formData.owner_email}
                        onChange={handleChange}
                        type="email"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8" role="group" aria-label="Documentos do proprietário">
                <CampoDocumento
                    titulo="Documento do Proprietário"
                    id="document_photo"
                    name="document_photo"
                    value={formData.document_photo}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8" role="group" aria-label="Documentos do espaço">
                <CampoDocumento
                    titulo="Documento do Espaço"
                    id="space_document_photo"
                    name="space_document_photo"
                    value={formData.space_document_photo}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default Etapa7; 