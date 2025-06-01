import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes } from "react-icons/fa";

function ReservaModal({ isOpen, onClose, space, onSubmit }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        calculateTotalHours();
    }, [startTime, endTime]);

    const calculateTotalHours = () => {
        if (!startTime || !endTime) {
            setTotalHours(0);
            setTotalPrice(0);
            return;
        }

        // Criar datas completas combinando data e hora
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(startTime.getHours(), startTime.getMinutes());

        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

        // Calcular diferença em milissegundos
        const diffMs = endDateTime - startDateTime;
        
        // Converter para horas (com decimais)
        const diffHours = diffMs / (1000 * 60 * 60);
        
        // Arredondar para 2 casas decimais
        const roundedHours = Math.round(diffHours * 100) / 100;
        
        setTotalHours(roundedHours);
        setTotalPrice(roundedHours * (space?.price_per_hour || 0));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedDate || !startTime || !endTime) {
            return;
        }
        onSubmit({
            date: selectedDate,
            startTime,
            endTime,
            totalHours,
            totalPrice
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#363636]">Reservar Espaço</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data
                        </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholderText="Selecione uma data"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Horário de Início
                            </label>
                            <DatePicker
                                selected={startTime}
                                onChange={setStartTime}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption="Horário"
                                dateFormat="HH:mm"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholderText="Selecione o horário"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Horário de Término
                            </label>
                            <DatePicker
                                selected={endTime}
                                onChange={setEndTime}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption="Horário"
                                dateFormat="HH:mm"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholderText="Selecione o horário"
                            />
                        </div>
                    </div>

                    {totalHours > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <div className="font-bold text-lg mb-2">Total:</div>
                            <div className="font-bold text-2xl">
                                {formatPrice(totalPrice)}
                                <span className="text-sm font-normal ml-2">
                                    ({totalHours} horas)
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={!selectedDate || !startTime || !endTime || totalHours <= 0}
                            className={`w-full py-2 px-4 rounded-md transition-colors ${
                                !selectedDate || !startTime || !endTime || totalHours <= 0
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