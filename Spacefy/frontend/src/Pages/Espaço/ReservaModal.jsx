import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import "./custom-datepicker.css";
import { rentalService } from "../../services/rentalService";
import { blockedDatesService } from "../../services/blockedDatesService";

function ReservaModal({ isOpen, onClose, space, onSubmit }) {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [dateRangeError, setDateRangeError] = useState("");
    const [timeError, setTimeError] = useState("");
    const [blockedDates, setBlockedDates] = useState([]);
    const [rentedDates, setRentedDates] = useState([]);

    const diasSemana = {
        'domingo': 0,
        'segunda': 1,
        'terca': 2,
        'quarta': 3,
        'quinta': 4,
        'sexta': 5,
        'sabado': 6
    };

    const clearFormData = () => {
        setDateRange([null, null]);
        setStartTime(null);
        setEndTime(null);
        setTotalHours(0);
        setTotalPrice(0);
        setDateRangeError("");
        setTimeError("");
    };

    useEffect(() => {
        calculateTotalHours();
    }, [startTime, endTime, dateRange]);

    useEffect(() => {
        if (isOpen && space?._id) {
            fetchBlockedDates();
        } else {
            clearFormData();
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
            const response = await blockedDatesService.getBlockedDatesBySpaceId(space._id);
            setBlockedDates(response.blocked_dates || []);
            setRentedDates(response.rented_dates || []);
        } catch (error) {
            console.error("Erro ao buscar datas bloqueadas:", error);
        }
    };

    const calculateTotalHours = () => {
        if (!startTime || !endTime) {
            setTotalHours(0);
            setTotalPrice(0);
            return;
        }

        const startDateTime = startDate ? new Date(startDate) : null;
        if (startDateTime && startTime) {
            startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
        }
        const endDateTime = endDate ? new Date(endDate) : null;
        if (endDateTime && endTime) {
            endDateTime.setHours(endTime.getHours(), endTime.getMinutes());
        }

        let diffMs = 0;
        if (startDateTime && endDateTime) {
            diffMs = endDateTime - startDateTime;
        } else if (startTime && endTime) {
            diffMs = endTime - startTime;
        }

        const diffHours = diffMs / (1000 * 60 * 60);
        const roundedHours = Math.round(diffHours * 100) / 100;

        setTotalHours(roundedHours > 0 ? roundedHours : 0);
        setTotalPrice((roundedHours > 0 ? roundedHours : 0) * (space?.price_per_hour || 0));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const isDateRangeValid = startDate instanceof Date && endDate instanceof Date;
    const isTimeValid = startTime instanceof Date && endTime instanceof Date;

    const isDateBlocked = (date) => {
        // Bloqueia se a data estiver em blocked_dates
        const dateStr = date.toISOString().split('T')[0];
        if (blockedDates.includes(dateStr)) return true;

        // Bloqueia se não for dia de funcionamento
        const dayOfWeek = date.getDay();
        const dayName = Object.keys(diasSemana).find(key => diasSemana[key] === dayOfWeek);
        const isDayConfigured = space?.weekly_days?.some(day => day.day === dayName);

        return !isDayConfigured;
    };

    const handleDateRangeChange = (dates) => {
        const [start, end] = dates;
        
        const isOvernight = hasOvernightSchedule();
        
        if (!isOvernight && start && end && start.getDate() !== end.getDate()) {
            setDateRange([start, start]);
            setDateRangeError("Não é possível selecionar datas diferentes. O espaço só pode ser alugado no mesmo dia.");
            return;
        }

        setDateRange(dates);
        setDateRangeError("");
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
        clearFormData();
    };

    const handleClose = () => {
        clearFormData();
        onClose();
    };

    const isTimeInOperatingHours = (time) => {
        if (!time || !space?.weekly_days || space.weekly_days.length === 0) return true;

        const dayOfWeek = startDate ? startDate.getDay() : new Date().getDay();
        const dayName = Object.keys(diasSemana).find(key => diasSemana[key] === dayOfWeek);
        
        const daySchedule = space.weekly_days.find(day => day.day === dayName);
        if (!daySchedule || !daySchedule.time_ranges || daySchedule.time_ranges.length === 0) return true;

        const timeHour = time.getHours();
        const timeMinute = time.getMinutes();
        const timeInMinutes = timeHour * 60 + timeMinute;

        return daySchedule.time_ranges.some(range => {
            if (!range.open || !range.close) return true;
            
            const [openHour, openMinute] = range.open.split(':').map(Number);
            const [closeHour, closeMinute] = range.close.split(':').map(Number);
            
            const openInMinutes = openHour * 60 + openMinute;
            const closeInMinutes = closeHour * 60 + closeMinute;
            
            if (closeInMinutes < openInMinutes) {
                return timeInMinutes >= openInMinutes || timeInMinutes <= closeInMinutes;
            }
            
            return timeInMinutes >= openInMinutes && timeInMinutes <= closeInMinutes;
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
        
        if (!startTime) {
            setTimeError("Selecione primeiro o horário de início");
            return;
        }

        if (!time) {
            setEndTime(null);
            return;
        }

        const startHour = startTime.getHours();
        const startMinute = startTime.getMinutes();
        const endHour = time.getHours();
        const endMinute = time.getMinutes();
        
        let startInMinutes = startHour * 60 + startMinute;
        let endInMinutes = endHour * 60 + endMinute;

        if (endInMinutes <= startInMinutes) {
            endInMinutes += 24 * 60;
        }

        if (endInMinutes - startInMinutes < 30) {
            setTimeError("O intervalo mínimo deve ser de 30 minutos");
            return;
        }

        setEndTime(time);
        setTimeError("");
    };

    const validateTimeRange = (start, end) => {
        if (!start || !end || !space?.weekly_days) return true;

        const dayOfWeek = startDate ? startDate.getDay() : new Date().getDay();
        const dayName = Object.keys(diasSemana).find(key => diasSemana[key] === dayOfWeek);
        const daySchedule = space.weekly_days.find(day => day.day === dayName);
        
        if (!daySchedule) return true;

        const startHour = start.getHours();
        const startMinute = start.getMinutes();
        const endHour = end.getHours();
        const endMinute = end.getMinutes();
        
        let startInMinutes = startHour * 60 + startMinute;
        let endInMinutes = endHour * 60 + endMinute;

        if (endInMinutes <= startInMinutes) {
            endInMinutes += 24 * 60;
        }

        if (endInMinutes - startInMinutes < 30) {
            setTimeError("O intervalo mínimo deve ser de 30 minutos");
            return false;
        }

        return true;
    };

    const hasOvernightSchedule = () => {
        if (!space?.weekly_days) return false;

        return space.weekly_days.some(day => {
            return day.time_ranges.some(range => {
                const [openHour, openMinute] = range.open.split(':').map(Number);
                const [closeHour, closeMinute] = range.close.split(':').map(Number);
                
                const openInMinutes = openHour * 60 + openMinute;
                const closeInMinutes = closeHour * 60 + closeMinute;
                
                return closeInMinutes < openInMinutes;
            });
        });
    };

    const filterTime = (time) => {
        try {
            if (!time) return false;

            if (!space?.weekly_days || space.weekly_days.length === 0) {
                return true;
            }

            const dayOfWeek = startDate ? startDate.getDay() : new Date().getDay();
            const dayName = Object.keys(diasSemana).find(key => diasSemana[key] === dayOfWeek);
            const daySchedule = space.weekly_days.find(day => day.day === dayName);
            if (!daySchedule || !daySchedule.time_ranges || daySchedule.time_ranges.length === 0) {
                return true;
            }

            const timeHour = time.getHours();
            const timeMinute = time.getMinutes();
            const timeInMinutes = timeHour * 60 + timeMinute;

            // 1. Verifica se está dentro do horário de funcionamento
            const isInOperatingHours = daySchedule.time_ranges.some(range => {
                if (!range.open || !range.close) return true;
                const [openHour, openMinute] = range.open.split(':').map(Number);
                const [closeHour, closeMinute] = range.close.split(':').map(Number);
                const openInMinutes = openHour * 60 + openMinute;
                const closeInMinutes = closeHour * 60 + closeMinute;
                if (closeInMinutes < openInMinutes) {
                    return timeInMinutes >= openInMinutes || timeInMinutes <= closeInMinutes;
                }
                return timeInMinutes >= openInMinutes && timeInMinutes <= closeInMinutes;
            });
            if (!isInOperatingHours) return false;

            // 2. Verifica se existe bloqueio de horário para a data selecionada (rented_dates)
            if (startDate) {
                const dateStr = startDate.toISOString().split('T')[0];
                const rentedDateObj = rentedDates.find(rd => rd.date === dateStr);
                if (rentedDateObj && rentedDateObj.times && rentedDateObj.times.length > 0) {
                    const isBlocked = rentedDateObj.times.some(timeRange => {
                        const [startHour, startMinute] = timeRange.startTime.split(':').map(Number);
                        const [endHour, endMinute] = timeRange.endTime.split(':').map(Number);
                        const startInMinutes = startHour * 60 + startMinute;
                        const endInMinutes = endHour * 60 + endMinute;
                        return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
                    });
                    if (isBlocked) return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Erro ao filtrar horário:', error);
            return true;
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Modal de reserva de espaço"
        >
            <div 
                className="bg-white rounded-lg p-8 w-full max-w-3xl shadow-lg relative"
                role="document"
            >
                <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 absolute right-6 top-6 z-10"
                    aria-label="Fechar modal de reserva"
                >
                    <FaTimes size={24} aria-hidden="true" />
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h2 
                        className="text-2xl font-bold text-[#363636] w-full text-center"
                        aria-label="Selecione as Datas e Horários para sua reserva"
                    >
                        Selecione as Datas e Horários
                    </h2>
                </div>
                <form 
                    onSubmit={handleSubmit} 
                    className="space-y-4"
                    role="form"
                    aria-label="Formulário de reserva"
                >
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-between">
                        {/* Coluna da Data */}
                        <div 
                            className="flex flex-col items-center md:w-1/2"
                            role="group"
                            aria-label="Seleção de datas"
                        >
                            <div 
                                className="font-semibold text-lg mb-2 text-center"
                                aria-label="Selecione o intervalo de datas para sua reserva"
                            >
                                Selecione o intervalo de datas
                            </div>
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
                                aria-label="Seletor de intervalo de datas"
                            />
                            {dateRangeError && (
                                <div 
                                    className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-center gap-2"
                                    role="alert"
                                    aria-label="Erro na seleção de datas"
                                >
                                    <FaExclamationTriangle aria-hidden="true" />
                                    {dateRangeError}
                                </div>
                            )}
                            <div 
                                className="mt-6 text-xl font-bold text-[#00A3FF] text-center"
                                aria-label={`Preço por hora: R$ ${space?.price_per_hour?.toFixed(2) || '--'}`}
                            >
                                {space?.price_per_hour ? `R$ ${space.price_per_hour.toFixed(2)}` : '--'}
                                <span className="text-base font-normal text-gray-600">/hora</span>
                            </div>
                        </div>
                        {/* Coluna dos Horários */}
                        <div 
                            className="flex flex-col items-center md:w-1/2"
                            role="group"
                            aria-label="Seleção de horários"
                        >
                            <div 
                                className="font-semibold text-lg mb-2 text-center"
                                aria-label="Selecione os horários de início e término"
                            >
                                Selecione um horário
                            </div>
                            <div className="flex flex-row gap-4 w-full justify-center">
                                <div 
                                    className="flex flex-col items-center w-1/2"
                                    role="group"
                                    aria-label="Horário de início"
                                >
                                    <span 
                                        className="text-[#00A3FF] font-bold mb-1"
                                        aria-label="Horário de início da reserva"
                                    >
                                        Início
                                    </span>
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
                                        minTime={new Date(0, 0, 0, 0, 0)}
                                        maxTime={new Date(0, 0, 0, 23, 59)}
                                        timeFormat="HH:mm"
                                        injectTimes={[]}
                                        openToDate={new Date()}
                                        aria-label="Seletor de horário de início"
                                    />
                                </div>
                                <div 
                                    className="flex flex-col items-center w-1/2"
                                    role="group"
                                    aria-label="Horário de término"
                                >
                                    <span 
                                        className="text-[#00A3FF] font-bold mb-1"
                                        aria-label="Horário de término da reserva"
                                    >
                                        Término
                                    </span>
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
                                        minTime={new Date(0, 0, 0, 0, 0)}
                                        maxTime={new Date(0, 0, 0, 23, 59)}
                                        timeFormat="HH:mm"
                                        injectTimes={[]}
                                        openToDate={new Date()}
                                        aria-label="Seletor de horário de término"
                                    />
                                </div>
                            </div>
                            {timeError && (
                                <div 
                                    className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-center gap-2"
                                    role="alert"
                                    aria-label="Erro na seleção de horários"
                                >
                                    <FaExclamationTriangle aria-hidden="true" />
                                    {timeError}
                                </div>
                            )}
                        </div>
                    </div>

                    {totalHours > 0 && (
                        <div 
                            className="mt-4 p-4 bg-gray-50 rounded-md text-center"
                            role="status"
                            aria-label={`Total da reserva: ${formatPrice(totalPrice)} por ${totalHours} horas`}
                        >
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
                            aria-label="Confirmar reserva"
                            aria-disabled={
                                !isDateRangeValid ||
                                !isTimeValid ||
                                totalHours <= 0
                            }
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