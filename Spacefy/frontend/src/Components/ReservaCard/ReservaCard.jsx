import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rentalService } from "../../services/rentalService";
import { userService } from "../../services/userService";
import { toast } from 'react-toastify';
import { useUser } from "../../Contexts/UserContext";
import ReservaModal from "../../Pages/Espaço/ReservaModal";
import WeatherGoogle from "../../Components/WeatherGoogle/WeatherGoogle";

function ReservaCard({ space, onReservaSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [ownerName, setOwnerName] = useState('');
    const { user, isLoggedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOwnerName = async () => {
            try {
                const ownerData = await userService.getUserById(space.owner_id);
                setOwnerName(`${ownerData.name} ${ownerData.surname}`);
            } catch (error) {
                console.error('Erro ao buscar dados do proprietário:', error);
            }
        };

        if (space?.owner_id) {
            fetchOwnerName();
        }
    }, [space?.owner_id]);

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
        <div className="w-[340px] flex flex-col gap-6" role="complementary" aria-label="Informações de reserva">
            {/* Card do locatário */}
            <div className="bg-white border border-[#E3E3E3] rounded-lg shadow-lg p-6" role="region" aria-label="Informações do locador">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden" role="img" aria-label="Foto do perfil do locador">
                        <img src="/user-icon.png" alt="Foto do perfil do locador" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-medium" id="owner-name">{ownerName}</h3>
                        <div className="flex items-center gap-1" role="group" aria-label="Avaliação do locador">
                            <div className="flex" aria-label="5 estrelas">★★★★★</div>
                            <span className="text-gray-600" aria-label="183 avaliações">(183)</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleViewLocatorProfile} 
                    className="w-full mt-4 text-center text-[#00A3FF] hover:underline cursor-pointer"
                    aria-label="Ver mais informações sobre o locador"
                >
                    Ver mais sobre o locatario
                </button>
            </div>

            {/* Card de reserva */}
            <div className="bg-white border border-[#E3E3E3] rounded-lg shadow-lg p-6" role="region" aria-label="Detalhes da reserva">
                <div className="mt-6">
                    <div className="font-bold text-lg mb-2" id="price-label">Preço por hora:</div>
                    <div className="font-bold text-2xl mb-4" aria-labelledby="price-label">
                        {formatPrice(space?.price_per_hour || 0)}
                        <span className="text-xs font-normal" aria-label="por hora">/hora</span>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-[#00A3FF] text-white py-3 px-4 rounded-md hover:bg-[#0088cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                        aria-label={isLoading ? "Processando reserva" : "Iniciar processo de reserva"}
                        aria-busy={isLoading}
                    >
                        {isLoading ? 'Processando...' : 'Reservar Agora'}
                    </button>
                    <div className="mt-4" role="region" aria-label="Previsão do tempo para a localização">
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