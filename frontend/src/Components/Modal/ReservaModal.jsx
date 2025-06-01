import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes } from "react-icons/fa";

function ReservaModal({ isOpen, onClose, space, onSubmit }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            date: selectedDate,
            startTime,
            endTime
        });
    };

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

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-[#00A3FF] text-white py-2 px-4 rounded-md hover:bg-[#0088cc] transition-colors"
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