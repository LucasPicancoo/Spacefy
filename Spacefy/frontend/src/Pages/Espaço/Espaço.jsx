import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import ReservaCard from "../../Components/ReservaCard/ReservaCard";
import ComentariosModal from "../../Components/Modal/ComentariosModal";
import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaStar, FaRegStar, FaStarHalfAlt, FaEnvelope } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import { spaceService } from "../../services/spaceService";
import { assessmentService } from "../../services/assessmentService";
import { useParams, useNavigate } from "react-router-dom";
import AvaliacaoGeral from "./AvaliacaoGeral";
import ComentariosUsuarios from "./ComentariosUsuarios";
import MapaEspaço from "./MapaEspaço";
import { useUser } from "../../Contexts/UserContext";
import MiniChat from "../../Components/MiniChat/MiniChat";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AvaliarEspaco from "../../Components/AvaliarEspaco/avaliarEspaco";

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

function Espaço() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useUser();
    const [currentPage, setCurrentPage] = useState(0);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [averageScore, setAverageScore] = useState(0);
    const [assessments, setAssessments] = useState([]);
    const PhotosCarouselRef = useRef(null);

    useEffect(() => {
        const fetchSpace = async () => {
            try {
                const spaceData = await spaceService.getSpaceById(id);
                setSpace(spaceData);
                
                // Buscar a nota média do espaço
                const scoreData = await assessmentService.getAverageScoreBySpace(id);
                setAverageScore(scoreData.averageScore || 0);

                // Buscar as avaliações do espaço
                const assessmentsData = await assessmentService.getAssessmentsBySpace(id);
                setAssessments(assessmentsData);
            } catch (error) {
                console.error("Erro ao buscar espaço:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpace();
    }, [id]);

    const scrollPhotosCarousel = (direction) => {
        if (PhotosCarouselRef.current) {
            const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
            const totalCards = space?.image_url?.length || 0;
            const cardWidth = 500;
            const containerWidth = PhotosCarouselRef.current.clientWidth;
            const cardsPerPage = Math.floor(containerWidth / cardWidth);
            const maxPages = Math.ceil(totalCards / cardsPerPage);
            
            if (newPage >= 0 && newPage < maxPages) {
                const scrollAmount = cardWidth * cardsPerPage;
                PhotosCarouselRef.current.scrollTo({
                    left: scrollAmount * newPage,
                    behavior: 'smooth'
                });
                setCurrentPage(newPage);
            }
        }
    };

    const handleMessageLocator = () => {
        if (!isLoggedIn) {
            // Redirecionar para login se não estiver autenticado
            navigate('/login');
            return;
        }

        // Redirecionar para a página de mensagens com o ID do locador
        navigate(`/messages?receiverId=${space.owner_id}`);
    };

    const handleReservaSuccess = () => {
        toast.success('Reserva concluída!');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    if (!space) {
        return <div className="flex justify-center items-center h-screen">Espaço não encontrado</div>;
    }

    return (
        <div role="main" aria-label={`Página do espaço ${space?.space_name}`}>
            <Header />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                aria-label="Notificações do sistema"
            />
            <div className="">
                <div className="flex justify-between items-center mx-10 mt-10 mb-8">
                    <h1 
                        className="text-3xl font-bold"
                        aria-label={`Nome do espaço: ${space.space_name}`}
                    >
                        {space.space_name}
                    </h1>
                    <button
                        onClick={handleMessageLocator}
                        className="flex items-center gap-2 bg-[#00A3FF] text-white px-4 py-2 rounded-lg hover:bg-[#0088cc] transition-colors"
                        aria-label="Enviar mensagem para o locador do espaço"
                    >
                        <FaEnvelope aria-hidden="true" />
                        <span>Mensagem para o Locador</span>
                    </button>
                </div>

                {/* Carrossel de fotos */}
                <section 
                    className="overflow-hidden"
                    role="region"
                    aria-label="Galeria de fotos do espaço"
                >
                    <div className="relative">
                        <div 
                            ref={PhotosCarouselRef}
                            className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar scroll-smooth"
                            style={{
                                scrollSnapType: 'x mandatory',
                                scrollPadding: '0 16px',
                            }}
                            role="list"
                            aria-label="Lista de fotos do espaço"
                        >
                            {space.image_url?.map((img, index) => (
                                <div 
                                    key={index} 
                                    className="min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0"
                                    style={{ scrollSnapAlign: 'start' }}
                                    role="listitem"
                                    aria-label={`Foto ${index + 1} do espaço`}
                                >
                                    <div className="relative">
                                        <img 
                                            src={img} 
                                            className="w-full h-[350px] object-cover"
                                            alt={`Foto ${index + 1} do espaço ${space.space_name}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Botões de navegação do carrossel de fotos */}
                        {currentPage > 0 && (
                            <button 
                                onClick={() => scrollPhotosCarousel('prev')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 ml-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                                aria-label="Ver foto anterior"
                            >
                                <FaChevronLeft className="text-lg" aria-hidden="true" />
                            </button>
                        )}
                        {currentPage < Math.ceil((space.image_url?.length || 0) / Math.floor(PhotosCarouselRef.current?.clientWidth / 500 || 1)) - 1 && (
                            <button 
                                onClick={() => scrollPhotosCarousel('next')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 mr-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                                aria-label="Ver próxima foto"
                            >
                                <FaChevronRight className="text-lg" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </section>
                
                {/* Colunas de informações */}
                <div 
                    className="container mx-auto px-4 flex justify-between gap-10 mt-8"
                    role="region"
                    aria-label="Informações detalhadas do espaço"
                >
                    {/* Coluna da esquerda */}
                    <div 
                        className="flex-1 max-w-[60%]"
                        role="complementary"
                        aria-label="Detalhes do espaço"
                    >
                        <div className="mb-4 border-b border-[#00A3FF] pb-8">
                            <h2 
                                className="text-2xl font-bold text-[#363636]"
                                aria-label="Endereço do espaço"
                            >
                                Endereço:
                            </h2>
                            <p 
                                className="text-[#696868]"
                                aria-label={`Localização: ${space.location.formatted_address}`}
                            >
                                {space.location.formatted_address}
                            </p>
                        </div>
                        <div className="mb-4 border-b border-[#00A3FF] pb-8">
                            <h2 
                                className="text-2xl font-bold text-[#363636]"
                                aria-label="Descrição do espaço"
                            >
                                Descrição
                            </h2>
                            <p 
                                className="text-[#696868]"
                                aria-label={space.space_description}
                            >
                                {showFullDescription 
                                    ? space.space_description 
                                    : space.space_description?.slice(0, 150) + (space.space_description?.length > 150 ? '...' : '')}
                            </p>
                            {space.space_description?.length > 150 && (
                                <button 
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="text-xs font-bold text-[#363636] flex items-center gap-1 mt-2 cursor-pointer hover:text-[#00A3FF] transition-colors"
                                    aria-expanded={showFullDescription}
                                    aria-label={showFullDescription ? "Mostrar menos da descrição" : "Ver descrição completa"}
                                >
                                    {showFullDescription ? 'Mostrar menos' : 'Ver descrição completa'} 
                                    <FaChevronDown 
                                        className={`text-sm transition-transform duration-300 ${showFullDescription ? 'rotate-180' : ''}`}
                                        aria-hidden="true"
                                    />
                                </button>
                            )}
                        </div>
                        <div className="mb-4 pb-8">
                            <h2 
                                className="text-2xl font-bold text-[#363636]"
                                aria-label="Comodidades disponíveis"
                            >
                                Comodidades:
                            </h2>
                            <div 
                                className="flex flex-wrap gap-8 mt-4"
                                role="list"
                                aria-label="Lista de comodidades"
                            >
                                {space.space_amenities?.slice(0, showAllAmenities ? undefined : 5).map((amenity, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center gap-2 text-[#363636] font-bold"
                                        role="listitem"
                                        aria-label={`Comodidade: ${amenity}`}
                                    >
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                            {space.space_amenities?.length > 5 && (
                                <button 
                                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                                    className="text-xs font-bold text-[#363636] flex items-center gap-1 mt-2 cursor-pointer hover:text-[#00A3FF] transition-colors"
                                    aria-expanded={showAllAmenities}
                                    aria-label={showAllAmenities ? "Mostrar menos comodidades" : "Ver todas as comodidades"}
                                >
                                    {showAllAmenities ? 'Mostrar menos' : 'Ver todas as comodidades'} 
                                    <FaChevronDown 
                                        className={`text-sm transition-transform duration-300 ${showAllAmenities ? 'rotate-180' : ''}`}
                                        aria-hidden="true"
                                    />
                                </button>
                            )}
                        </div>
                        <div className="mb-4 pb-8">
                            <h2 
                                className="text-2xl font-bold text-[#363636]"
                                aria-label="Regras do espaço"
                            >
                                Regras do Espaço:
                            </h2>
                            <div 
                                className="flex flex-wrap gap-8 mt-4"
                                role="list"
                                aria-label="Lista de regras"
                            >
                                {space.space_rules?.map((rule, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center gap-2 text-[#363636] font-bold"
                                        role="listitem"
                                        aria-label={`Regra: ${rule}`}
                                    >
                                        <span>{rule}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 pb-8">
                            <h2 
                                className="text-2xl font-bold text-[#363636]"
                                aria-label="Horário de funcionamento"
                            >
                                Horário de Funcionamento:
                            </h2>
                            <p 
                                className="text-[#696868]"
                                aria-label={`Funciona ${space.week_days?.join(", ")} das ${space.opening_time} às ${space.closing_time}`}
                            >
                                {space.week_days?.join(", ")} - Das {space.opening_time} às {space.closing_time}
                            </p>
                        </div>
                    </div>

                    {/* Coluna da direita - Card de reserva */}
                    <ReservaCard 
                        space={space} 
                        onReservaSuccess={handleReservaSuccess}
                        aria-label="Formulário de reserva"
                    />
                </div>

                {/* Avaliação Geral */}
                <AvaliacaoGeral 
                    averageScore={averageScore}
                    aria-label="Avaliação geral do espaço"
                />

                {/* Avaliações */}
                <ComentariosUsuarios 
                    assessments={assessments} 
                    onVerTodas={() => setIsCommentsModalOpen(true)}
                    aria-label="Comentários dos usuários"
                />
            </div>
            
            <AvaliarEspaco />

            <div 
                className="mt-10"
                role="region"
                aria-label="Localização do espaço no mapa"
            >
                <MapaEspaço location={space.location} />
            </div>
            <Footer />
            {isCommentsModalOpen && (
                <ComentariosModal
                    isOpen={isCommentsModalOpen}
                    onClose={() => setIsCommentsModalOpen(false)}
                    comments={assessments}
                    aria-label="Modal de comentários"
                />
            )}
            <MiniChat aria-label="Chat de mensagens" />
        </div>
    )
}

export default Espaço;

