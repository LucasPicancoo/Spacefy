import React, { useState, useEffect } from 'react';
import { FaParking, FaWifi, FaSwimmingPool } from 'react-icons/fa';
import { MdAir, MdTv } from 'react-icons/md';
import { GiBarbecue } from 'react-icons/gi';
import { spaceService } from '../../../services/spaceService';
import { useNavigate } from 'react-router-dom';

const ExperienceSection = () => {
  const navigate = useNavigate();
  const [selectedAmenity, setSelectedAmenity] = useState('parking');
  const [spacesByAmenity, setSpacesByAmenity] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await spaceService.getSpacesByExperienceAmenities();
        setSpacesByAmenity(data);
      } catch (error) {
        console.error('Erro ao buscar espaços:', error);
        setError('Erro ao carregar os espaços. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const handleAmenityClick = (amenity) => {
    setSelectedAmenity(amenity);
  };

  const handleSpaceClick = (spaceId) => {
    navigate(`/espaco/${spaceId}`);
  };

  const getButtonClass = (amenity) => {
    const baseClass = "flex items-center gap-2 px-6 py-3 rounded-full transition-all focus:outline-none focus:ring-2 cursor-pointer";
    const selectedClass = "bg-[#00A3FF] text-white hover:bg-[#0084CC] focus:ring-[#00A3FF] focus:ring-opacity-50";
    const unselectedClass = "border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-300";
    
    return `${baseClass} ${selectedAmenity === amenity ? selectedClass : unselectedClass}`;
  };

  const renderSpaces = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3FF]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-4">
          {error}
        </div>
      );
    }

    const spaces = spacesByAmenity[selectedAmenity] || [];

    if (spaces.length === 0) {
      return (
        <div className="text-center text-gray-500 p-4">
          Nenhum espaço encontrado com esta comodidade.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {spaces.map((space) => (
          <div 
            key={space._id} 
            onClick={() => handleSpaceClick(space._id)}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105 transition-transform"
          >
            <img
              src={space.image_url}
              alt={space.space_name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold truncate mb-1">{space.space_name}</h3>
              <p className="text-gray-600 text-sm mb-1">
                {typeof space.location === 'object' ? space.location.formatted_address : space.location}
              </p>
              <p className="text-[#00A3FF] font-semibold text-sm">
                R$ {space.price_per_hour.toLocaleString('pt-BR')}/hora
              </p>
            </div>
          </div>
        ))}
      </div>
    );
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

        {renderSpaces()}
      </div>
    </section>
  );
};

export default ExperienceSection; 