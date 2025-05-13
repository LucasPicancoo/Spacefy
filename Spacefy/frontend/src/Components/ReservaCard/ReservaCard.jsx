import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigate } from "react-router-dom";

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

function ReservaCard({ space }) {
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
    const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
    const [customNumber, setCustomNumber] = useState('');
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsPeopleDropdownOpen(false);
                setIsCustomInputOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const calculateTotalHours = () => {
        if (!checkInDate || !checkOutDate || !checkInTime || !checkOutTime) {
            setTotalHours(0);
            setTotalPrice(0);
            return;
        }

        // Criar datas completas combinando data e hora
        const startDateTime = new Date(checkInDate);
        startDateTime.setHours(checkInTime.getHours(), checkInTime.getMinutes());

        const endDateTime = new Date(checkOutDate);
        endDateTime.setHours(checkOutTime.getHours(), checkOutTime.getMinutes());

        // Calcular diferença em milissegundos
        const diffMs = endDateTime - startDateTime;
        
        // Converter para horas (com decimais)
        const diffHours = diffMs / (1000 * 60 * 60);
        
        // Arredondar para 2 casas decimais
        const roundedHours = Math.round(diffHours * 100) / 100;
        
        setTotalHours(roundedHours);
        setTotalPrice(roundedHours * (space?.price_per_hour || 0));
    };

    useEffect(() => {
        calculateTotalHours();
    }, [checkInDate, checkOutDate, checkInTime, checkOutTime, space?.price_per_hour]);

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

    const handleCustomNumberSubmit = (e) => {
        e.preventDefault();
        const num = parseInt(customNumber);
        if (num > 5) {
            setNumberOfPeople(num);
            setIsCustomInputOpen(false);
            setCustomNumber('');
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
                <div className="border border-[#E3E3E3] rounded-lg overflow-visible">
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
                    <div className="p-4 relative">
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-lg">Pessoas:</div>
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsPeopleDropdownOpen(!isPeopleDropdownOpen)}
                                    className="flex items-center text-gray-900 text-lg font-medium hover:text-[#00A3FF] transition-colors cursor-pointer"
                                >
                                    {numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                                    <svg 
                                        className={`w-5 h-5 ml-2 transition-transform duration-300 ${isPeopleDropdownOpen ? 'rotate-180' : ''}`} 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {isPeopleDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => {
                                                    setNumberOfPeople(num);
                                                    setIsPeopleDropdownOpen(false);
                                                }}
                                                className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors cursor-pointer ${
                                                    numberOfPeople === num ? 'text-[#00A3FF] font-medium' : 'text-gray-700'
                                                }`}
                                            >
                                                {num} {num === 1 ? 'pessoa' : 'pessoas'}
                                            </button>
                                        ))}
                                        <div className="border-t border-gray-200">
                                            {isCustomInputOpen ? (
                                                <form onSubmit={handleCustomNumberSubmit} className="p-2">
                                                    <input
                                                        type="number"
                                                        min="6"
                                                        value={customNumber}
                                                        onChange={(e) => setCustomNumber(e.target.value)}
                                                        placeholder="Número de pessoas"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#00A3FF]"
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="w-full mt-2 px-2 py-1 bg-[#00A3FF] text-white rounded hover:bg-[#0088FF] transition-colors"
                                                    >
                                                        Confirmar
                                                    </button>
                                                </form>
                                            ) : (
                                                <button
                                                    onClick={() => setIsCustomInputOpen(true)}
                                                    className="w-full px-4 py-2 text-left text-[#00A3FF] hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    Personalizado
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="font-bold text-lg mb-2">Total:</div>
                    <div className="font-bold text-2xl mb-4">
                        {totalHours > 0 ? (
                            <>
                                {formatPrice(totalPrice)}
                                <span className="text-sm font-normal ml-2">
                                    ({totalHours} horas)
                                </span>
                            </>
                        ) : (
                            <>
                                {formatPrice(space?.price_per_hour || 0)}
                                <span className="text-xs font-normal">/hora</span>
                            </>
                        )}
                    </div>
                    <button className="w-full bg-[#00A3FF] text-white font-bold py-3 rounded-lg hover:bg-[#0088FF] transition-colors cursor-pointer">
                        Alugar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReservaCard; 