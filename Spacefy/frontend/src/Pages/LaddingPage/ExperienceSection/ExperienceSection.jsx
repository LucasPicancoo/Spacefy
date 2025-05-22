import React, { useState } from 'react';
import { FaParking, FaWifi, FaSwimmingPool } from 'react-icons/fa';
import { MdAir, MdTv } from 'react-icons/md';
import { GiBarbecue } from 'react-icons/gi';
import Volei from "../../../assets/Spaces/Volei.jpg";

const ExperienceSection = () => {
  const [selectedAmenity, setSelectedAmenity] = useState('parking');

  const handleAmenityClick = (amenity) => {
    setSelectedAmenity(amenity);
  };

  const getButtonClass = (amenity) => {
    const baseClass = "flex items-center gap-2 px-6 py-3 rounded-full transition-all focus:outline-none focus:ring-2";
    const selectedClass = "bg-[#00A3FF] text-white hover:bg-[#0084CC] focus:ring-[#00A3FF] focus:ring-opacity-50";
    const unselectedClass = "border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-300";
    
    return `${baseClass} ${selectedAmenity === amenity ? selectedClass : unselectedClass}`;
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div 
              key={item} 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={Volei}
                alt="Palácio de Cristal"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">Palácio de Cristal</h3>
                <p className="text-gray-600">Rua Leonídio Valentim Ferreira, 123</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection; 