import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
const gerarOpcoesHorario = () => {
    const opcoes = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hora = h.toString().padStart(2, '0');
            const minuto = m.toString().padStart(2, '0');
            opcoes.push(`${hora}:${minuto}`);
        }
    }
    return opcoes;
};

const CampoHorario = ({ label, id, name, value, onChange }) => (
    <div role="group" aria-labelledby={`${id}-label`}>
        <label htmlFor={id} id={`${id}-label`} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <select
            name={name}
            id={id}
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-200 bg-white shadow-md focus:border-blue-500 focus:ring-blue-500 cursor-pointer text-base py-2 px-3"
            required
            aria-label={`Selecionar ${label.toLowerCase()}`}
        >
            <option value="">Selecione...</option>
            {gerarOpcoesHorario().map((opcao) => (
                <option key={opcao} value={opcao}>{opcao}</option>
            ))}
        </select>
    </div>
);

// Componente para campo de preço
const CampoPreco = ({ value, onChange }) => {
    const formatarPreco = (valor) => {
        if (!valor) return 'R$ 0,00';
        return `R$ ${parseFloat(valor).toFixed(2)}`;
    };

    const calcularValorLiquido = (valor) => {
        if (!valor) return 0;
        return valor * 0.90; // 90% do valor total (100% - 10% de comissão)
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
        <div role="group" aria-label="Campo de preço por hora">
            <input
                type="text"
                name="price_per_hour"
                id="price_per_hour"
                value={formatarPreco(value)}
                onChange={handlePrecoChange}
                placeholder="Digite o valor por hora"
                className="mt-1 block w-full rounded-md border border-gray-200 bg-white shadow-md focus:border-blue-500 focus:ring-blue-500 cursor-text text-lg py-3 px-4 placeholder-gray-400"
                required
                aria-label="Valor por hora"
            />
            <div className="mt-2 text-sm text-gray-600" role="status" aria-label="Informação sobre comissão">
                <p>Após a comissão do site (10%), você receberá: <span className="font-semibold text-green-600">{formatarPreco(calcularValorLiquido(value))}</span> por hora</p>
            </div>
        </div>
    );
};

