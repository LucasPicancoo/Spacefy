import React from 'react';

// Componente reutilizável para campos de texto
const CampoTexto = ({ label, id, name, value, onChange, required = false, type = "text", min, placeholder, maxLength }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            name={name}
            id={id}
            value={value || ''}
            onChange={onChange}
            min={min}
            maxLength={maxLength}
            placeholder={placeholder}
            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
            required={required}
        />
    </div>
);

// Componente reutilizável para campos de texto longo (textarea)
const CampoTextArea = ({ label, id, name, value, onChange, maxLength, placeholder }) => (
    <div className="flex flex-col h-full ml-8">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <textarea
            name={name}
            id={id}
            rows={10}
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            maxLength={maxLength}
            placeholder={placeholder}
        />
        <p className="mt-1 text-sm text-gray-500 text-right">
            {value?.length || 0}/{maxLength} caracteres
        </p>
    </div>
);

// Componente principal da Etapa 1 - Informações Básicas do Espaço
const Etapa1 = ({ formData, onUpdate }) => {
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
                    Informações do Espaço
                </h3>
            </div>

            {/* Grid com os campos do formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                {/* Coluna da esquerda - Campos de texto */}
                <div className="space-y-6">
                    <CampoTexto
                        label="Nome do espaço"
                        id="space_name"
                        name="space_name"
                        value={formData.space_name}
                        onChange={handleChange}
                        required
                    />

                    <CampoTexto
                        label={
                            <>
                                Tipo do espaço <span className="text-xs text-gray-400">(Espaço para Eventos, Sala de Reuniões, Auditório, etc...)</span>
                            </>
                        }
                        id="space_type"
                        name="space_type"
                        value={formData.space_type}
                        onChange={handleChange}
                        required
                    />

                    <CampoTexto
                        label="Capacidade máxima de pessoas"
                        id="max_people"
                        name="max_people"
                        value={formData.max_people}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        required
                    />

                    <CampoTexto
                        label={
                            <>
                                Localização <span className="text-xs text-gray-400">(URL no MAPS)</span>
                            </>
                        }
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Coluna da direita - Campo de descrição */}
                <CampoTextArea
                    label={
                        <>
                            Descrição do espaço <span className="text-xs text-gray-400">(Max 250 caracteres)</span>
                        </>
                    }
                    id="space_description"
                    name="space_description"
                    value={formData.space_description}
                    onChange={handleChange}
                    maxLength={250}
                    placeholder="Descreva brevemente o espaço, características, diferenciais, etc."
                />
            </div>
        </div>
    );
};

export default Etapa1; 