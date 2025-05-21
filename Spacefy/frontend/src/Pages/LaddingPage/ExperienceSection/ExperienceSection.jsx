import React, { useState, useRef } from 'react';
import { FaParking, FaWifi, FaSwimmingPool, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdAir, MdTv } from 'react-icons/md';
import { GiBarbecue } from 'react-icons/gi';
import Volei from "../../assets/Spaces/Volei.jpg";

const ExperienceSection = () => {
  const [selectedAmenity, setSelectedAmenity] = useState('parking');
  const [currentPage, setCurrentPage] = useState(0);
  const carouselRef = useRef(null);
  const totalPages = 3;

  const handleAmenityClick = (amenity) => {
    setSelectedAmenity(amenity);
  };

  const getButtonClass = (amenity) => {
    const baseClass = "flex items-center gap-2 px-6 py-3 rounded-full transition-all focus:outline-none focus:ring-2";
    const selectedClass = "bg-[#00A3FF] text-white hover:bg-[#0084CC] focus:ring-[#00A3FF] focus:ring-opacity-50";
    const unselectedClass = "border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-300";
    
    return `${baseClass} ${selectedAmenity === amenity ? selectedClass : unselectedClass}`;
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
      
      if (newPage < 0 || newPage >= totalPages) return;
      
      const scrollAmount = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: scrollAmount * newPage,
        behavior: 'smooth'
      });
      
      setCurrentPage(newPage);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Personalize sua experiência</h2>
        <p className="text-gray-600 text-center mb-12">Selecione as comodidades ideais e aproveite uma estadia sob medida.</p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => handleAmenityClick('parking')}
            className={getButtonClass('parking')}
          >
            <FaParking className="text-xl" />
            <span>Estacionamento</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('wifi')}
            className={getButtonClass('wifi')}
          >
            <FaWifi className="text-xl" />
            <span>Wifi</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('pool')}
            className={getButtonClass('pool')}
          >
            <FaSwimmingPool className="text-xl" />
            <span>Piscina</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('barbecue')}
            className={getButtonClass('barbecue')}
          >
            <GiBarbecue className="text-xl" />
            <span>Churrasqueira</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('ac')}
            className={getButtonClass('ac')}
          >
            <MdAir className="text-xl" />
            <span>Ar-Condicionado</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('tv')}
            className={getButtonClass('tv')}
          >
            <MdTv className="text-xl" />
            <span>TV</span>
          </button>
        </div>

        <div className="relative">
          <div 
            ref={carouselRef}
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
                <img
                  src={Volei}
                  alt="Palácio de Cristal"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Palácio de Cristal</h3>
                  <p className="text-gray-600">Rua Leonídio Valentim Ferreira, 123</p>
                </div>
              </div>
            ))}
          </div>

          {currentPage > 0 && (
            <button 
              onClick={() => scrollCarousel('prev')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
            >
              <FaChevronLeft className="text-xl" />
            </button>
          )}
          {currentPage < totalPages - 1 && (
            <button 
              onClick={() => scrollCarousel('next')}
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
                  currentPage === index ? 'bg-[#00A3FF]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection; 