// Componente para checkbox de dia da semana
const CheckboxDia = ({ dia, checked, onChange }) => (
    <div className="flex items-center" role="checkbox" aria-checked={checked}>
        <input
            type="checkbox"
            id={dia.id}
            name={`week_days.${dia.id}`}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            aria-label={`Selecionar ${dia.label}`}
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
    // Função para obter o próximo dia da semana
    const getNextDay = (currentDay) => {
        const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        const currentIndex = days.indexOf(currentDay);
        const nextIndex = (currentIndex + 1) % 7;
        return days[nextIndex];
    };

    // Função para formatar o nome do dia
    const formatDayName = (dayId) => {
        const dayNames = {
            'domingo': 'Domingo',
            'segunda': 'Segunda-feira',
            'terca': 'Terça-feira',
            'quarta': 'Quarta-feira',
            'quinta': 'Quinta-feira',
            'sexta': 'Sexta-feira',
            'sabado': 'Sábado'
        };
        return dayNames[dayId];
    };

    // Função para verificar se o horário de fechamento é no dia seguinte
    const isNextDay = (open, close) => {
        if (!open || !close) return false;
        const openTime = new Date(`2000-01-01T${open}`);
        const closeTime = new Date(`2000-01-01T${close}`);
        return closeTime <= openTime;
    };

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
        
        // Se o horário de fechamento for menor que o de abertura, assumimos que é no dia seguinte
        if (closeTime <= openTime) {
            closeTime.setDate(closeTime.getDate() + 1);
        }
        
        return true;
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
        <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200" role="region" aria-label={`Horários para ${dia.label}`}>
            <h4 className="text-xl font-semibold text-gray-900" id={`${dia.id}-title`}>{dia.label}</h4>
            <div role="list" aria-labelledby={`${dia.id}-title`}>
                {timeRanges.map((range, index) => (
                    <div key={index} className="flex items-center space-x-4" role="listitem">
                        <div>
                            <CampoHorario
                                label="Abertura"
                                id={`${dia.id}-open-${index}`}
                                name="open"
                                value={range.open}
                                onChange={(e) => handleTimeUpdate(index, 'open', e.target.value)}
                            />
                            <span className="text-sm text-gray-500 mt-1 block" aria-hidden="true">
                                {formatDayName(dia.id)}
                            </span>
                        </div>
                        <div>
                            <CampoHorario
                                label="Fechamento"
                                id={`${dia.id}-close-${index}`}
                                name="close"
                                value={range.close}
                                onChange={(e) => handleTimeUpdate(index, 'close', e.target.value)}
                            />
                            <span className="text-sm text-gray-500 mt-1 block" aria-hidden="true">
                                {isNextDay(range.open, range.close) ? formatDayName(getNextDay(dia.id)) : formatDayName(dia.id)}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemoveTimeRange(dia.id, index)}
                            className="mt-6 px-3 py-2 text-sm text-red-600 hover:text-red-800"
                            aria-label={`Remover horário ${index + 1} de ${dia.label}`}
                        >
                            Remover
                        </button>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={() => onAddTimeRange(dia.id)}
                className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                aria-label={`Adicionar novo horário para ${dia.label}`}
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
            toast.error('Selecione pelo menos dois dias para replicar os horários');
            return;
        }

        // Encontra o primeiro dia selecionado na ordem da semana
        const firstSelectedDay = sortedSelectedDays[0];
        
        if (!firstSelectedDay.time_ranges || firstSelectedDay.time_ranges.length === 0) {
            toast.error('O primeiro dia selecionado precisa ter horários definidos');
            return;
        }

        const updatedDays = selectedDays.map(day => {
            if (day.day === firstSelectedDay.day) return day; // Mantém o primeiro dia como está
            return {
                ...day,
                time_ranges: JSON.parse(JSON.stringify(firstSelectedDay.time_ranges)) // Cria uma cópia profunda dos horários
            };
        });

        setSelectedDays(updatedDays);
        onUpdate({
            ...formData,
            weekly_days: updatedDays
        });

        toast.success('Horários replicados com sucesso!');
    };

    return (
        <div className="space-y-8" role="form" aria-label="Etapa 4: Disponibilidade e Horários">
            {/* Campo de preço */}
            <div role="region" aria-label="Configuração de preço">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2" id="preco-titulo">
                    Preço por Hora
                </h3>
                <p className="text-gray-600 mb-3" role="doc-subtitle">
                    Defina o valor que será cobrado por hora de utilização do espaço.
                </p>
                <div className="p-4 rounded-lg">
                    <CampoPreco
                        value={formData.price_per_hour}
                        onChange={handlePriceChange}
                    />
                </div>
            </div>

            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4" id="disponibilidade-titulo">
                    Disponibilidade e Horários
                </h3>
                <p className="text-gray-600 mb-6" role="doc-subtitle">
                    Defina os dias e horários em que seu espaço estará disponível para locação.
                </p>
            </div>

            <div className="space-y-6">
                {/* Seção de dias da semana */}
                <div role="region" aria-labelledby="disponibilidade-titulo">
                    <h4 className="text-lg font-medium text-gray-900 mb-4" id="dias-titulo">
                        Dias da Semana
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" role="group" aria-labelledby="dias-titulo">
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
                            aria-label="Replicar horários do primeiro dia selecionado para os demais dias"
                        >
                            Replicar Horários do Primeiro Dia
                        </button>
                    </div>
                )}

                {/* Seção de horários para cada dia selecionado */}
                <div role="region" aria-label="Horários configurados">
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
        </div>
    );
};

export default Etapa4; 