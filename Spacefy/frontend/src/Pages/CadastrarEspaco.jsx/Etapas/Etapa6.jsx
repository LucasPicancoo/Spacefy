import React from 'react';

// Componente para campos de texto simples
const CampoTexto = ({ label, id, name, value, onChange, type = "text" }) => (
    <div>
        <label htmlFor={id} className="block text-base font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
        />
    </div>
);

// Componente para campos de documento (URL)
const CampoDocumento = ({ titulo, id, name, value, onChange }) => (
    <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">{titulo}</h4>
        <input
            type="text"
            id={id}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={`URL do ${titulo.toLowerCase()}`}
            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
        />
    </div>
);

// Componente principal da Etapa 6 - Dados do Proprietário
const Etapa6 = ({ formData, onUpdate }) => {
    // Função para atualizar os dados do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    return (
        <div className="space-y-8">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Dados do Proprietário
                </h3>
            </div>

            {/* Grid com dados pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Coluna da esquerda */}
                <div className="space-y-8">
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

                {/* Coluna da direita */}
                <div className="space-y-8">
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

            {/* Seção de documentos */}
            <div className="grid grid-cols-1 gap-6 mt-8">
                <CampoDocumento
                    titulo="Documento do Proprietário"
                    id="document_photo"
                    name="document_photo"
                    value={formData.document_photo}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8">
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

export default Etapa6; 