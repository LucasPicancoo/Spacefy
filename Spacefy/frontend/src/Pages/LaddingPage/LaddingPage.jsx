import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import SearchBarLaddingPage from "../../Components/SearchBar/SearchBarLaddingPage.jsx";
import banner from "../../assets/Banner.svg";
import Volei from "../../assets/Spaces/Volei.jpg";
import Escritorio from "../../assets/Spaces/Escritorio.jpg";
import SalaoDeFestas from "../../assets/Spaces/SalaoDeFestas.jpg";
import { FaParking, FaWifi, FaSwimmingPool, FaUmbrellaBeach, FaChevronLeft, FaChevronRight, FaHeart, FaStar, FaClock, FaEnvelope, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdAir, MdTv } from 'react-icons/md';
import { GiBarbecue } from 'react-icons/gi';
import { FaFacebookF, FaPinterestP, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import Logo from "../../assets/Logo.svg";

const Landing = () => {
  // const navigate = useNavigate();  //Vai ser ustilizado nas divs abaixo
  const [selectedAmenity, setSelectedAmenity] = useState('parking');
  const [currentPage, setCurrentPage] = useState(0);
  const [ratedPage, setRatedPage] = useState(0);
  const [favorites, setFavorites] = useState({});
  const carouselRef = useRef(null);
  const ratedCarouselRef = useRef(null);
  const totalPages = 3; // Fixado em 3 páginas
  const [openQuestion, setOpenQuestion] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleAmenityClick = (amenity) => {
    // Sempre atualiza para o novo amenity, não permite desmarcar
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
      
      // Previne navegação além dos limites
      if (newPage < 0 || newPage >= totalPages) return;
      
      const scrollAmount = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: scrollAmount * newPage,
        behavior: 'smooth'
      });
      
      setCurrentPage(newPage);
    }
  };

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

  const toggleQuestion = (index) => {
    if (openQuestion === index) {
      setOpenQuestion(null);
    } else {
      setOpenQuestion(index);
    }
  };

  const faqQuestions = [
    {
      question: "Como faço para reservar um espaço?",
      answer: "Para reservar um espaço, basta selecionar o local desejado, escolher a data e horário disponíveis e efetuar o pagamento. Todo o processo é feito de forma simples e rápida através da nossa plataforma."
    },
    {
      question: "Quais tipos de espaços estão disponíveis?",
      answer: "Oferecemos uma ampla variedade de espaços, incluindo salões de festa, quadras esportivas, salas de reunião, espaços para eventos e muito mais. Cada espaço é cuidadosamente selecionado para atender diferentes necessidades."
    },
    {
      question: "Os espaços podem ser alugados por hora ou apenas por diária?",
      answer: "Sim, oferecemos flexibilidade na locação. Dependendo do espaço, você pode alugar tanto por hora quanto por diária, permitindo que você escolha a opção que melhor atende suas necessidades."
    },
    {
      question: "Posso cancelar uma reserva?",
      answer: "Sim, você pode cancelar uma reserva. As políticas de cancelamento podem variar de acordo com o espaço e a antecedência do cancelamento. Recomendamos verificar as políticas específicas no momento da reserva."
    },
    {
      question: "Como posso entrar em contato para tirar dúvidas?",
      answer: "Você pode entrar em contato conosco através do nosso chat online, email de suporte ou telefone. Nossa equipe está disponível para ajudar com qualquer dúvida ou necessidade."
    }
  ];

  const handleClick = (e) => {
    e.preventDefault();
  };

  const handleFavorite = (itemId) => {
    setFavorites(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Header />

      {/* Banner */}
      <section>
        <div className="relative w-full h-[50vh]">
          <img
            src={banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-start text-white p-35">
            <h2 className="text-4xl font-bold">
              Seu espaço ideal, perto de você.
            </h2>
            <p className="text-4xl font-bold">
              Encontre, reserve e aproveite com facilidade!
            </p>
          </div>
        </div>
        <div className="relative -mt-10 z-10">
          <SearchBarLaddingPage />
        </div>
      </section>

      {/* Banner de Login */}
      <section className="py-7">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-r from-[#105B99] to-[#083A63] rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-white">
                <FaEnvelope className="text-3xl" />
              </div>
              <p className="text-white text-lg">
                Faça login e receba ofertas exclusivas, descontos e novidades sobre os melhores espaços!
              </p>
            </div>
            <button className="bg-[#00A3FF] text-white px-6 py-2 rounded-lg hover:bg-[#0084CC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:ring-opacity-50">
              Fazer Login
            </button>
          </div>
        </div>
      </section>

      {/* Encontre o espaço ideal */} 
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Encontre o espaço ideal para o seu evento</h2>
          <p className="text-gray-600 text-center mb-12">Explore uma variedade de espaços, de salões a quadras, para todas as suas necessidades.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


            {/* Cards */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={Volei} alt="Esportes" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Um espaço para esportes?</h3>
                <p className="text-gray-600">Pratique seu esporte favorito! Encontre quadras e ambientes confortáveis para você treinar com qualidade.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={Escritorio} alt="Reuniões" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Um lugar para reuniões?</h3>
                <p className="text-gray-600">Ambiente profissional e equipado para tornar suas reuniões mais produtivas.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={SalaoDeFestas} alt="Festas" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Um salão para festas?</h3>
                <p className="text-gray-600">Espaço amplo, elegante e pronto para tornar seu evento inesquecível.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Personalize sua experiência */}
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

            {/* Botões de navegação */}
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

            {/* Indicadores de página */}
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

      {/* Espaços melhores avaliados */}
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

            {/* Botões de navegação */}
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

            {/* Indicadores de página */}
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

      {/* FAQ - Perguntas Frequentes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Tem Perguntas?</h2>
            <p className="text-2xl font-bold">Nós Temos as Respostas!</p>
          </div>

          <div className="space-y-4">
            {faqQuestions.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <FaChevronDown 
                    className={`text-gray-400 transition-transform duration-200 ${
                      openQuestion === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openQuestion === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          {/* Logo e Linha Superior */}
          <div className="border-b border-[#00A3FF] pb-8 mb-8 flex items-center gap-4">
            <img src={Logo} alt="Spacefy" className="h-12" />
            <span className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-[#1EACE3] to-[#152F6C] bg-clip-text text-transparent tracking-widest">
              SPACEFY
            </span>
          </div>

          {/* Grid de Links */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            {/* Spacefy */}
            <div>
              <ul className="space-y-2">
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Quem somos</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Cadastro/Login</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Trabalhe conosco</a></li>
              </ul>
            </div>

            {/* Hospedagem */}
            <div>
              <h3 className="font-bold mb-4">Hospedagem</h3>
              <ul className="space-y-2">
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Anuncie seu espaço</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Mais bem avaliados</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Quadras poliesportivas</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Locais para festas</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Casas de show</a></li>
              </ul>
            </div>

            {/* Central de Atendimento */}
            <div>
              <h3 className="font-bold mb-4">Central de Atendimento</h3>
              <ul className="space-y-2">
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Central de Ajuda</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Contate-nos</a></li>
                <li><span className="text-gray-600">(00) 0000 - 0000</span></li>
                <li><span className="text-gray-600">Segunda a Sexta: 08h às 18h</span></li>
                <li><span className="text-gray-600">Sábados e Feriados Nacionais: 09h às 16h</span></li>
              </ul>
            </div>

            {/* Termos */}
            <div>
              <h3 className="font-bold mb-4">Termos</h3>
              <ul className="space-y-2">
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Termos de uso do site</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Política de privacidade</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Política de Cancelamento e Reembolso</a></li>
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Política de Pagamento</a></li>
              </ul>
            </div>

            {/* App */}
            <div>
              <h3 className="font-bold mb-4">App</h3>
              <ul className="space-y-2">
                <li><a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF]">Baixe o nosso aplicativo</a></li>
              </ul>
            </div>
          </div>

          {/* Redes Sociais e Copyright */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-6">
              <a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF] transition-colors">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF] transition-colors">
                <FaPinterestP className="text-xl" />
              </a>
              <a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF] transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF] transition-colors">
                <FaYoutube className="text-xl" />
              </a>
              <a href="/" onClick={handleClick} className="text-gray-600 hover:text-[#00A3FF] transition-colors">
                <FaInstagram className="text-xl" />
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              Copyright © 2025, Spacefy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Botão de voltar ao topo */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#00A3FF] text-white p-4 rounded-full shadow-lg hover:bg-[#0084CC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:ring-opacity-50 z-50"
          aria-label="Voltar ao topo"
        >
          <FaChevronUp className="text-xl" />
        </button>
      )}
    </>
  );
};

export default Landing;
