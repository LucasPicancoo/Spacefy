import React from 'react';
import { FaHeart, FaStar, FaClock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const SpaceCard = ({ 
  space, 
  onFavoriteClick, 
  isFavorite = false,
  showFavoriteButton = true,
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(space);
    } else {
      navigate(`/espaco/${space._id || space.id}`);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavoriteClick) {
      onFavoriteClick(space._id || space.id);
    }
  };

  // Função para formatar a localização
  const formatLocation = (location) => {
    if (!location) return "Muriaé - MG"; // Valor padrão fictício
    if (location.includes(" - ")) return location;
    return `${location} - MG`; // Valor padrão fictício para o estado
  };

  return (
    <div 
      className="w-[300px] min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={space.image_url?.[0] || space.imagem} 
          alt={space.space_name || space.titulo} 
          className="w-full h-40 object-cover" 
        />
        {showFavoriteButton && (
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 transition-colors"
          >
            <FaHeart 
              className={`text-xl ${isFavorite ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors`} 
            />
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold">{space.space_name || space.titulo}</h3>
            <p className="text-gray-600 text-sm">{formatLocation(space.location || space.cidade)}</p>
            <p className="text-gray-500 text-xs">{space.endereco || "Rua Leonídio Valentim Ferreira"}</p> {/* TODO: Remover o endereço padrão  e implementar no backend*/}
          </div>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-semibold">{space.nota || "4.8"}</span>
            <span className="text-gray-500 text-xs ml-1">({space.avaliacoes || "268"})</span> {/* TODO: Remover o número de avaliações padrão e implementar no backend*/}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-[#00A3FF] font-bold">
              {typeof space.price_per_hour === 'number' 
                ? `R$ ${space.price_per_hour}` 
                : space.preco}
            </p>
            <p className="text-gray-500 text-xs">por hora</p>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FaClock className="mr-1" />
            <span>Clique para ver mais</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard; 