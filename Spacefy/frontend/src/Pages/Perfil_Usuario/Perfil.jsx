import React, { useState, useRef } from "react";
import Header from "../../Components/Header/Header";
import { FaHeart, FaStar, FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useUser } from "../../Contexts/userContext";
import { useNavigate } from "react-router-dom";
import BecomeRenterModal from "../../Components/Modal/BecomeRenterModal";

const mockCards = [
  {
    id: 1,
    titulo: "Porto Belo",
    cidade: "Muriaé - MG",
    endereco: "Rua Leonídio Valentim Ferreira",
    preco: "R$ 2.000",
    area: "200 m²",
    nota: 4.8,
    avaliacoes: 268,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    titulo: "Palácio de Cristal",
    cidade: "Petrópolis - RJ",
    endereco: "Rua Alfredo Pachá",
    preco: "R$ 3.500",
    area: "350 m²",
    nota: 4.9,
    avaliacoes: 312,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    titulo: "Vila Mariana",
    cidade: "São Paulo - SP",
    endereco: "Rua Joaquim Távora",
    preco: "R$ 2.800",
    area: "280 m²",
    nota: 4.7,
    avaliacoes: 189,
    favorito: false,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    titulo: "Centro Cultural",
    cidade: "Belo Horizonte - MG",
    endereco: "Avenida Afonso Pena",
    preco: "R$ 1.800",
    area: "250 m²",
    nota: 4.6,
    avaliacoes: 156,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    titulo: "Espaço Moderno",
    cidade: "Curitiba - PR",
    endereco: "Rua XV de Novembro",
    preco: "R$ 2.200",
    area: "300 m²",
    nota: 4.5,
    avaliacoes: 234,
    favorito: false,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 6,
    titulo: "Salão Nobre",
    cidade: "Porto Alegre - RS",
    endereco: "Avenida Borges de Medeiros",
    preco: "R$ 2.500",
    area: "320 m²",
    nota: 4.8,
    avaliacoes: 178,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 7,
    titulo: "Centro de Eventos",
    cidade: "Salvador - BA",
    endereco: "Avenida Tancredo Neves",
    preco: "R$ 3.000",
    area: "400 m²",
    nota: 4.7,
    avaliacoes: 245,
    favorito: false,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 8,
    titulo: "Espaço Premium",
    cidade: "Recife - PE",
    endereco: "Rua do Sol",
    preco: "R$ 2.700",
    area: "280 m²",
    nota: 4.9,
    avaliacoes: 198,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 9,
    titulo: "Salão de Festas",
    cidade: "Fortaleza - CE",
    endereco: "Avenida Beira Mar",
    preco: "R$ 2.300",
    area: "260 m²",
    nota: 4.6,
    avaliacoes: 167,
    favorito: false,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 10,
    titulo: "Centro de Convenções",
    cidade: "Brasília - DF",
    endereco: "Setor de Clubes Esportivos",
    preco: "R$ 3.200",
    area: "380 m²",
    nota: 4.8,
    avaliacoes: 289,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 11,
    titulo: "Porto Belo",
    cidade: "Muriaé - MG",
    endereco: "Rua Leonídio Valentim Ferreira",
    preco: "R$ 2.000",
    area: "200 m²",
    nota: 4.8,
    avaliacoes: 268,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 12,
    titulo: "Palácio de Cristal",
    cidade: "Petrópolis - RJ",
    endereco: "Rua Alfredo Pachá",
    preco: "R$ 3.500",
    area: "350 m²",
    nota: 4.9,
    avaliacoes: 312,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 13,
    titulo: "Vila Mariana",
    cidade: "São Paulo - SP",
    endereco: "Rua Joaquim Távora",
    preco: "R$ 2.800",
    area: "280 m²",
    nota: 4.7,
    avaliacoes: 189,
    favorito: false,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 14,
    titulo: "Centro Cultural",
    cidade: "Belo Horizonte - MG",
    endereco: "Avenida Afonso Pena",
    preco: "R$ 1.800",
    area: "250 m²",
    nota: 4.6,
    avaliacoes: 156,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 15,
    titulo: "Espaço Moderno",
    cidade: "Curitiba - PR",
    endereco: "Rua XV de Novembro",
    preco: "R$ 2.200",
    area: "300 m²",
    nota: 4.5,
    avaliacoes: 234,
    favorito: false,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 16,
    titulo: "Salão Nobre",
    cidade: "Porto Alegre - RS",
    endereco: "Avenida Borges de Medeiros",
    preco: "R$ 2.500",
    area: "320 m²",
    nota: 4.8,
    avaliacoes: 178,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 17,
    titulo: "Centro de Eventos",
    cidade: "Salvador - BA",
    endereco: "Avenida Tancredo Neves",
    preco: "R$ 3.000",
    area: "400 m²",
    nota: 4.7,
    avaliacoes: 245,
    favorito: false,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 18,
    titulo: "Espaço Premium",
    cidade: "Recife - PE",
    endereco: "Rua do Sol",
    preco: "R$ 2.700",
    area: "280 m²",
    nota: 4.9,
    avaliacoes: 198,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 19,
    titulo: "Salão de Festas",
    cidade: "Fortaleza - CE",
    endereco: "Avenida Beira Mar",
    preco: "R$ 2.300",
    area: "260 m²",
    nota: 4.6,
    avaliacoes: 167,
    favorito: false,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 20,
    titulo: "Centro de Convenções",
    cidade: "Brasília - DF",
    endereco: "Setor de Clubes Esportivos",
    preco: "R$ 3.200",
    area: "380 m²",
    nota: 4.8,
    avaliacoes: 289,
    favorito: true,
    imagem: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  }
];

