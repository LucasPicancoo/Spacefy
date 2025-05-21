import React, { useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaHeart, FaStar, FaClock } from 'react-icons/fa';
import Volei from "../../assets/Spaces/Volei.jpg";

const TopRatedSection = () => {
  const [ratedPage, setRatedPage] = useState(0);
  const [favorites, setFavorites] = useState({});
  const ratedCarouselRef = useRef(null);
  const totalPages = 3;

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

  const handleFavorite = (itemId) => {
    setFavorites(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Espaços melhores avaliados</h2>
        <p className="text-gray-600 text-center mb-12">Confira os locais com as melhores avaliações pelos nossos clientes!</p>
        
        <div className="relative">
          <div 
            ref={ratedCarouselRef}
            className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar scroll-smooth"
            style={{
              scrollSnapType: 'x mandatory',
              scrollPadding: '0 24px',
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item) => (
              <div 
                key={item} 
                className="min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative">
                  <img
                    src={Volei}
                    alt="Porto Belo"
                    className="w-full h-48 object-cover"
                  />
                  <button 
                    onClick={() => handleFavorite(item)}
                    className="absolute top-4 right-4 transition-colors"
                  >
                    <FaHeart 
                      className={`text-xl ${favorites[item] ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">Porto Belo</h3>
                      <p className="text-gray-600 text-sm">Muriaé - MG</p>
                      <p className="text-gray-500 text-xs">Rua Leonídio Valentim Ferreira</p>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-semibold">4.80</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-[#00A3FF] font-bold">R$ 2.000</p>
                      <p className="text-gray-500 text-xs">por hora</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaClock className="mr-1" />
                      <span>Clique para ver mais</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ratedPage > 0 && (
            <button 
              onClick={() => scrollRatedCarousel('prev')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
            >
              <FaChevronLeft className="text-xl" />
            </button>
          )}
          {ratedPage < totalPages - 1 && (
            <button 
              onClick={() => scrollRatedCarousel('next')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
            >
              <FaChevronRight className="text-xl" />
            </button>
          )}

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  ratedPage === index ? 'bg-[#00A3FF]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopRatedSection; 