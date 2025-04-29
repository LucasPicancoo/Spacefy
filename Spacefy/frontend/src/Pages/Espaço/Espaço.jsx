import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import ReservaCard from "../../Components/ReservaCard/ReservaCard";
import CommentsModal from "../../Components/CommentsModal";
import { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

const mockImgs = [
    {
      id: 1,
      imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 5,
      imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 6,
      imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    },
  ];

function Espaço() {
    const [currentPage, setCurrentPage] = useState(0);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const PhotosCarouselRef = useRef(null);

    const scrollPhotosCarousel = (direction) => {
        if (PhotosCarouselRef.current) {
            const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
            const totalCards = mockImgs.length;
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

    return (
        <div>
            <Header />
            <div className="">
                <h1 className="text-3xl font-bold ml-10 mt-10 mb-8">Palacio de Cristal</h1>

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
                            {mockImgs.map((img) => (
                                <div 
                                    key={img.id} 
                                    className="min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    <div className="relative">
                                        <img src={img.imagem} className="w-full h-[350px] object-cover" />
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
                        {currentPage < Math.ceil(mockImgs.length / Math.floor(PhotosCarouselRef.current?.clientWidth / 500 || 1)) - 1 && (
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
                            <p className="text-[#696868]">Rua Leonídio Valentim Ferreira - Minas Gerais/MG - Brasil</p>
                        </div>
                        <div className="mb-4 border-b border-[#00A3FF] pb-8">
                            <h2 className="text-2xl font-bold text-[#363636]">Descrição</h2>
                            <p className="text-[#696868]">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue, magna sed feugiat lobortis, est tellus laoreet purus, sed auctor quam dolor at ipsum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas risus tellus, vehicula rutrum pellentesque vitae, pretium at libero...
                            </p>
                            <span className="text-xs font-bold text-[#363636] flex items-center gap-1 mt-2 cursor-pointer">
                                Veja a descrição completa <span className="text-lg">▼</span>
                            </span>
                        </div>
                        <div className="mb-4 pb-8">
                            <h2 className="text-2xl font-bold text-[#363636]">Comodidades:</h2>
                            <div className="flex flex-wrap gap-8 mt-4">
                                <div className="flex items-center gap-2 text-[#363636] font-bold"><span>🏢</span>2500 m²</div>
                                <div className="flex items-center gap-2 text-[#363636] font-bold"><span>📶</span>Wifi</div>
                                <div className="flex items-center gap-2 text-[#363636] font-bold"><span>❄️</span>Ar-Condicionado</div>
                                <div className="flex items-center gap-2 text-[#363636] font-bold"><span>👥</span>250 Pessoas</div>
                                <div className="flex items-center gap-2 text-[#363636] font-bold"><span>🛁</span>6 Banheiros</div>
                                <div className="flex items-center gap-2 text-[#363636] font-bold"><span>🏊‍♂️</span>Piscina</div>
                            </div>
                            <span className="text-xs font-bold text-[#363636] flex items-center gap-1 mt-2 cursor-pointer">
                                Veja todas as comodidades <span className="text-lg">▼</span>
                            </span>
                        </div>
                    </div>

                    {/* Coluna da direita - Card de reserva */}
                    <ReservaCard />
                </div>

                {/* Avaliação geral */}
                <div className="mt-16">
                    <hr className="border-t border-[#00A3FF] mb-8" />
                    <h2 className="text-3xl font-bold text-center mb-2">Avaliação geral</h2>
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center text-3xl text-[#363636]">
                            ★★★★☆
                            <span className="text-lg font-normal ml-2 text-[#363636]">(265)</span>
                        </div>
                    </div>
                    <hr className="border-t border-[#00A3FF] mb-8" />
                </div>

                {/* Comentários dos usuários */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Comentários dos usuarios</h2>
                    <div className="flex gap-6 justify-center items-stretch">
                        {/* Comentário 1 */}
                        <div className="bg-white rounded-lg shadow-md p-4 w-[320px] flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 bg-[#2196F3] rounded-full flex items-center justify-center text-white font-bold">M</div>
                                <span className="font-bold text-[#363636]">Maria Oliveira</span>
                                <span className="text-xs text-gray-500 ml-auto">★★★★☆</span>
                            </div>
                            <p className="text-xs text-[#363636]">Pode melhorar. O espaço é bom, mas a organização deixou a desejar. Tivemos problemas com a iluminação e atrasos na liberação do local. Não comprometeu a festa, mas esperava mais.</p>
                        </div>
                        {/* Comentário 2 */}
                        <div className="bg-white rounded-lg shadow-md p-4 w-[320px] flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 bg-[#2196F3] rounded-full flex items-center justify-center text-white font-bold">R</div>
                                <span className="font-bold text-[#363636]">Ricardo Fernandes</span>
                                <span className="text-xs text-gray-500 ml-auto">★★★★★</span>
                            </div>
                            <p className="text-xs text-[#363636]">Experiência incrível! O espaço para festas superou todas as expectativas - amplo, bem organizado e exatamente como descrito. A estrutura é perfeita para eventos, com iluminação, som e conforto impecáveis. A comunicação com o anfitrião foi rápida e eficiente, garantindo que tudo saísse como planejado. Com certeza voltarei para futuras celebrações. Recomendo a todos!</p>
                        </div>
                        {/* Comentário 3 */}
                        <div className="bg-white rounded-lg shadow-md p-4 w-[320px] flex flex-col relative">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 bg-[#2196F3] rounded-full flex items-center justify-center text-white font-bold">C</div>
                                <span className="font-bold text-[#363636]">Clara Silva</span>
                                <span className="text-xs text-gray-500 ml-auto">★★★★☆</span>
                            </div>
                            <p className="text-xs text-[#363636]">O espaço é bom, mas a organização deixou a desejar. Tivemos problemas com a iluminação e atrasos na liberação do local. Não comprometeu a festa, mas esperava mais.</p>
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00A3FF] text-white rounded-full p-2 shadow-md flex items-center justify-center" style={{right: '-32px'}}>
                                <FaChevronRight className="text-lg" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-8 mb-8">
                        <button 
                            onClick={() => setIsCommentsModalOpen(true)}
                            className="bg-[#00A3FF] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0084CC] transition-colors"
                        >
                            Ver todos os comentários
                        </button>
                    </div>
                </div>
            </div>
            <Footer />

            <CommentsModal 
                isOpen={isCommentsModalOpen}
                onClose={() => setIsCommentsModalOpen(false)}
                reviews={[
                    {
                        name: "Maria Oliveira",
                        review: "Pode melhorar. O espaço é bom, mas a organização deixou a desejar. Tivemos problemas com a iluminação e atrasos na liberação do local. Não comprometeu a festa, mas esperava mais."
                    },
                    {
                        name: "Ricardo Fernandes",
                        review: "Experiência incrível! O espaço para festas superou todas as expectativas - amplo, bem organizado e exatamente como descrito. A estrutura é perfeita para eventos, com iluminação, som e conforto impecáveis. A comunicação com o anfitrião foi rápida e eficiente, garantindo que tudo saísse como planejado. Com certeza voltarei para futuras celebrações. Recomendo a todos!"
                    },
                    {
                        name: "Clara Silva",
                        review: "O espaço é bom, mas a organização deixou a desejar. Tivemos problemas com a iluminação e atrasos na liberação do local. Não comprometeu a festa, mas esperava mais."
                    },
                    {
                        name: "Clara Silva",
                        review: "O espaço é bom, mas a organização deixou a desejar. Tivemos problemas com a iluminação e atrasos na liberação do local. Não comprometeu a festa, mas esperava mais."
                    },
                    {
                        name: "Maria Oliveira",
                        review: "Pode melhorar. O espaço é bom, mas a organização deixou a desejar. Tivemos problemas com a iluminação e atrasos na liberação do local. Não comprometeu a festa, mas esperava mais."
                    },
                    {
                        name: "Ricardo Fernandes",
                        review: "Experiência incrível! O espaço para festas superou todas as expectativas - amplo, bem organizado e exatamente como descrito. A estrutura é perfeita para eventos, com iluminação, som e conforto impecáveis. A comunicação com o anfitrião foi rápida e eficiente, garantindo que tudo saísse como planejado. Com certeza voltarei para futuras celebrações. Recomendo a todos!"
                    },
                    {
                        name: "Clara Silva",
                        review: "O espaço é bom, mas a organização deixou a desejar. Tivemos problemas com a iluminação e atrasos na liberação do local. Não comprometeu a festa, mas esperava mais."
                    }
                ]}
            />
        </div>
    )
}

export default Espaço;
