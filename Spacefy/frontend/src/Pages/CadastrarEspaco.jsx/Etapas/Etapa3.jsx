import React from 'react';

// Array com os dias da semana para os checkboxes
const DIAS_SEMANA = [
    { id: 'domingo', label: 'Domingo' },
    { id: 'segunda', label: 'Segunda-feira' },
    { id: 'terca', label: 'Terça-feira' },
    { id: 'quarta', label: 'Quarta-feira' },
    { id: 'quinta', label: 'Quinta-feira' },
    { id: 'sexta', label: 'Sexta-feira' },
    { id: 'sabado', label: 'Sábado' }
];

// Componente para campos de horário
const CampoHorario = ({ label, id, name, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            type="time"
            name={name}
            id={id}
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-text"
            required
        />
    </div>
);

// Componente para campo de preço
const CampoPreco = ({ value, onChange }) => {
    const formatarPreco = (valor) => {
        if (!valor) return '';
        return `R$ ${parseFloat(valor).toFixed(2)}`;
    };

    const handlePrecoChange = (e) => {
        const valor = e.target.value.replace(/[^\d]/g, '');
        const valorNumerico = valor ? parseFloat(valor) / 100 : '';
        onChange({
            target: {
                name: 'price_per_hour',
                value: valorNumerico
            }
        });
    };

    return (
        <div>
            <label htmlFor="price_per_hour" className="block text-sm font-medium text-gray-700">
                Preço por Hora
            </label>
            <input
                type="text"
                name="price_per_hour"
                id="price_per_hour"
                value={formatarPreco(value)}
                onChange={handlePrecoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-text"
                required
            />
        </div>
    );
};

// Componente para checkbox de dia da semana
const CheckboxDia = ({ dia, checked, onChange }) => (
    <div className="flex items-center">
        <input
            type="checkbox"
            id={dia.id}
            name={`week_days.${dia.id}`}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
        />
        <label
            htmlFor={dia.id}
            className="ml-2 block text-sm text-gray-900"
        >
            {dia.label}
        </label>
    </div>
);

// Componente principal da Etapa 3 - Disponibilidade e Horários
const Etapa3 = ({ formData, onUpdate }) => {
    // Função para gerenciar mudanças nos campos
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Atualiza horários de abertura e fechamento
        if (name === 'opening_time' || name === 'closing_time') {
            onUpdate({
                ...formData,
                [name]: value
            });
            return;
        }

        // Atualiza preço por hora
        if (name === 'price_per_hour') {
            onUpdate({
                ...formData,
                [name]: parseFloat(value)
            });
            return;
        }

        // Atualiza dias da semana selecionados
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

    return (
        <div className="space-y-8">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Disponibilidade e Horários
                </h3>
                <p className="text-gray-600 mb-6">
                    Defina os dias e horários em que seu espaço estará disponível para locação.
                </p>
            </div>

            <div className="space-y-6">
                {/* Seção de dias da semana */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Dias da Semana
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {DIAS_SEMANA.map((dia) => (
                            <CheckboxDia
                                key={dia.id}
                                dia={dia}
                                checked={formData.week_days?.includes(dia.id) || false}
                                onChange={handleChange}
                            />
                        ))}
                    </div>
                </div>

                {/* Seção de horários */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CampoHorario
                        label="Horário de Abertura"
                        id="opening_time"
                        name="opening_time"
                        value={formData.opening_time}
                        onChange={handleChange}
                    />

                    <CampoHorario
                        label="Horário de Fechamento"
                        id="closing_time"
                        name="closing_time"
                        value={formData.closing_time}
                        onChange={handleChange}
                    />
                </div>

                {/* Campo de preço */}
                <CampoPreco
                    value={formData.price_per_hour}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default Etapa3; 