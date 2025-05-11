import React from 'react';

const Etapa3 = ({ formData, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'opening_time' || name === 'closing_time') {
            onUpdate({
                ...formData,
                [name]: value
            });
            return;
        }

        if (name === 'price_per_hour') {
            onUpdate({
                ...formData,
                [name]: parseFloat(value)
            });
            return;
        }

        // Se for um checkbox de disponibilidade
        if (name.startsWith('week_days.')) {
            const day = name.split('.')[1];
            const currentDays = formData.week_days || [];
            
            if (checked) {
                onUpdate({
                    ...formData,
                    week_days: [...currentDays, day]
                });
            } else {
                onUpdate({
                    ...formData,
                    week_days: currentDays.filter(d => d !== day)
                });
            }
        }
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
                                    name={`week_days.${dia.id}`}
                                    checked={formData.week_days?.includes(dia.id) || false}
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
                        <label htmlFor="opening_time" className="block text-sm font-medium text-gray-700">
                            Horário de Abertura
                        </label>
                        <input
                            type="time"
                            name="opening_time"
                            id="opening_time"
                            value={formData.opening_time || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-text"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="closing_time" className="block text-sm font-medium text-gray-700">
                            Horário de Fechamento
                        </label>
                        <input
                            type="time"
                            name="closing_time"
                            id="closing_time"
                            value={formData.closing_time || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-text"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="price_per_hour" className="block text-sm font-medium text-gray-700">
                        Preço por Hora (R$)
                    </label>
                    <input
                        type="number"
                        name="price_per_hour"
                        id="price_per_hour"
                        value={formData.price_per_hour || ''}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-text"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default Etapa3; 