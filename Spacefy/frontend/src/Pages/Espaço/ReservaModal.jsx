import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import "./custom-datepicker.css";
import { blockedDatesService } from "../../services/blockedDatesService";
import { rentalService } from "../../services/rentalService";

function ReservaModal({ isOpen, onClose, space, onSubmit }) {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [blockedDates, setBlockedDates] = useState([]);
    const [rentedDates, setRentedDates] = useState([]);
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
            fetchRentedDates();
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
            const dates = await blockedDatesService.getBlockedDatesBySpaceId(space._id);
            setBlockedDates(dates.blocked_dates || []);
        } catch (error) {
            console.error("Erro ao buscar datas bloqueadas:", error);
        }
    };

    const fetchRentedDates = async () => {
        try {
            const response = await rentalService.getRentedDatesBySpace(space._id);
            console.log('Resposta do backend:', response); // Debug
            console.log('Datas reservadas:', response.dates); // Debug
            setRentedDates(response.dates || []);
        } catch (error) {
            console.error("Erro ao buscar datas reservadas:", error);
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

        // Se a data estiver bloqueada manualmente, retorna true
        if (isBlockedDate) return true;

        // Verifica se o dia da semana está configurado no espaço
        const dayOfWeek = date.getDay();
        const dayName = Object.keys(diasSemana).find(key => diasSemana[key] === dayOfWeek);
        const isDayConfigured = space?.weekly_days?.some(day => day.day === dayName);

        // Se o dia não estiver configurado, bloqueia
        if (!isDayConfigured) return true;

        return false;
    };

    const calculateTotalHours = () => {
        if (!startTime || !endTime) {
            setTotalHours(0);
            setTotalPrice(0);
            return;
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

    const hasBlockedDatesInRange = (start, end) => {
        if (!start || !end) return false;
        
        const currentDate = new Date(start);
        while (currentDate <= end) {
            // Verifica se a data está bloqueada
            if (isDateBlocked(currentDate)) {
                return true;
            }

            // Verifica se existe reserva nesta data
            const dateStr = currentDate.toISOString().split('T')[0];
            const rentedDate = rentedDates.find(date => date.date === dateStr);
            
            if (rentedDate) {
                // Se for a data inicial, verifica se o horário de início é anterior ao horário reservado
                if (currentDate.getTime() === start.getTime() && startTime) {
                    const isStartTimeBlocked = rentedDate.times.some(timeRange => {
                        const [startHour, startMinute] = timeRange.startTime.split(':').map(Number);
                        const startInMinutes = startHour * 60 + startMinute;
                        const selectedStartInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
                        
                        return selectedStartInMinutes < startInMinutes;
                    });
                    
                    if (isStartTimeBlocked) {
                        return true;
                    }
                }
                
                // Se for a data final, verifica se o horário de término é posterior ao horário reservado
                if (currentDate.getTime() === end.getTime() && endTime) {
                    const isEndTimeBlocked = rentedDate.times.some(timeRange => {
                        const [endHour, endMinute] = timeRange.endTime.split(':').map(Number);
                        const endInMinutes = endHour * 60 + endMinute;
                        const selectedEndInMinutes = endTime.getHours() * 60 + endTime.getMinutes();
                        
                        return selectedEndInMinutes > endInMinutes;
                    });
                    
                    if (isEndTimeBlocked) {
                        return true;
                    }
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }
        return false;
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

    const handleDateRangeChange = (dates) => {
        const [start, end] = dates;
        
        // Verifica se o espaço tem horário noturno
        const isOvernight = hasOvernightSchedule();
        
        // Se não for horário noturno e tentar selecionar datas diferentes, mantém apenas a primeira data
        if (!isOvernight && start && end && start.getDate() !== end.getDate()) {
            setDateRange([start, start]);
            setDateRangeError("Não é possível selecionar datas diferentes. O espaço só pode ser alugado no mesmo dia.");
            return;
        }

        setDateRange(dates);
        
        if (start && end) {
            if (hasBlockedDatesInRange(start, end)) {
                const currentDate = new Date(start);
                let hasReservation = false;
                
                while (currentDate <= end) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const rentedDate = rentedDates.find(date => date.date === dateStr);
                    
                    if (rentedDate) {
                        hasReservation = true;
                        break;
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                
                if (hasReservation) {
                    setDateRangeError("Existem reservas no intervalo selecionado. Por favor, escolha outro período.");
                } else {
                    setDateRangeError("Existem datas bloqueadas ou não disponíveis no intervalo selecionado.");
                }
                setDateRange([null, null]);
            } else {
                setDateRangeError("");
                // Validar se os horários selecionados estão disponíveis na nova data
                if (startTime && endTime) {
                    const isStartTimeBlocked = isTimeBlocked(startTime);
                    const isEndTimeBlocked = isTimeBlocked(endTime);
                    if (isStartTimeBlocked || isEndTimeBlocked) {
                        setTimeError("Os horários selecionados não estão disponíveis para esta data.");
                        setStartTime(null);
                        setEndTime(null);
                    }
                }
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
            
            // Se o horário de fechamento for menor que o de abertura, significa que atravessa a meia-noite
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

        // Se o horário de término for menor que o de início, assume que é no dia seguinte
        if (endInMinutes <= startInMinutes) {
            endInMinutes += 24 * 60;
        }

        // Verifica se o intervalo é de pelo menos 30 minutos
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

        // Se o horário de término for menor que o de início, assume que é no dia seguinte
        if (endInMinutes <= startInMinutes) {
            endInMinutes += 24 * 60;
        }

        // Verifica se o intervalo é de pelo menos 30 minutos
        if (endInMinutes - startInMinutes < 30) {
            setTimeError("O intervalo mínimo deve ser de 30 minutos");
            return false;
        }

        // Verifica se o horário selecionado conflita com alguma reserva existente
        const selectedDate = startDate.toISOString().split('T')[0];
        const rentedDate = rentedDates.find(date => date.date === selectedDate);

        if (rentedDate) {
            const [rentedStartHour, rentedStartMinute] = rentedDate.startTime.split(':').map(Number);
            const [rentedEndHour, rentedEndMinute] = rentedDate.endTime.split(':').map(Number);
            
            const rentedStartInMinutes = rentedStartHour * 60 + rentedStartMinute;
            const rentedEndInMinutes = rentedEndHour * 60 + rentedEndMinute;

            // Verifica se há sobreposição de horários
            if ((startInMinutes >= rentedStartInMinutes && startInMinutes < rentedEndInMinutes) ||
                (endInMinutes > rentedStartInMinutes && endInMinutes <= rentedEndInMinutes) ||
                (startInMinutes <= rentedStartInMinutes && endInMinutes >= rentedEndInMinutes)) {
                setTimeError("Este horário conflita com uma reserva existente.");
                return false;
            }
        }

        return true;
    };

    const isTimeBlocked = (time) => {
        if (!time || !startDate) return false;

        const selectedDate = startDate.toISOString().split('T')[0];
        const rentedDate = rentedDates.find(date => date.date === selectedDate);

        if (!rentedDate) {
            console.log('Nenhuma reserva encontrada para a data:', selectedDate); // Debug
            return false;
        }

        const timeHour = time.getHours();
        const timeMinute = time.getMinutes();
        const timeInMinutes = timeHour * 60 + timeMinute;

        console.log('Verificando horário:', timeInMinutes, 'para data:', selectedDate); // Debug
        console.log('Reservas existentes:', rentedDate.times); // Debug

        // Verifica se o horário está em algum dos intervalos reservados
        const isBlocked = rentedDate.times.some(timeRange => {
            const [startHour, startMinute] = timeRange.startTime.split(':').map(Number);
            const [endHour, endMinute] = timeRange.endTime.split(':').map(Number);

            const startInMinutes = startHour * 60 + startMinute;
            const endInMinutes = endHour * 60 + endMinute;

            console.log('Comparando com reserva:', startInMinutes, 'até', endInMinutes); // Debug

            // Se o horário de fechamento for menor que o de abertura, significa que atravessa a meia-noite
            if (endInMinutes < startInMinutes) {
                // Para horários noturnos, verifica se o horário está dentro do período reservado
                const isBlocked = (timeInMinutes >= startInMinutes && timeInMinutes <= 24 * 60) || 
                                (timeInMinutes >= 0 && timeInMinutes <= endInMinutes);
                console.log('Horário noturno bloqueado:', isBlocked); // Debug
                return isBlocked;
            }

            // Para horários normais, verifica se está dentro do intervalo reservado
            const isBlocked = timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
            console.log('Horário normal bloqueado:', isBlocked); // Debug
            return isBlocked;
        });

        console.log('Horário bloqueado:', isBlocked); // Debug
        return isBlocked;
    };

    const filterTime = (time) => {
        try {
            if (!time) return false;
            
            // Se não houver horários definidos, permite todos os horários
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

            // Verifica se o horário está em algum dos intervalos permitidos
            const isInOperatingHours = daySchedule.time_ranges.some(range => {
                if (!range.open || !range.close) return true;

                try {
                    const [openHour, openMinute] = range.open.split(':').map(Number);
                    const [closeHour, closeMinute] = range.close.split(':').map(Number);
                    
                    const openInMinutes = openHour * 60 + openMinute;
                    const closeInMinutes = closeHour * 60 + closeMinute;
                    
                    // Se o horário de fechamento for menor que o de abertura, significa que atravessa a meia-noite
                    if (closeInMinutes < openInMinutes) {
                        // Para horários noturnos, permite qualquer horário entre a abertura e o fechamento
                        return timeInMinutes >= openInMinutes || timeInMinutes <= closeInMinutes;
                    }
                    
                    // Para horários normais, verifica se está dentro do intervalo
                    return timeInMinutes >= openInMinutes && timeInMinutes <= closeInMinutes;
                } catch (error) {
                    console.error('Erro ao processar intervalo de horário:', error);
                    return true;
                }
            });

            if (!isInOperatingHours) {
                console.log('Horário fora do período de funcionamento'); // Debug
                return false;
            }

            // Verifica se o horário está em algum dos intervalos já reservados
            if (startDate) {
                const dateStr = startDate.toISOString().split('T')[0];
                const rentedDate = rentedDates.find(date => date.date === dateStr);

                if (rentedDate) {
                    console.log('Verificando reservas para data:', dateStr); // Debug
                    console.log('Reservas existentes:', rentedDate.times); // Debug

                    const isTimeReserved = rentedDate.times.some(timeRange => {
                        const [startHour, startMinute] = timeRange.startTime.split(':').map(Number);
                        const [endHour, endMinute] = timeRange.endTime.split(':').map(Number);
                        
                        const startInMinutes = startHour * 60 + startMinute;
                        const endInMinutes = endHour * 60 + endMinute;

                        console.log('Comparando horário:', timeInMinutes, 'com reserva:', startInMinutes, 'até', endInMinutes); // Debug

                        // Se o horário de fechamento for menor que o de abertura, significa que atravessa a meia-noite
                        if (endInMinutes < startInMinutes) {
                            // Para horários noturnos, verifica se o horário está dentro do período reservado
                            const isReserved = (timeInMinutes >= startInMinutes && timeInMinutes <= 24 * 60) || 
                                             (timeInMinutes >= 0 && timeInMinutes <= endInMinutes);
                            console.log('Horário noturno reservado:', isReserved); // Debug
                            return isReserved;
                        }

                        // Para horários normais, verifica se está dentro do intervalo reservado
                        const isReserved = timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
                        console.log('Horário normal reservado:', isReserved); // Debug
                        return isReserved;
                    });

                    if (isTimeReserved) {
                        console.log('Horário bloqueado por reserva existente'); // Debug
                        return false;
                    }
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl shadow-lg relative">
                <button
                    onClick={handleClose}
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
                                        minTime={new Date(0, 0, 0, 0, 0)}
                                        maxTime={new Date(0, 0, 0, 23, 59)}
                                        timeFormat="HH:mm"
                                        injectTimes={[]}
                                        openToDate={new Date()}
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
                                        minTime={new Date(0, 0, 0, 0, 0)}
                                        maxTime={new Date(0, 0, 0, 23, 59)}
                                        timeFormat="HH:mm"
                                        injectTimes={[]}
                                        openToDate={new Date()}
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