import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigate } from "react-router-dom";

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

function ReservaCard() {
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    const navigate = useNavigate();

    const handleCheckInTimeChange = (time) => {
        if (time) {
            const hours = time.getHours();
            const minutes = time.getMinutes();
            const newDate = new Date();
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
            setCheckInTime(newDate);
        } else {
            setCheckInTime(null);
        }
    };

    const handleCheckOutTimeChange = (time) => {
        if (time) {
            const hours = time.getHours();
            const minutes = time.getMinutes();
            const newDate = new Date();
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
            setCheckOutTime(newDate);
        } else {
            setCheckOutTime(null);
        }
    };

    return (
        <div className="w-[340px] flex flex-col gap-6">
            {/* Card do locatário */}
            <div className="bg-white border border-[#E3E3E3] rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden">
                        <img src="/user-icon.png" alt="Foto do perfil" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-medium">Zaylian Vortelli</h3>
                        <div className="flex items-center gap-1">
                            <div className="flex">★★★★★</div>
                            <span className="text-gray-600">(183)</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => navigate('/Perfil_Locatario')} className="w-full mt-4 text-center text-[#00A3FF] hover:underline cursor-pointer">
                    Ver mais sobre o locatario
                </button>
            </div>

            {/* Card de reserva */}
            <div className="bg-white border border-[#E3E3E3] rounded-lg shadow-lg p-6">
                <div className="border border-[#E3E3E3] rounded-lg overflow-hidden">
                    {/* Check-in */}
                    <div className="p-2 border-b border-[#E3E3E3]">
                        <div className="grid grid-cols-[60%_40%] gap-4">
                            <div>
                                <div className="text-[#696868] font-medium text-lg mb-1">Check-in</div>
                                <DatePicker
                                    selected={checkInDate}
                                    onChange={(date) => setCheckInDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="DD/MM/YYYY"
                                    className="text-lg font-medium focus:outline-none cursor-pointer w-full text-black placeholder:text-black placeholder:opacity-100"
                                    minDate={new Date()}
                                />
                            </div>
                            <div className="flex flex-col justify-start pl-7">
                                <div className="text-[#696868] font-medium text-lg mb-1">Hora:</div>
                                <DatePicker
                                    selected={checkInTime}
                                    onChange={handleCheckInTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Hora"
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm"
                                    placeholderText="HH:mm"
                                    className="text-lg font-medium focus:outline-none cursor-pointer w-24 placeholder:text-black placeholder:opacity-100"
                                    popperPlacement="bottom-end"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Check-out */}
                    <div className="p-2 border-b border-gray-200">
                        <div className="grid grid-cols-[60%_40%] gap-4">
                            <div>
                                <div className="text-[#696868] font-medium text-lg mb-1">Check-out</div>
                                <DatePicker
                                    selected={checkOutDate}
                                    onChange={(date) => setCheckOutDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="DD/MM/YYYY"
                                    className="text-lg font-medium focus:outline-none cursor-pointer w-full text-black placeholder:text-black placeholder:opacity-100"
                                    minDate={checkInDate || new Date()}
                                />
                            </div>
                            <div className="flex flex-col justify-start pl-7">
                                <div className="text-[#696868] font-medium text-lg mb-1">Hora:</div>
                                <DatePicker
                                    selected={checkOutTime}
                                    onChange={handleCheckOutTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Hora"
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm"
                                    placeholderText="HH:mm"
                                    className="text-gray-900 text-lg font-medium focus:outline-none cursor-pointer w-24 placeholder:text-black placeholder:opacity-100"
                                    popperPlacement="bottom-end"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pessoas */}
                    <div className="p-4">
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-lg">Pessoas:</div>
                            <button className="flex items-center text-gray-900 text-lg font-medium">
                                4 pessoas
                                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="font-bold text-lg mb-2">Total:</div>
                    <div className="font-bold text-2xl mb-4">R$ 1250,00 <span className="text-xs font-normal">/hora</span></div>
                    <button className="w-full bg-[#00A3FF] text-white font-bold py-3 rounded-lg hover:bg-[#0088FF] transition-colors">
                        Alugar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReservaCard; 