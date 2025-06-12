import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rentalService } from "../../services/rentalService";
import { toast } from 'react-toastify';
import { useUser } from "../../Contexts/UserContext";
import ReservaModal from "../../Pages/Espaço/ReservaModal";
import WeatherGoogle from "../../Components/WeatherGoogle/WeatherGoogle";

function ReservaCard({ space, onReservaSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user, isLoggedIn } = useUser();
    const navigate = useNavigate();

    const handleViewLocatorProfile = () => {
        navigate(`/perfil_locador/${space.owner_id}`);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const handleRental = async (reservationData) => {
        try {
            if (!isLoggedIn || !user) {
                toast.error('Você precisa estar logado para fazer uma reserva');
                navigate('/login');
                return;
            }

            // Validação dos campos obrigatórios
            if (!reservationData.startDate || !reservationData.endDate || !reservationData.startTime || !reservationData.endTime || !reservationData.totalPrice) {
                toast.error('Todos os campos são obrigatórios para realizar a reserva.');
                return;
            }
            if (!(reservationData.startDate instanceof Date) || !(reservationData.endDate instanceof Date) || !(reservationData.startTime instanceof Date) || !(reservationData.endTime instanceof Date)) {
                toast.error('Datas e horários inválidos.');
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
                start_date: formatDate(reservationData.startDate),
                end_date: formatDate(reservationData.endDate),
                startTime: formatTime(reservationData.startTime),
                endTime: formatTime(reservationData.endTime),
                value: reservationData.totalPrice
            };

            await rentalService.createRental(rentalData);
            setIsModalOpen(false);
            onReservaSuccess();
            
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
                <button onClick={handleViewLocatorProfile} className="w-full mt-4 text-center text-[#00A3FF] hover:underline cursor-pointer">
                    Ver mais sobre o locatario
                </button>
            </div>

            {/* Card de reserva */}
            <div className="bg-white border border-[#E3E3E3] rounded-lg shadow-lg p-6">
                <div className="mt-6">
                    <div className="font-bold text-lg mb-2">Preço por hora:</div>
                    <div className="font-bold text-2xl mb-4">
                        {formatPrice(space?.price_per_hour || 0)}
                        <span className="text-xs font-normal">/hora</span>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-[#00A3FF] text-white py-3 px-4 rounded-md hover:bg-[#0088cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processando...' : 'Reservar Agora'}
                    </button>
                    <div className="mt-4">
                                <WeatherGoogle location={space.location} />
                            </div>
                </div>
            </div>

            <ReservaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                space={space}
                onSubmit={handleRental}
            />
        </div>
    );
}

export default ReservaCard; 