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
        <div 
          className="flex justify-center items-center h-40"
          role="status"
          aria-label="Carregando espaços"
        >
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3FF]"
            aria-hidden="true"
          ></div>
        </div>
      );
    }

    if (error) {
      return (
        <div 
          className="text-center text-red-500 p-4"
          role="alert"
          aria-label="Mensagem de erro"
        >
          {error}
        </div>
      );
    }

    const spaces = spacesByAmenity[selectedAmenity] || [];

    if (spaces.length === 0) {
      return (
        <div 
          className="text-center text-gray-500 p-4"
          role="status"
          aria-label="Nenhum espaço encontrado"
        >
          Nenhum espaço encontrado com esta comodidade.
        </div>
      );
    }

    return (
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        role="list"
        aria-label={`Lista de espaços com ${selectedAmenity}`}
      >
        {spaces.map((space) => (
          <div 
            key={space._id} 
            onClick={() => handleSpaceClick(space._id)}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105 transition-transform"
            role="listitem"
            tabIndex="0"
            onKeyPress={(e) => e.key === 'Enter' && handleSpaceClick(space._id)}
            aria-label={`Espaço: ${space.space_name}`}
          >
            <img
              src={space.image_url}
              alt={`Imagem do espaço ${space.space_name}`}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 
                className="text-xl font-semibold truncate mb-1"
                aria-label={`Nome do espaço: ${space.space_name}`}
              >
                {space.space_name}
              </h3>
              <p 
                className="text-gray-600 text-sm mb-1"
                aria-label={`Localização: ${typeof space.location === 'object' ? space.location.formatted_address : space.location}`}
              >
                {typeof space.location === 'object' ? space.location.formatted_address : space.location}
              </p>
              <p 
                className="text-[#00A3FF] font-semibold text-sm"
                aria-label={`Preço: R$ ${space.price_per_hour.toLocaleString('pt-BR')} por hora`}
              >
                R$ {space.price_per_hour.toLocaleString('pt-BR')}/hora
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section 
      className="py-16 bg-white"
      role="region"
      aria-label="Seção de personalização de experiência"
    >
      <div className="container mx-auto px-4">
        <h2 
          className="text-4xl font-bold text-center mb-4"
          aria-label="Personalize sua experiência"
        >
          Personalize sua experiência
        </h2>
        <p 
          className="text-gray-600 text-center mb-12"
          aria-label="Selecione as comodidades ideais e aproveite uma estadia sob medida"
        >
          Selecione as comodidades ideais e aproveite uma estadia sob medida.
        </p>
        
        <div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          role="toolbar"
          aria-label="Filtros de comodidades"
        >
          <button 
            onClick={() => handleAmenityClick('parking')}
            className={getButtonClass('parking')}
            aria-pressed={selectedAmenity === 'parking'}
            aria-label="Filtrar por estacionamento"
          >
            <FaParking className="text-xl" aria-hidden="true" />
            <span>Estacionamento</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('wifi')}
            className={getButtonClass('wifi')}
            aria-pressed={selectedAmenity === 'wifi'}
            aria-label="Filtrar por wifi"
          >
            <FaWifi className="text-xl" aria-hidden="true" />
            <span>Wifi</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('pool')}
            className={getButtonClass('pool')}
            aria-pressed={selectedAmenity === 'pool'}
            aria-label="Filtrar por piscina"
          >
            <FaSwimmingPool className="text-xl" aria-hidden="true" />
            <span>Piscina</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('barbecue')}
            className={getButtonClass('barbecue')}
            aria-pressed={selectedAmenity === 'barbecue'}
            aria-label="Filtrar por churrasqueira"
          >
            <GiBarbecue className="text-xl" aria-hidden="true" />
            <span>Churrasqueira</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('ac')}
            className={getButtonClass('ac')}
            aria-pressed={selectedAmenity === 'ac'}
            aria-label="Filtrar por ar-condicionado"
          >
            <MdAir className="text-xl" aria-hidden="true" />
            <span>Ar-Condicionado</span>
          </button>
          <button 
            onClick={() => handleAmenityClick('tv')}
            className={getButtonClass('tv')}
            aria-pressed={selectedAmenity === 'tv'}
            aria-label="Filtrar por TV"
          >
            <MdTv className="text-xl" aria-hidden="true" />
            <span>TV</span>
          </button>
        </div>

        {renderSpaces()}
      </div>
    </section>
  );
};

export default ExperienceSection; 