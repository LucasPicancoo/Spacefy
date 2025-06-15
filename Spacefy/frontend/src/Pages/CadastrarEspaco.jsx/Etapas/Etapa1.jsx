import React from 'react';

// Componente reutilizável para campos de texto
const CampoTexto = ({ label, id, name, value, onChange, required = false, type = "text", min, placeholder, maxLength }) => (
    <div role="group" aria-labelledby={`${id}-label`}>
        <label id={`${id}-label`} htmlFor={id} className="block text-sm font-medium text-gray-700">
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
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 focus:outline-none py-2 px-3"
            required={required}
            aria-required={required}
            aria-label={typeof label === 'string' ? label : undefined}
        />
    </div>
);

// Componente reutilizável para campos de seleção
const CampoSelect = ({ label, id, name, value, onChange, options, required = false }) => (
    <div role="group" aria-labelledby={`${id}-label`}>
        <label id={`${id}-label`} htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <select
            name={name}
            id={id}
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 focus:outline-none py-2 px-3"
            required={required}
            aria-required={required}
            aria-label={typeof label === 'string' ? label : undefined}
        >
            <option value="">Selecione uma opção</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

// Componente reutilizável para campos de texto longo (textarea)
const CampoTextArea = ({ label, id, name, value, onChange, maxLength, placeholder }) => (
    <div className="flex flex-col h-full ml-8" role="group" aria-labelledby={`${id}-label`}>
        <label id={`${id}-label`} htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <textarea
            name={name}
            id={id}
            rows={10}
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full h-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 focus:outline-none py-2 px-3"
            maxLength={maxLength}
            placeholder={placeholder}
            aria-label={typeof label === 'string' ? label : undefined}
        />
        <p className="mt-1 text-sm text-gray-500 text-right" role="status" aria-label={`Contador de caracteres: ${value?.length || 0} de ${maxLength}`}>
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

    // Opções para o tipo de espaço
    const tiposEspaco = [
        { value: 'espaço_para_eventos', label: 'Espaço para Eventos' },
        { value: 'sala_de_reuniões', label: 'Sala de Reuniões' },
        { value: 'auditório', label: 'Auditório' },
        { value: 'espaço_de_coworking', label: 'Espaço de Coworking' },
        { value: 'estúdio', label: 'Estúdio' },
        { value: 'galeria', label: 'Galeria' },
        { value: 'salao_festas', label: 'Salão de Festas' },
        { value: 'espaco_cultural', label: 'Espaço Cultural' },
        { value: 'sala_treino', label: 'Sala de Treino/Academia' },
        { value: 'sala_aula', label: 'Sala de Aula' },
        { value: 'espaco_gastronomico', label: 'Espaço Gastronômico' },
        { value: 'espaco_beleza', label: 'Espaço de Beleza' },
        { value: 'espaco_medico', label: 'Espaço Médico/Consultório' },
        { value: 'espaco_religioso', label: 'Espaço Religioso' },
        { value: 'espaco_esportivo', label: 'Espaço Esportivo' },
        { value: 'espaco_teatro', label: 'Espaço para Teatro' },
        { value: 'espaco_musica', label: 'Espaço para Música' },
        { value: 'espaco_exposicao', label: 'Espaço para Exposição' },
        { value: 'espaco_workshop', label: 'Espaço para Workshops' },
        { value: 'espaco_yoga', label: 'Espaço para Yoga/Meditação' },
        { value: 'espaco_danca', label: 'Espaço para Dança' },
        { value: 'espaco_artes_marciais', label: 'Espaço para Artes Marciais' },
        { value: 'espaco_fotografia', label: 'Estúdio Fotográfico' },
        { value: 'espaco_grafica', label: 'Espaço para Gráfica' },
        { value: 'espaco_cerimonia', label: 'Espaço para Cerimônias' },
        { value: 'espaco_conferencia', label: 'Espaço para Conferências' },
        { value: 'espaco_showroom', label: 'Showroom' },
        { value: 'espaco_loja', label: 'Espaço para Loja' },
        { value: 'espaco_escritorio', label: 'Espaço para Escritório' },
        { value: 'espaco_estudio_tv', label: 'Estúdio de TV' },
        { value: 'espaco_estudio_radio', label: 'Estúdio de Rádio' },
        { value: 'espaco_estudio_podcast', label: 'Estúdio de Podcast' },
        { value: 'espaco_estudio_gravacao', label: 'Estúdio de Gravação' },
        { value: 'espaco_estudio_danca', label: 'Estúdio de Dança' },
        { value: 'espaco_estudio_musica', label: 'Estúdio de Música' },
        { value: 'espaco_estudio_arte', label: 'Estúdio de Arte' },
        { value: 'espaco_estudio_fitness', label: 'Estúdio de Fitness' },
        { value: 'espaco_estudio_pilates', label: 'Estúdio de Pilates' },
        { value: 'espaco_estudio_massagem', label: 'Espaço para Massagem' },
        { value: 'espaco_estudio_spa', label: 'Espaço para Spa' },
        { value: 'espaco_estudio_sauna', label: 'Espaço para Sauna' },
        { value: 'espaco_estudio_piscina', label: 'Espaço com Piscina' },
        { value: 'espaco_estudio_quadra', label: 'Espaço com Quadra' },
        { value: 'espaco_estudio_campo', label: 'Espaço com Campo' },
        { value: 'espaco_estudio_parque', label: 'Espaço com Parque' },
        { value: 'outro', label: 'Outro' }
    ];

    return (
        <div className="space-y-8" role="form" aria-label="Etapa 1: Informações do Espaço">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4" id="etapa1-titulo">
                    Informações do Espaço
                </h3>
            </div>

            {/* Grid com os campos do formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12" role="group" aria-labelledby="etapa1-titulo">
                {/* Coluna da esquerda - Campos de texto */}
                <div className="space-y-6" role="group" aria-label="Informações básicas do espaço">
                    <CampoTexto
                        label="Nome do espaço"
                        id="space_name"
                        name="space_name"
                        value={formData.space_name}
                        onChange={handleChange}
                        required
                    />

                    <CampoSelect
                        label={
                            <>
                                Tipo do espaço <span className="text-xs text-gray-400" aria-label="Exemplos: Espaço para Eventos, Sala de Reuniões, Auditório, etc...">(Espaço para Eventos, Sala de Reuniões, Auditório, etc...)</span>
                            </>
                        }
                        id="space_type"
                        name="space_type"
                        value={formData.space_type}
                        onChange={handleChange}
                        options={tiposEspaco}
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
                </div>

                {/* Coluna da direita - Campo de descrição */}
                <CampoTextArea
                    label={
                        <>
                            Descrição do espaço <span className="text-xs text-gray-400" aria-label="Máximo de 750 caracteres">(Max 750 caracteres)</span>
                        </>
                    }
                    id="space_description"
                    name="space_description"
                    value={formData.space_description}
                    onChange={handleChange}
                    maxLength={750}
                    placeholder="Descreva brevemente o espaço, características, diferenciais, etc."
                />
            </div>
        </div>
    );
};

export default Etapa1; 