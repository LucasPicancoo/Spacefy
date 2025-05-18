import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigate } from "react-router-dom";
import { rentalService } from "../../services/rentalService";
import { toast } from 'react-toastify';
import { useUser } from "../../Contexts/userContext";

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

function ReservaCard({ space }) {
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { user, isLoggedIn } = useUser();

    const navigate = useNavigate();

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

    const handleRental = async () => {
        try {
            if (!checkInDate || !checkOutDate || !checkInTime || !checkOutTime) {
                toast.error('Por favor, preencha todas as datas e horários');
                return;
            }

            // Verificar se o usuário está logado usando o contexto
            if (!isLoggedIn || !user) {
                toast.error('Você precisa estar logado para fazer uma reserva');
                navigate('/login');
                return;
            }

            setIsLoading(true);

            // Formatar as datas para o formato esperado pelo backend (YYYY-MM-DD)
            const formatDate = (date) => {
                return date.toISOString().split('T')[0];
            };

            // Formatar os horários para o formato HH:mm
            const formatTime = (time) => {
                return time.toTimeString().slice(0, 5);
            };

            const rentalData = {
                userId: user.id,
                spaceId: space._id,
                start_date: formatDate(checkInDate),
                end_date: formatDate(checkOutDate),
                startTime: formatTime(checkInTime),
                endTime: formatTime(checkOutTime),
                value: totalPrice
            };

            await rentalService.createRental(rentalData);
            toast.success('Reserva realizada com sucesso!');
            
            // Limpar os campos após o sucesso
            setCheckInDate(null);
            setCheckOutDate(null);
            setCheckInTime(null);
            setCheckOutTime(null);
            
        } catch (error) {
            toast.error(error.message || 'Erro ao realizar a reserva');
        } finally {
            setIsLoading(false);
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
                    <div className="p-2">
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
                    <button 
                        onClick={handleRental}
                        disabled={isLoading || !checkInDate || !checkOutDate || !checkInTime || !checkOutTime}
                        className={`w-full font-bold py-3 rounded-lg transition-colors cursor-pointer ${
                            isLoading || !checkInDate || !checkOutDate || !checkInTime || !checkOutTime
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-[#00A3FF] text-white hover:bg-[#0088FF]'
                        }`}
                    >
                        {isLoading ? 'Processando...' : 'Alugar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReservaCard; 