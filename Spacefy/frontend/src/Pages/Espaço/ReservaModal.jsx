import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import "./custom-datepicker.css";
import { blockedDatesService } from "../../services/blockedDatesService";

function ReservaModal({ isOpen, onClose, space, onSubmit }) {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [blockedDates, setBlockedDates] = useState([]);
    const [showBlockedDates, setShowBlockedDates] = useState(false);
    const [dateRangeError, setDateRangeError] = useState("");
    const [timeError, setTimeError] = useState("");

    const diasSemana = {
        'domingo': 0,
        'segunda': 1,
        'terca': 2,
        'quarta': 3,
        'quinta': 4,
        'sexta': 5,
        'sabado': 6
    };

    useEffect(() => {
        calculateTotalHours();
    }, [startTime, endTime, dateRange]);

    useEffect(() => {
        if (isOpen && space?._id) {
            fetchBlockedDates();
        }
    }, [isOpen, space?._id]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const fetchBlockedDates = async () => {
        try {
            const dates = await blockedDatesService.getBlockedDatesBySpaceId(space._id);
            setBlockedDates(dates.blocked_dates || []);
        } catch (error) {
            console.error("Erro ao buscar datas bloqueadas:", error);
        }
    };

    const isDateBlocked = (date) => {
        // Verifica se a data está na lista de datas bloqueadas
        const isBlockedDate = blockedDates.some(blockedDate => {
            const blocked = new Date(blockedDate);
            // Ajusta para o fuso horário local
            const localBlocked = new Date(blocked.getTime() + blocked.getTimezoneOffset() * 60000);
            
            return date.getDate() === localBlocked.getDate() &&
                   date.getMonth() === localBlocked.getMonth() &&
                   date.getFullYear() === localBlocked.getFullYear();
        });

        // Verifica se o dia da semana está permitido
        const dayOfWeek = date.getDay();
        const isAllowedWeekDay = space?.week_days?.some(day => diasSemana[day] === dayOfWeek);

        return isBlockedDate || !isAllowedWeekDay;
    };

    const calculateTotalHours = () => {
        if (!startTime || !endTime) {
            setTotalHours(0);
            setTotalPrice(0);
            return;
        }

        // Se for intervalo de datas, calcular diferença de dias
        let days = 1;
        if (startDate && endDate) {
            const diffTime = Math.abs(endDate - startDate);
            days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        // Criar datas completas combinando data e hora
        const startDateTime = startDate ? new Date(startDate) : null;
        if (startDateTime && startTime) {
            startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
        }
        const endDateTime = endDate ? new Date(endDate) : null;
        if (endDateTime && endTime) {
            endDateTime.setHours(endTime.getHours(), endTime.getMinutes());
        }

        // Calcular diferença em milissegundos
        let diffMs = 0;
        if (startDateTime && endDateTime) {
            diffMs = endDateTime - startDateTime;
        } else if (startTime && endTime) {
            diffMs = endTime - startTime;
        }

        // Converter para horas (com decimais)
        const diffHours = diffMs / (1000 * 60 * 60);
        // Arredondar para 2 casas decimais
        const roundedHours = Math.round(diffHours * 100) / 100;
        // Se for intervalo de dias, multiplicar pelas horas por dia
        const total = days > 1 ? days * roundedHours : roundedHours;

        setTotalHours(total > 0 ? total : 0);
        setTotalPrice((total > 0 ? total : 0) * (space?.price_per_hour || 0));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const isDateRangeValid = startDate instanceof Date && endDate instanceof Date;
    const isTimeValid = startTime instanceof Date && endTime instanceof Date;

    const hasBlockedDatesInRange = (start, end) => {
        if (!start || !end) return false;
        
        const currentDate = new Date(start);
        while (currentDate <= end) {
            if (isDateBlocked(currentDate)) {
                return true;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return false;
    };

    const handleDateRangeChange = (dates) => {
        const [start, end] = dates;
        setDateRange(dates);
        
        if (start && end) {
            if (hasBlockedDatesInRange(start, end)) {
                setDateRangeError("Existem datas bloqueadas ou não disponíveis no intervalo selecionado.");
                setDateRange([null, null]);
            } else {
                setDateRangeError("");
            }
        } else {
            setDateRangeError("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isDateRangeValid || !isTimeValid) {
            return;
        }
        onSubmit({
            startDate,
            endDate,
            startTime,
            endTime,
            totalHours,
            totalPrice
        });
    };

    const isTimeInOperatingHours = (time) => {
        if (!time || !space?.weekly_days) return false;

        const dayOfWeek = startDate ? startDate.getDay() : new Date().getDay();
        const dayName = Object.keys(diasSemana).find(key => diasSemana[key] === dayOfWeek);
        
        const daySchedule = space.weekly_days.find(day => day.day === dayName);
        if (!daySchedule) return false;

        const timeHour = time.getHours();
        const timeMinute = time.getMinutes();
        const timeInMinutes = timeHour * 60 + timeMinute;

        return daySchedule.time_ranges.some(range => {
            const [openHour, openMinute] = range.open.split(':').map(Number);
            const [closeHour, closeMinute] = range.close.split(':').map(Number);
            
            const openInMinutes = openHour * 60 + openMinute;
            const closeInMinutes = closeHour * 60 + closeMinute;
            
            return timeInMinutes >= openInMinutes && timeInMinutes <= closeInMinutes;
        });
    };

    const validateTimeRange = (start, end) => {
        if (!start || !end || !space?.weekly_days) return false;

        const dayOfWeek = startDate ? startDate.getDay() : new Date().getDay();
        const dayName = Object.keys(diasSemana).find(key => diasSemana[key] === dayOfWeek);
        const daySchedule = space.weekly_days.find(day => day.day === dayName);
        
        if (!daySchedule) return false;

        const startHour = start.getHours();
        const startMinute = start.getMinutes();
        const endHour = end.getHours();
        const endMinute = end.getMinutes();
        
        const startInMinutes = startHour * 60 + startMinute;
        const endInMinutes = endHour * 60 + endMinute;

        // Verifica se o horário de início e fim estão dentro do mesmo intervalo de funcionamento
        return daySchedule.time_ranges.some(range => {
            const [openHour, openMinute] = range.open.split(':').map(Number);
            const [closeHour, closeMinute] = range.close.split(':').map(Number);
            
            const openInMinutes = openHour * 60 + openMinute;
            const closeInMinutes = closeHour * 60 + closeMinute;
            
            return startInMinutes >= openInMinutes && 
                   endInMinutes <= closeInMinutes && 
                   startInMinutes < endInMinutes;
        });
    };

    const handleStartTimeChange = (time) => {
        setTimeError("");
        if (!isTimeInOperatingHours(time)) {
            setTimeError("Este horário não está dentro do período de funcionamento.");
            return;
        }
        setStartTime(time);
        if (endTime && !validateTimeRange(time, endTime)) {
            setEndTime(null);
            setTimeError("O horário de término selecionado não é mais válido para este horário de início.");
        }
    };

    const handleEndTimeChange = (time) => {
        setTimeError("");
        if (!isTimeInOperatingHours(time)) {
            setTimeError("Este horário não está dentro do período de funcionamento.");
            return;
        }
        if (startTime && validateTimeRange(startTime, time)) {
            setEndTime(time);
        } else {
            setEndTime(null);
            setTimeError("O horário de término deve estar dentro do mesmo período de funcionamento do horário de início.");
        }
    };

    const filterTime = (time) => {
        return isTimeInOperatingHours(time);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl shadow-lg relative">
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 absolute right-6 top-6 z-10"
                    aria-label="Fechar modal"
                >
                    <FaTimes size={24} />
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#363636] w-full text-center">Selecione as Datas e Horários</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-between">
                        {/* Coluna da Data */}
                        <div className="flex flex-col items-center md:w-1/2">
                            <div className="font-semibold text-lg mb-2 text-center">Selecione o intervalo de datas</div>
                            <DatePicker
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={handleDateRangeChange}
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                className="w-full p-2 border border-gray-300 rounded-md text-center"
                                placeholderText="Selecione o intervalo"
                                calendarClassName="custom-calendar"
                                inline
                                filterDate={date => !isDateBlocked(date)}
                            />
                            {dateRangeError && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-center gap-2">
                                    <FaExclamationTriangle />
                                    {dateRangeError}
                                </div>
                            )}
                            <div className="mt-6 text-xl font-bold text-[#00A3FF] text-center">
                                {space?.price_per_hour ? `R$ ${space.price_per_hour.toFixed(2)}` : '--'}
                                <span className="text-base font-normal text-gray-600">/hora</span>
                            </div>
                        </div>
                        {/* Coluna dos Horários */}
                        <div className="flex flex-col items-center md:w-1/2">
                            <div className="font-semibold text-lg mb-2 text-center">Selecione um horário</div>
                            <div className="flex flex-row gap-4 w-full justify-center">
                                <div className="flex flex-col items-center w-1/2">
                                    <span className="text-[#00A3FF] font-bold mb-1">Início</span>
                                    <DatePicker
                                        selected={startTime}
                                        onChange={handleStartTimeChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        timeCaption="Horário"
                                        dateFormat="HH:mm"
                                        className="w-full p-2 border border-gray-300 rounded-md text-center"
                                        placeholderText="Selecione o horário"
                                        filterTime={filterTime}
                                    />
                                </div>
                                <div className="flex flex-col items-center w-1/2">
                                    <span className="text-[#00A3FF] font-bold mb-1">Término</span>
                                    <DatePicker
                                        selected={endTime}
                                        onChange={handleEndTimeChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        timeCaption="Horário"
                                        dateFormat="HH:mm"
                                        className="w-full p-2 border border-gray-300 rounded-md text-center"
                                        placeholderText="Selecione o horário"
                                        filterTime={filterTime}
                                    />
                                </div>
                            </div>
                            {timeError && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-center gap-2">
                                    <FaExclamationTriangle />
                                    {timeError}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seção de Datas Bloqueadas */}
                    {blockedDates.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                                <FaCalendarAlt className="text-[#00A3FF]" />
                                <h3 className="font-semibold text-[#363636]">Datas Bloqueadas:</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {blockedDates.map((date, index) => (
                                    <div key={index} className="bg-white p-2 rounded text-sm text-center">
                                        {new Date(date).toLocaleDateString('pt-BR')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {totalHours > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md text-center">
                            <div className="font-bold text-lg mb-2">Total:</div>
                            <div className="font-bold text-2xl">
                                {formatPrice(totalPrice)}
                                <span className="text-sm font-normal ml-2">
                                    ({totalHours} horas)
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="mt-6 flex justify-center">
                        <button
                            type="submit"
                            disabled={
                                !isDateRangeValid ||
                                !isTimeValid ||
                                totalHours <= 0
                            }
                            className={`w-full max-w-xs py-3 px-4 rounded-md text-lg font-semibold transition-colors ${
                                !isDateRangeValid ||
                                !isTimeValid ||
                                totalHours <= 0
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-[#00A3FF] text-white hover:bg-[#0088cc]'
                            }`}
                        >
                            Confirmar Reserva
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReservaModal; 