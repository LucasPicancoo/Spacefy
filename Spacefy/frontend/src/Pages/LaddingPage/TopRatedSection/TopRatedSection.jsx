import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaHeart, FaStar, FaClock } from 'react-icons/fa';
import { assessmentService } from '../../../services/assessmentService';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../Contexts/UserContext';
import { userService } from '../../../services/userService';
import { useFavorite } from '../../../Contexts/FavoriteContext';

const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const TopRatedSection = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const { toggleFavorite, isFavorite } = useFavorite();
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

  const handleFavorite = async (spaceId) => {
    if (!isLoggedIn || !user) return;
    try {
      await toggleFavorite(user.id, spaceId);
    } catch (error) {
      console.error('Erro ao favoritar espaço:', error);
    }
  };

  const handleCardClick = async (spaceId) => {
    if (isLoggedIn && user) {
      try {
        await userService.registerSpaceView(user.id, spaceId);
      } catch (error) {
        console.error('Erro ao registrar visualização:', error);
      }
    }
    navigate(`/espaco/${spaceId}`);
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
            {topRatedSpaces.map((space) => (
              <div 
                key={space._id} 
                className="min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0 cursor-pointer hover:shadow-xl transition-shadow"
                style={{ scrollSnapAlign: 'start' }}
                onClick={() => handleCardClick(space._id)}
              >
                <div className="relative">
                  <img
                    src={space.image_url?.[0] || space.image_url}
                    alt={space.space_name}
                    className="w-full h-48 object-cover"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(space._id);
                    }}
                    className="absolute top-4 right-4 transition-colors"
                  >
                    <FaHeart 
                      className={`text-xl ${isFavorite(space._id) ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{space.space_name}</h3>
                      <p className="text-gray-600 text-sm">{truncateText(space.location?.formatted_address)}</p>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-semibold">{space.averageScore.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-[#00A3FF] font-bold">R$ {space.price_per_hour}</p>
                      <p className="text-gray-500 text-xs">por hora</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaClock className="mr-1" />
                      <span>{space.totalReviews} avaliações</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ratedPage > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                scrollRatedCarousel('prev');
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
            >
              <FaChevronLeft className="text-xl" />
            </button>
          )}
          {ratedPage < totalPages - 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                scrollRatedCarousel('next');
              }}
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