const Perfil = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [ratedPage, setRatedPage] = useState(0);
  const [rentedPage, setRentedPage] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [isBecomeRenterModalOpen, setIsBecomeRenterModalOpen] = useState(false);
  const recentCarouselRef = useRef(null);
  const ratedCarouselRef = useRef(null);
  const rentedCarouselRef = useRef(null);

  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return <div>Você precisa estar logado para ver o perfil.</div>;
  }

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phoneNumber;
  };

  const scrollRecentCarousel = (direction) => {
    if (recentCarouselRef.current) {
      const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
      const totalCards = mockCards.length;
      const cardsPerPage = Math.floor(recentCarouselRef.current.clientWidth / 250);
      const maxPages = Math.ceil(totalCards / cardsPerPage);
      
      if (newPage >= 0 && newPage < maxPages) {
        const scrollAmount = recentCarouselRef.current.clientWidth;
        recentCarouselRef.current.scrollTo({
          left: scrollAmount * newPage,
          behavior: 'smooth'
        });
        setCurrentPage(newPage);
      }
    }
  };

  const scrollRatedCarousel = (direction) => {
    if (ratedCarouselRef.current) {
      const newPage = direction === 'next' ? ratedPage + 1 : ratedPage - 1;
      const totalCards = mockCards.length;
      const cardsPerPage = Math.floor(ratedCarouselRef.current.clientWidth / 250);
      const maxPages = Math.ceil(totalCards / cardsPerPage);
      
      if (newPage >= 0 && newPage < maxPages) {
        const scrollAmount = ratedCarouselRef.current.clientWidth;
        ratedCarouselRef.current.scrollTo({
          left: scrollAmount * newPage,
          behavior: 'smooth'
        });
        setRatedPage(newPage);
      }
    }
  };

  const scrollRentedCarousel = (direction) => {
    if (rentedCarouselRef.current) {
      const newPage = direction === 'next' ? rentedPage + 1 : rentedPage - 1;
      const totalCards = mockCards.length;
      const cardsPerPage = Math.floor(rentedCarouselRef.current.clientWidth / 250);
      const maxPages = Math.ceil(totalCards / cardsPerPage);
      
      if (newPage >= 0 && newPage < maxPages) {
        const scrollAmount = rentedCarouselRef.current.clientWidth;
        rentedCarouselRef.current.scrollTo({
          left: scrollAmount * newPage,
          behavior: 'smooth'
        });
        setRentedPage(newPage);
      }
    }
  };

  const handleFavorite = (itemId) => {
    setFavorites(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 w-full mx-auto py-8 overflow-hidden">
        <section className="flex gap-8 mb-8 px-4">
          {/* Card do Usuário */}
          <aside className="w-70 self-start sticky top-4">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span role="img" aria-label="avatar" className="text-3xl">👤</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">{user?.name} {user?.surname}</h2>
                  <p className="text-gray-600 text-sm">Usuário</p>
                </div>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/EditarPerfilUsuario')} 
                  className="w-full bg-[#00A3FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0084CC] transition-colors cursor-pointer"
                >
                  Editar Perfil
                </button>
                <button 
                  onClick={() => setIsBecomeRenterModalOpen(true)} 
                  className="w-full bg-white border-2 border-[#00A3FF] text-[#00A3FF] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00A3FF] hover:text-white transition-colors cursor-pointer"
                >
                  Virar Locatário
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Sobre o usuário</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm">{user?.name} {user?.surname}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{user?.email || "Não informado"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{formatPhoneNumber(user?.telephone) || "Não informado"}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Conteúdo principal */}
          <section className="flex-1 flex flex-col gap-8 overflow-hidden">
            {/* Vistos recentemente */}
            <section className="overflow-hidden">
              <h2 className="font-bold text-lg mb-2 px-4">Vistos recentemente:</h2>
              <div className="relative">
                <div 
                  ref={recentCarouselRef}
                  className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar scroll-smooth"
                  style={{
                    scrollSnapType: 'x mandatory',
                    scrollPadding: '0 16px',
                  }}
                >
                  {mockCards.map((card) => (
                    <div 
                      key={card.id} 
                      className="min-w-[250px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <div className="relative">
                        <img src={card.imagem} alt={card.titulo} className="w-full h-40 object-cover" />
                        <button 
                          onClick={() => handleFavorite(card.id)}
                          className="absolute top-4 right-4 transition-colors"
                        >
                          <FaHeart className={`text-xl ${favorites[card.id] ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors`} />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{card.titulo}</h3>
                            <p className="text-gray-600 text-sm">{card.cidade}</p>
                            <p className="text-gray-500 text-xs">{card.endereco}</p>
                          </div>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="font-semibold">{card.nota}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <p className="text-[#00A3FF] font-bold">{card.preco}</p>
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
                {/* Botões de navegação */}
                {currentPage > 0 && (
                  <button 
                    onClick={() => scrollRecentCarousel('prev')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 ml-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                  >
                    <FaChevronLeft className="text-lg" />
                  </button>
                )}
                {currentPage < Math.ceil(mockCards.length / Math.floor(recentCarouselRef.current?.clientWidth / 250 || 1)) - 1 && (
                  <button 
                    onClick={() => scrollRecentCarousel('next')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 mr-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                  >
                    <FaChevronRight className="text-lg" />
                  </button>
                )}
              </div>
            </section>

            {/* Favoritos */}
            <section className="overflow-hidden">
              <h2 className="font-bold text-lg mb-2 px-4">Favoritos:</h2>
              <div className="relative">
                <div 
                  ref={ratedCarouselRef}
                  className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar scroll-smooth"
                  style={{
                    scrollSnapType: 'x mandatory',
                    scrollPadding: '0 16px',
                  }}
                >
                  {mockCards.map((card) => (
                    <div 
                      key={card.id} 
                      className="min-w-[250px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <div className="relative">
                        <img src={card.imagem} alt={card.titulo} className="w-full h-40 object-cover" />
                        <button 
                          onClick={() => handleFavorite(card.id)}
                          className="absolute top-4 right-4 transition-colors"
                        >
                          <FaHeart className={`text-xl ${favorites[card.id] ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors`} />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{card.titulo}</h3>
                            <p className="text-gray-600 text-sm">{card.cidade}</p>
                            <p className="text-gray-500 text-xs">{card.endereco}</p>
                          </div>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="font-semibold">{card.nota}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <p className="text-[#00A3FF] font-bold">{card.preco}</p>
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
                {/* Botões de navegação */}
                {ratedPage > 0 && (
                  <button 
                    onClick={() => scrollRatedCarousel('prev')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 ml-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                  >
                    <FaChevronLeft className="text-lg" />
                  </button>
                )}
                {ratedPage < Math.ceil(mockCards.length / Math.floor(ratedCarouselRef.current?.clientWidth / 250 || 1)) - 1 && (
                  <button 
                    onClick={() => scrollRatedCarousel('next')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 mr-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                  >
                    <FaChevronRight className="text-lg" />
                  </button>
                )}
              </div>
            </section>

            {/* Alugados por você */}
            <section className="overflow-hidden">
              <h2 className="font-bold text-lg mb-2 px-4">Alugados por você:</h2>
              <div className="relative">
                <div 
                  ref={rentedCarouselRef}
                  className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar scroll-smooth"
                  style={{
                    scrollSnapType: 'x mandatory',
                    scrollPadding: '0 16px',
                  }}
                >
                  {mockCards.map((card) => (
                    <div 
                      key={card.id} 
                      className="min-w-[250px] bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <div className="relative">
                        <img src={card.imagem} alt={card.titulo} className="w-full h-40 object-cover" />
                        <button 
                          onClick={() => handleFavorite(card.id)}
                          className="absolute top-4 right-4 transition-colors"
                        >
                          <FaHeart className={`text-xl ${favorites[card.id] ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors`} />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{card.titulo}</h3>
                            <p className="text-gray-600 text-sm">{card.cidade}</p>
                            <p className="text-gray-500 text-xs">{card.endereco}</p>
                          </div>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="font-semibold">{card.nota}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <p className="text-[#00A3FF] font-bold">{card.preco}</p>
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
                {/* Botões de navegação */}
                {rentedPage > 0 && (
                  <button 
                    onClick={() => scrollRentedCarousel('prev')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 ml-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                  >
                    <FaChevronLeft className="text-lg" />
                  </button>
                )}
                {rentedPage < Math.ceil(mockCards.length / Math.floor(rentedCarouselRef.current?.clientWidth / 250 || 1)) - 1 && (
                  <button 
                    onClick={() => scrollRentedCarousel('next')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 mr-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                  >
                    <FaChevronRight className="text-lg" />
                  </button>
                )}
              </div>
            </section>

            {/* Avaliações feitas por você */}
            <section>
              <h2 className="font-bold text-lg mb-2 px-4">Avaliações feitas por você:</h2>
              <div className="text-gray-500 text-sm px-4">Você ainda não fez uma avaliação.</div>
            </section>
          </section>
        </section>
      </main>
      <BecomeRenterModal 
        isOpen={isBecomeRenterModalOpen}
        onClose={() => setIsBecomeRenterModalOpen(false)}
      />
    </div>
  );
};

export default Perfil;
