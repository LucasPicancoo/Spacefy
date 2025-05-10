import React from 'react';

const Etapa3 = ({ formData, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldName = name.split('.')[1]; // Pega o nome do dia da semana
        onUpdate({
            disponibilidade: {
                ...formData.disponibilidade,
                [fieldName]: type === 'checkbox' ? checked : value
            }
        });
    };

    const diasSemana = [
        { id: 'domingo', label: 'Domingo' },
        { id: 'segunda', label: 'Segunda-feira' },
        { id: 'terca', label: 'Terça-feira' },
        { id: 'quarta', label: 'Quarta-feira' },
        { id: 'quinta', label: 'Quinta-feira' },
        { id: 'sexta', label: 'Sexta-feira' },
        { id: 'sabado', label: 'Sábado' }
    ];

    return (
        <div className="space-y-8">
            <style>
                {`
                    input[type="time"]::-webkit-calendar-picker-indicator {
                        cursor: pointer;
                    }
                `}
            </style>
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Disponibilidade e Horários
                </h3>
                <p className="text-gray-600 mb-6">
                    Defina os dias e horários em que seu espaço estará disponível para locação.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Dias da Semana
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {diasSemana.map((dia) => (
                            <div key={dia.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={dia.id}
                                    name={`disponibilidade.${dia.id}`}
                                    checked={formData.disponibilidade?.[dia.id] ?? false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label
                                    htmlFor={dia.id}
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    {dia.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="horario_inicio" className="block text-sm font-medium text-gray-700">
                            Horário de Abertura
                        </label>
                        <input
                            type="time"
                            name="horario_inicio"
                            id="horario_inicio"
                            value={formData.horario_inicio || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-text"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="horario_fim" className="block text-sm font-medium text-gray-700">
                            Horário de Fechamento
                        </label>
                        <input
                            type="time"
                            name="horario_fim"
                            id="horario_fim"
                            value={formData.horario_fim || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-text"
                            required
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Etapa3; 