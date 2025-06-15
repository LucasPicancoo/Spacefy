import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { assessmentService } from '../../../services/assessmentService';
import SpaceCard from '../../../Components/SpaceCard/SpaceCard';

const TopRatedSection = () => {
  const [ratedPage, setRatedPage] = useState(0);
  const [topRatedSpaces, setTopRatedSpaces] = useState([]);
  const ratedCarouselRef = useRef(null);
  const totalPages = Math.ceil(topRatedSpaces.length / 5);

  useEffect(() => {
    const fetchTopRatedSpaces = async () => {
      try {
        const spaces = await assessmentService.topRatedSpaces();
        setTopRatedSpaces(spaces);
      } catch (error) {
        console.error('Erro ao buscar espaços mais bem avaliados:', error);
      }
    };

    fetchTopRatedSpaces();
  }, []);

  const scrollRatedCarousel = (direction) => {
    if (ratedCarouselRef.current) {
      const newPage = direction === 'next' ? ratedPage + 1 : ratedPage - 1;
      
      if (newPage < 0 || newPage >= totalPages) return;
      
      const scrollAmount = ratedCarouselRef.current.clientWidth;
      ratedCarouselRef.current.scrollTo({
        left: scrollAmount * newPage,
        behavior: 'smooth'
      });
      
      setRatedPage(newPage);
    }
  };

  return (
    <section 
      className="py-16 bg-gray-50"
      role="region"
      aria-label="Seção de espaços mais bem avaliados"
    >
      <div className="container mx-auto px-4">
        <h2 
          className="text-4xl font-bold text-center mb-4"
          aria-label="Espaços melhores avaliados"
        >
          Espaços melhores avaliados
        </h2>
        <p 
          className="text-gray-600 text-center mb-12"
          aria-label="Confira os locais com as melhores avaliações pelos nossos clientes"
        >
          Confira os locais com as melhores avaliações pelos nossos clientes!
        </p>
        
        <div className="relative">
          <div 
            ref={ratedCarouselRef}
            className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar scroll-smooth px-4"
            style={{
              scrollSnapType: 'x mandatory',
              scrollPadding: '0 24px',
            }}
            role="list"
            aria-label="Lista de espaços mais bem avaliados"
          >
            {topRatedSpaces.map((space) => (
              <SpaceCard
                key={space._id}
                space={space}
                role="listitem"
                aria-label={`Espaço: ${space.space_name}`}
              />
            ))}
          </div>

          {ratedPage > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                scrollRatedCarousel('prev');
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
              aria-label="Voltar para o slide anterior"
            >
              <FaChevronLeft className="text-xl" aria-hidden="true" />
            </button>
          )}
          {ratedPage < totalPages - 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                scrollRatedCarousel('next');
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
              aria-label="Avançar para o próximo slide"
            >
              <FaChevronRight className="text-xl" aria-hidden="true" />
            </button>
          )}

          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2"
            role="tablist"
            aria-label="Navegação entre slides"
          >
            {Array.from({ length: totalPages }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  ratedPage === index ? 'bg-[#00A3FF]' : 'bg-gray-300'
                }`}
                role="tab"
                aria-selected={ratedPage === index}
                aria-label={`Slide ${index + 1} de ${totalPages}`}
                tabIndex="0"
                onClick={() => {
                  if (ratedCarouselRef.current) {
                    const scrollAmount = ratedCarouselRef.current.clientWidth;
                    ratedCarouselRef.current.scrollTo({
                      left: scrollAmount * index,
                      behavior: 'smooth'
                    });
                    setRatedPage(index);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopRatedSection; 