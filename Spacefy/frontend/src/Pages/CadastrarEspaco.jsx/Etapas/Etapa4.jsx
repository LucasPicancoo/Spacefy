import React, { useState, useMemo } from 'react';

// Array com os dias da semana para os checkboxes
const DIAS_SEMANA = [
    { id: 'domingo', label: 'Domingo', order: 0 },
    { id: 'segunda', label: 'Segunda-feira', order: 1 },
    { id: 'terca', label: 'Terça-feira', order: 2 },
    { id: 'quarta', label: 'Quarta-feira', order: 3 },
    { id: 'quinta', label: 'Quinta-feira', order: 4 },
    { id: 'sexta', label: 'Sexta-feira', order: 5 },
    { id: 'sabado', label: 'Sábado', order: 6 }
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

// Componente para horários de um dia específico
const HorariosDia = ({ dia, timeRanges, onAddTimeRange, onRemoveTimeRange, onUpdateTimeRange }) => {
    // Função para validar o formato do horário
    const isValidTimeFormat = (time) => {
        if (!time) return false;
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    };

    // Função para validar se o horário de fechamento é posterior ao de abertura
    const isValidTimeRange = (open, close) => {
        if (!open || !close) return false;
        const openTime = new Date(`2000-01-01T${open}`);
        const closeTime = new Date(`2000-01-01T${close}`);
        return closeTime > openTime;
    };

    // Função para validar se o horário se sobrepõe a outros horários
    const hasTimeOverlap = (newOpen, newClose, currentIndex) => {
        return timeRanges.some((range, index) => {
            if (index === currentIndex) return false;
            const rangeOpen = new Date(`2000-01-01T${range.open}`);
            const rangeClose = new Date(`2000-01-01T${range.close}`);
            const newOpenTime = new Date(`2000-01-01T${newOpen}`);
            const newCloseTime = new Date(`2000-01-01T${newClose}`);
            
            return (
                (newOpenTime >= rangeOpen && newOpenTime < rangeClose) ||
                (newCloseTime > rangeOpen && newCloseTime <= rangeClose) ||
                (newOpenTime <= rangeOpen && newCloseTime >= rangeClose)
            );
        });
    };

    // Função para validar e atualizar o horário
    const handleTimeUpdate = (index, field, value) => {
        const currentRange = timeRanges[index];
        const newRange = { ...currentRange, [field]: value };

        // Se ambos os horários estiverem preenchidos, valida
        if (newRange.open && newRange.close) {
            if (!isValidTimeFormat(newRange.open) || !isValidTimeFormat(newRange.close)) {
                alert('Por favor, insira um horário válido no formato HH:mm');
                return;
            }

            if (!isValidTimeRange(newRange.open, newRange.close)) {
                alert('O horário de fechamento deve ser posterior ao de abertura');
                return;
            }

            if (hasTimeOverlap(newRange.open, newRange.close, index)) {
                alert('Este horário se sobrepõe a outro horário já definido');
                return;
            }
        }

        onUpdateTimeRange(dia.id, index, field, value);
    };

    return (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{dia.label}</h4>
            {timeRanges.map((range, index) => (
                <div key={index} className="flex items-center space-x-4">
                    <CampoHorario
                        label="Abertura"
                        id={`${dia.id}-open-${index}`}
                        name="open"
                        value={range.open}
                        onChange={(e) => handleTimeUpdate(index, 'open', e.target.value)}
                    />
                    <CampoHorario
                        label="Fechamento"
                        id={`${dia.id}-close-${index}`}
                        name="close"
                        value={range.close}
                        onChange={(e) => handleTimeUpdate(index, 'close', e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => onRemoveTimeRange(dia.id, index)}
                        className="mt-6 px-3 py-2 text-sm text-red-600 hover:text-red-800"
                    >
                        Remover
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={() => onAddTimeRange(dia.id)}
                className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
            >
                + Adicionar Horário
            </button>
        </div>
    );
};

// Componente principal da Etapa 4 - Disponibilidade e Horários
const Etapa4 = ({ formData, onUpdate }) => {
    const [selectedDays, setSelectedDays] = useState(
        formData.weekly_days || DIAS_SEMANA.map(dia => ({
            day: dia.id,
            time_ranges: []
        }))
    );

    // Ordena os dias selecionados de acordo com a ordem da semana
    const sortedSelectedDays = useMemo(() => {
        return [...selectedDays].sort((a, b) => {
            const dayA = DIAS_SEMANA.find(dia => dia.id === a.day);
            const dayB = DIAS_SEMANA.find(dia => dia.id === b.day);
            return dayA.order - dayB.order;
        });
    }, [selectedDays]);

    // Função para gerenciar mudanças nos checkboxes dos dias
    const handleDayChange = (e) => {
        const { id, checked } = e.target;
        const updatedDays = [...selectedDays];
        const dayIndex = updatedDays.findIndex(d => d.day === id);

        if (checked && dayIndex === -1) {
            updatedDays.push({
                day: id,
                time_ranges: []
            });
        } else if (!checked && dayIndex !== -1) {
            updatedDays.splice(dayIndex, 1);
        }

        setSelectedDays(updatedDays);
        onUpdate({
            ...formData,
            weekly_days: updatedDays
        });
    };

    // Função para adicionar um novo horário para um dia
    const handleAddTimeRange = (dayId) => {
        const updatedDays = selectedDays.map(day => {
            if (day.day === dayId) {
                // Verifica se já existe um horário vazio
                const hasEmptyTimeRange = day.time_ranges.some(
                    range => !range.open || !range.close
                );
                
                if (hasEmptyTimeRange) {
                    alert('Por favor, complete o horário atual antes de adicionar um novo');
                    return day;
                }

                return {
                    ...day,
                    time_ranges: [...day.time_ranges, { open: '', close: '' }]
                };
            }
            return day;
        });

        setSelectedDays(updatedDays);
        onUpdate({
            ...formData,
            weekly_days: updatedDays
        });
    };

    // Função para remover um horário de um dia
    const handleRemoveTimeRange = (dayId, index) => {
        const updatedDays = selectedDays.map(day => {
            if (day.day === dayId) {
                return {
                    ...day,
                    time_ranges: day.time_ranges.filter((_, i) => i !== index)
                };
            }
            return day;
        });

        setSelectedDays(updatedDays);
        onUpdate({
            ...formData,
            weekly_days: updatedDays
        });
    };

    // Função para atualizar um horário específico
    const handleUpdateTimeRange = (dayId, index, field, value) => {
        const updatedDays = selectedDays.map(day => {
            if (day.day === dayId) {
                const updatedRanges = [...day.time_ranges];
                updatedRanges[index] = {
                    ...updatedRanges[index],
                    [field]: value
                };
                return {
                    ...day,
                    time_ranges: updatedRanges
                };
            }
            return day;
        });

        setSelectedDays(updatedDays);
        onUpdate({
            ...formData,
            weekly_days: updatedDays
        });
    };

    // Função para atualizar o preço
    const handlePriceChange = (e) => {
        onUpdate({
            ...formData,
            price_per_hour: parseFloat(e.target.value)
        });
    };

    // Função para replicar os horários do primeiro dia para os demais
    const handleReplicateTimeRanges = () => {
        if (selectedDays.length < 2) {
            return; // Precisa ter pelo menos 2 dias selecionados
        }

        const firstDayTimeRanges = selectedDays[0].time_ranges;
        if (firstDayTimeRanges.length === 0) {
            return; // O primeiro dia precisa ter horários definidos
        }

        const updatedDays = selectedDays.map((day, index) => {
            if (index === 0) return day; // Mantém o primeiro dia como está
            return {
                ...day,
                time_ranges: [...firstDayTimeRanges] // Replica os horários
            };
        });

        setSelectedDays(updatedDays);
        onUpdate({
            ...formData,
            weekly_days: updatedDays
        });
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
                {/* Campo de preço */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <CampoPreco
                        value={formData.price_per_hour}
                        onChange={handlePriceChange}
                    />
                </div>

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
                                checked={selectedDays.some(d => d.day === dia.id)}
                                onChange={handleDayChange}
                            />
                        ))}
                    </div>
                </div>

                {/* Botão para replicar horários */}
                {selectedDays.length > 1 && (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleReplicateTimeRanges}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Replicar Horários do Primeiro Dia
                        </button>
                    </div>
                )}

                {/* Seção de horários para cada dia selecionado (agora ordenados) */}
                {sortedSelectedDays.map((dayData) => {
                    const dia = DIAS_SEMANA.find(d => d.id === dayData.day);
                    return (
                        <HorariosDia
                            key={dayData.day}
                            dia={dia}
                            timeRanges={dayData.time_ranges}
                            onAddTimeRange={handleAddTimeRange}
                            onRemoveTimeRange={handleRemoveTimeRange}
                            onUpdateTimeRange={handleUpdateTimeRange}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Etapa4; 