import React from 'react';

// Componente para seções de revisão
const SecaoRevisao = ({ titulo, children }) => (
    <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
            {titulo}
        </h4>
        <div className="bg-gray-50 p-4 rounded-lg">
            {children}
        </div>
    </div>
);

// Componente para itens de revisão padrão
const ItemRevisao = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
);

// Componente para itens de revisão que ocupam duas colunas
const ItemRevisaoLargo = ({ label, value }) => (
    <div className="sm:col-span-2">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
);

// Componente para checkbox de termos e condições
const CheckboxTermos = ({ checked, onChange }) => (
    <div className="flex items-start">
        <div className="flex items-center h-5">
            <input
                type="checkbox"
                id="termos_aceitos"
                name="termos_aceitos"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                required
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor="termos_aceitos" className="font-medium text-gray-700">
                Li e aceito os termos e condições
            </label>
            <p className="text-gray-500">
                Ao marcar esta opção, você confirma que todas as informações fornecidas são verdadeiras e que concorda com os termos e condições da plataforma.
            </p>
        </div>
    </div>
);

// Componente principal da Etapa 7 - Revisão e Confirmação
const Etapa7 = ({ formData, onUpdate }) => {
    // Função para atualizar o estado do checkbox de termos
    const handleChange = (e) => {
        const { name, checked } = e.target;
        onUpdate({ [name]: checked });
    };

    return (
        <div className="space-y-8">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Revisão e Confirmação
                </h3>
                <p className="text-gray-600 mb-6">
                    Revise todas as informações do seu espaço antes de finalizar o cadastro.
                </p>
            </div>

            <div className="space-y-6">
                {/* Seção de informações básicas */}
                <SecaoRevisao titulo="Informações Básicas">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <ItemRevisao
                            label="Nome do Espaço"
                            value={formData.space_name}
                        />
                        <ItemRevisao
                            label="Tipo do Espaço"
                            value={formData.space_type}
                        />
                        <ItemRevisao
                            label="Capacidade Máxima"
                            value={`${formData.max_people} pessoas`}
                        />
                        <ItemRevisao
                            label="Preço por Hora"
                            value={`R$ ${formData.price_per_hour}`}
                        />
                        <ItemRevisaoLargo
                            label="Endereço"
                            value={formData.location}
                        />
                    </dl>
                </SecaoRevisao>

                {/* Seção de disponibilidade */}
                <SecaoRevisao titulo="Disponibilidade">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <ItemRevisao
                            label="Horário de Funcionamento"
                            value={`${formData.opening_time} - ${formData.closing_time}`}
                        />
                        <ItemRevisao
                            label="Dias da Semana"
                            value={formData.week_days?.join(', ')}
                        />
                    </dl>
                </SecaoRevisao>

                {/* Seção de equipamentos e comodidades */}
                <SecaoRevisao titulo="Equipamentos e Comodidades">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {formData.space_amenities?.map((amenity) => (
                            <div key={amenity} className="flex items-center">
                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm text-gray-900">{amenity}</span>
                            </div>
                        ))}
                    </div>
                </SecaoRevisao>

                {/* Seção de termos e condições */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Termos e Condições
                    </h4>
                    <div className="space-y-4">
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

export default Etapa7; 