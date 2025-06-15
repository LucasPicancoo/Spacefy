import React, { useState, useEffect } from 'react';
import { FaHeart, FaStar, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Contexts/UserContext';
import { userService } from '../../services/userService';
import { useFavorite } from '../../Contexts/FavoriteContext';
import { assessmentService } from '../../services/assessmentService';

const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const SpaceCard = ({ 
  space, 
  onClick,
  showFavoriteButton = true,
  className = "",
  imageClassName = "w-full h-40 object-cover",
  containerClassName = "w-[280px] min-w-[280px] text-left bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col cursor-pointer"
}) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const { toggleFavorite, isFavorite } = useFavorite();
  const [rating, setRating] = useState('0');
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await assessmentService.getAverageScoreBySpace(space._id);
        if (response && response.averageScore !== undefined) {
          setRating(response.averageScore.toString());
          setTotalReviews(response.totalReviews);
        } else {
          setRating('0');
          setTotalReviews(0);
        }
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        setRating('0');
        setTotalReviews(0);
      }
    };

    if (space._id) {
      fetchRating();
    }
  }, [space._id]);

  const handleCardClick = async (e) => {
    if (onClick) {
      onClick(e);
      return;
    }

    if (isLoggedIn && user) {
      try {
        await userService.registerSpaceView(user.id, space._id);
      } catch (error) {
        console.error('Erro ao registrar visualização:', error);
      }
    }
    navigate(`/espaco/${space._id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn || !user) return;
    try {
      await toggleFavorite(user.id, space._id);
    } catch (error) {
      console.error('Erro ao favoritar espaço:', error);
    }
  };

  const imageUrl = Array.isArray(space.image_url) 
    ? space.image_url[0] 
    : (space.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80");

  return (
    <div 
      className={`${containerClassName} ${className}`}
      onClick={handleCardClick}
      role="article"
      aria-label={`Espaço ${space.space_name}`}
    >
      <div className="relative w-full h-40">
        <img 
          src={imageUrl}
          alt={`Imagem do espaço ${space.space_name}`}
          className={imageClassName}
        />
        {showFavoriteButton && (
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 transition-colors"
            aria-label={isFavorite(space._id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            aria-pressed={isFavorite(space._id)}
          >
            <FaHeart 
              className={`text-xl ${isFavorite(space._id) ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      <div 
        className="p-4 flex flex-col gap-1 flex-1 min-h-[120px]"
        role="contentinfo"
      >
        <div className="flex items-center justify-between">
          <span 
            className="font-semibold text-base line-clamp-1"
            role="heading"
            aria-level="2"
          >
            {space.space_name}
          </span>
          <span 
            className="flex items-center gap-1 text-sm text-gray-700 flex-shrink-0"
            aria-label={`Avaliação média: ${rating} estrelas`}
          >
            <FaStar className="text-yellow-400" aria-hidden="true" />
            {rating}
          </span>
        </div>
        <span 
          className="text-xs text-gray-500 line-clamp-1"
          aria-label={`Localização: ${space.location?.formatted_address}`}
        >
          {truncateText(space.location?.formatted_address)}
        </span>
        <span 
          className="text-[#1486B8] font-semibold text-base"
          aria-label={`Preço: R$ ${space.price_per_hour} por hora`}
        >
          R$ {space.price_per_hour} <span className="text-xs font-normal text-gray-500">por hora</span>
        </span>
        <div className="flex items-center justify-between mt-auto">
          <span 
            className="text-xs text-gray-500"
            aria-label={`Capacidade máxima: ${space.max_people} pessoas`}
          >
            Cabe até <b>{space.max_people}</b> pessoas
          </span>
          <div 
            className="flex items-center text-gray-500 text-sm"
            aria-label={`Total de avaliações: ${totalReviews > 0 ? totalReviews : 'Sem avaliações'}`}
          >
            <FaClock className="mr-1" aria-hidden="true" />
            <span>{totalReviews > 0 ? `${totalReviews} avaliações` : 'Sem avaliações'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard; 