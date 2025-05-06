import React from 'react';

const Etapa7 = ({ formData, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Revisão e Confirmação
                </h3>
                <p className="text-gray-600 mb-6">
                    Revise todas as informações do seu espaço antes de finalizar o cadastro.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Informações Básicas
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Nome do Espaço</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formData.space_name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Tipo do Espaço</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formData.space_type}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Capacidade Máxima</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formData.max_people} pessoas</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Preço por Hora</dt>
                                <dd className="mt-1 text-sm text-gray-900">R$ {formData.price_per_hour}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formData.location}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Disponibilidade
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Horário de Funcionamento</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {formData.horario_inicio} - {formData.horario_fim}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Tempo Mínimo de Locação</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formData.tempo_minimo} horas</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Equipamentos e Comodidades
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Object.entries(formData.equipamentos || {}).map(([key, value]) => (
                                value && (
                                    <div key={key} className="flex items-center">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-900">{key}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Termos e Condições
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="termos_aceitos"
                                    name="termos_aceitos"
                                    checked={formData.termos_aceitos || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Etapa7; 