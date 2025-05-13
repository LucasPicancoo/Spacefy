import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import ReservaCard from "../../Components/ReservaCard/ReservaCard";
import CommentsModal from "../../Components/CommentsModal";
import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import { spaceService } from "../../services/spaceService";
import { useParams } from "react-router-dom";

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

function Espaço() {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(0);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const PhotosCarouselRef = useRef(null);

    useEffect(() => {
        const fetchSpace = async () => {
            try {
                const spaceData = await spaceService.getSpaceById(id);
                setSpace(spaceData);
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

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    if (!space) {
        return <div className="flex justify-center items-center h-screen">Espaço não encontrado</div>;
    }

    return (
        <div>
            <Header />
            <div className="">
                <h1 className="text-3xl font-bold ml-10 mt-10 mb-8">{space.space_name}</h1>

                {/* Carousel de fotos */}
                <section className="overflow-hidden">
                    <div className="relative">
                        <div 
                            ref={PhotosCarouselRef}
                            className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar scroll-smooth"
                            style={{
                                scrollSnapType: 'x mandatory',
                                scrollPadding: '0 16px',
                            }}
                        >
                            {space.image_url?.map((img, index) => (
                                <div 
                                    key={index} 
                                    className="min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    <div className="relative">
                                        <img src={img} className="w-full h-[350px] object-cover" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Botões de navegação do carrossel de fotos */}
                        {currentPage > 0 && (
                            <button 
                                onClick={() => scrollPhotosCarousel('prev')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 ml-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                            >
                                <FaChevronLeft className="text-lg" />
                            </button>
                        )}
                        {currentPage < Math.ceil((space.image_url?.length || 0) / Math.floor(PhotosCarouselRef.current?.clientWidth / 500 || 1)) - 1 && (
                            <button 
                                onClick={() => scrollPhotosCarousel('next')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 mr-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                            >
                                <FaChevronRight className="text-lg" />
                            </button>
                        )}
                    </div>
                </section>
                
                {/* Colunas de informações */}
                <div className="container mx-auto px-4 flex justify-between gap-10 mt-8">
                    {/* Coluna da esquerda */}
                    <div className="flex-1 max-w-[60%]">
                        <div className="mb-4 border-b border-[#00A3FF] pb-8">
                            <h2 className="text-2xl font-bold text-[#363636]">Endereço:</h2>
                            <p className="text-[#696868]">{space.location}</p>
                        </div>
                        <div className="mb-4 border-b border-[#00A3FF] pb-8">
                            <h2 className="text-2xl font-bold text-[#363636]">Descrição</h2>
                            <p className="text-[#696868]">
                                {showFullDescription 
                                    ? space.space_description 
                                    : space.space_description?.slice(0, 150) + (space.space_description?.length > 150 ? '...' : '')}
                            </p>
                            {space.space_description?.length > 150 && (
                                <button 
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="text-xs font-bold text-[#363636] flex items-center gap-1 mt-2 cursor-pointer hover:text-[#00A3FF] transition-colors"
                                >
                                    {showFullDescription ? 'Mostrar menos' : 'Ver descrição completa'} 
                                    <FaChevronDown className={`text-sm transition-transform duration-300 ${showFullDescription ? 'rotate-180' : ''}`} />
                                </button>
                            )}
                        </div>
                        <div className="mb-4 pb-8">
                            <h2 className="text-2xl font-bold text-[#363636]">Comodidades:</h2>
                            <div className="flex flex-wrap gap-8 mt-4">
                                {space.space_amenities?.slice(0, showAllAmenities ? undefined : 5).map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-2 text-[#363636] font-bold">
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                            {space.space_amenities?.length > 5 && (
                                <button 
                                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                                    className="text-xs font-bold text-[#363636] flex items-center gap-1 mt-2 cursor-pointer hover:text-[#00A3FF] transition-colors"
                                >
                                    {showAllAmenities ? 'Mostrar menos' : 'Ver todas as comodidades'} 
                                    <FaChevronDown className={`text-sm transition-transform duration-300 ${showAllAmenities ? 'rotate-180' : ''}`} />
                                </button>
                            )}
                        </div>
                        <div className="mb-4 pb-8">
                            <h2 className="text-2xl font-bold text-[#363636]">Regras do Espaço:</h2>
                            <div className="flex flex-wrap gap-8 mt-4">
                                {space.space_rules?.map((rule, index) => (
                                    <div key={index} className="flex items-center gap-2 text-[#363636] font-bold">
                                        <span>{rule}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 pb-8">
                            <h2 className="text-2xl font-bold text-[#363636]">Horário de Funcionamento:</h2>
                            <p className="text-[#696868]">
                                {space.week_days?.join(", ")} - Das {space.opening_time} às {space.closing_time}
                            </p>
                        </div>
                    </div>

                    {/* Coluna da direita - Card de reserva */}
                    <ReservaCard space={space} />
                </div>

                {/* Informações do Proprietário */}
                <div className="mt-16">
                    <hr className="border-t border-[#00A3FF] mb-8" />
                    <h2 className="text-3xl font-bold text-center mb-2">Informações do Proprietário</h2>
                    <div className="flex flex-col items-center mb-8">
                        <p className="text-[#363636]">Nome: {space.owner_name}</p>
                        <p className="text-[#363636]">Email: {space.owner_email}</p>
                        <p className="text-[#363636]">Telefone: {space.owner_phone}</p>
                    </div>
                    <hr className="border-t border-[#00A3FF] mb-8" />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Espaço;

