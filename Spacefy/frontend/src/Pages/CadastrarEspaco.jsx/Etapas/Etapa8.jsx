import React from 'react';

// Componente para seções de revisão
const SecaoRevisao = ({ titulo, children }) => (
    <div role="region" aria-labelledby={`secao-${titulo.toLowerCase().replace(/\s+/g, '-')}`}>
        <h4 className="text-lg font-medium text-gray-900 mb-4" id={`secao-${titulo.toLowerCase().replace(/\s+/g, '-')}`}>
            {titulo}
        </h4>
        <div className="bg-gray-50 p-4 rounded-lg" role="group">
            {children}
        </div>
    </div>
);

// Componente para itens de revisão padrão
const ItemRevisao = ({ label, value }) => (
    <div role="listitem">
        <dt className="text-sm font-medium text-gray-500" id={`label-${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</dt>
        <dd className="mt-1 text-sm text-gray-900" aria-labelledby={`label-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value}</dd>
    </div>
);

// Componente para itens de revisão que ocupam duas colunas
const ItemRevisaoLargo = ({ label, value }) => (
    <div className="sm:col-span-2" role="listitem">
        <dt className="text-sm font-medium text-gray-500" id={`label-${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</dt>
        <dd className="mt-1 text-sm text-gray-900" aria-labelledby={`label-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value}</dd>
    </div>
);

// Componente para checkbox de termos e condições
const CheckboxTermos = ({ checked, onChange }) => (
    <div className="flex items-start" role="group" aria-labelledby="termos-label">
        <div className="flex items-center h-5">
            <input
                type="checkbox"
                id="termos_aceitos"
                name="termos_aceitos"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                required
                aria-required="true"
                aria-describedby="termos-descricao"
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor="termos_aceitos" id="termos-label" className="font-medium text-gray-700">
                Li e aceito os termos e condições
            </label>
            <p id="termos-descricao" className="text-gray-500">
                Ao marcar esta opção, você confirma que todas as informações fornecidas são verdadeiras e que concorda com os termos e condições da plataforma.
            </p>
        </div>
    </div>
);

// Componente principal da Etapa 8 - Revisão e Confirmação
const Etapa8 = ({ formData, onUpdate }) => {
    // Função para atualizar o estado do checkbox de termos
    const handleChange = (e) => {
        const { name, checked } = e.target;
        onUpdate({ [name]: checked });
    };

    return (
        <div className="space-y-8" role="form" aria-label="Etapa 8: Revisão e Confirmação">
            {/* Cabeçalho da etapa */}
            <div role="banner">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4" id="etapa8-titulo">
                    Revisão e Confirmação
                </h3>
                <p className="text-gray-600 mb-6" role="doc-subtitle">
                    Revise todas as informações do seu espaço antes de finalizar o cadastro.
                </p>
            </div>

            <div className="space-y-6" role="group" aria-labelledby="etapa8-titulo">
                {/* Seção de informações básicas */}
                <SecaoRevisao titulo="Informações Básicas">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2" role="list">
                        <ItemRevisao
                            label="Nome do Espaço"
                            value={formData.space_name || 'Não informado'}
                        />
                        <ItemRevisao
                            label="Tipo do Espaço"
                            value={formData.space_type || 'Não informado'}
                        />
                        <ItemRevisao
                            label="Capacidade Máxima"
                            value={formData.max_people ? `${formData.max_people} pessoas` : 'Não informado'}
                        />
                        <ItemRevisao
                            label="Preço por Hora"
                            value={formData.price_per_hour ? `R$ ${formData.price_per_hour.toFixed(2)}` : 'Não informado'}
                        />
                        <ItemRevisaoLargo
                            label="Endereço"
                            value={formData.street && formData.number && formData.neighborhood && formData.city && formData.state
                                ? `${formData.street}, ${formData.number} - ${formData.neighborhood}, ${formData.city} - ${formData.state}`
                                : 'Não informado'}
                        />
                        <ItemRevisaoLargo
                            label="Descrição"
                            value={formData.space_description || 'Não informado'}
                        />
                    </dl>
                </SecaoRevisao>

                {/* Seção de disponibilidade */}
                <SecaoRevisao titulo="Disponibilidade">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6" role="list">
                        <ItemRevisaoLargo
                            label="Dias e Horários de Funcionamento"
                            value={formData.weekly_days?.length 
                                ? <div className="space-y-1" role="list">
                                    {formData.weekly_days.map(day => {
                                        const dias = {
                                            'domingo': 'Domingo',
                                            'segunda': 'Segunda-feira',
                                            'terca': 'Terça-feira',
                                            'quarta': 'Quarta-feira',
                                            'quinta': 'Quinta-feira',
                                            'sexta': 'Sexta-feira',
                                            'sabado': 'Sábado'
                                        };
                                        const horarios = day.time_ranges.map(range => 
                                            `${range.open} - ${range.close}`
                                        ).join(', ');
                                        return <div key={day.day} role="listitem"><strong>{dias[day.day]}</strong>: {horarios}</div>;
                                    })}
                                  </div>
                                : 'Não informado'}
                        />
                    </dl>
                </SecaoRevisao>

                {/* Seção de regras do espaço */}
                <SecaoRevisao titulo="Regras do Espaço">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6" role="list">
                        <ItemRevisaoLargo
                            label="Regras"
                            value={formData.space_rules ? formData.space_rules.join(', ') : 'Não informado'}
                        />
                    </dl>
                </SecaoRevisao>

                {/* Seção de equipamentos e comodidades */}
                <SecaoRevisao titulo="Equipamentos e Comodidades">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" role="list">
                        {formData.space_amenities?.length > 0 ? (
                            formData.space_amenities.map((amenity) => (
                                <div key={amenity} className="flex items-center" role="listitem">
                                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm text-gray-900">{amenity}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500" role="status">Nenhum equipamento ou comodidade informada</div>
                        )}
                    </div>
                </SecaoRevisao>

                {/* Seção de termos e condições */}
                <div role="region" aria-label="Termos e Condições">
                    <h4 className="text-lg font-medium text-gray-900 mb-4" id="termos-titulo">
                        Termos e Condições
                    </h4>
                    <div className="space-y-4" role="group" aria-labelledby="termos-titulo">
                        <CheckboxTermos
                            checked={formData.termos_aceitos || false}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Etapa8; 