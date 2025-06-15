import React from 'react';
import { useNavigate } from 'react-router-dom';
import Volei from "../../../assets/Spaces/Volei.jpg";
import Escritorio from "../../../assets/Spaces/Escritorio.jpg";
import SalaoDeFestas from "../../../assets/Spaces/SalaoDeFestas.jpg";

const IdealSpaceSection = () => {
  const navigate = useNavigate();

  const handleCardClick = (tipoEspaco) => {
    navigate('/Descobrir', { 
      state: { 
        filtros: {
          tipoEspaco: tipoEspaco,
          ordenarPor: 'asc',
          valorMin: '',
          valorMax: '',
          areaMin: '',
          areaMax: '',
          pessoasMin: '',
          caracteristicas: []
        }
      }
    });
  };

  return (
    <section 
      className="py-16 bg-gray-50"
      role="region"
      aria-label="Seção de espaços ideais para eventos"
    >
      <div className="container mx-auto px-4">
        <h2 
          className="text-3xl font-bold text-center mb-2"
          aria-label="Encontre o espaço ideal para o seu evento"
        >
          Encontre o espaço ideal para o seu evento
        </h2>
        <p 
          className="text-gray-600 text-center mb-12"
          aria-label="Explore uma variedade de espaços, de salões a quadras, para todas as suas necessidades"
        >
          Explore uma variedade de espaços, de salões a quadras, para todas as suas necessidades.
        </p>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          role="list"
          aria-label="Lista de tipos de espaços disponíveis"
        >
          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('espaco_estudio_quadra')}
            role="listitem"
            tabIndex="0"
            aria-label="Espaço para esportes"
            onKeyPress={(e) => e.key === 'Enter' && handleCardClick('espaco_estudio_quadra')}
          >
            <img 
              src={Volei} 
              alt="Quadra de esportes" 
              className="w-full h-48 object-cover"
              aria-label="Imagem de uma quadra de esportes"
            />
            <div className="p-6">
              <h3 
                className="text-xl font-bold mb-2"
                aria-label="Um espaço para esportes?"
              >
                Um espaço para esportes?
              </h3>
              <p 
                className="text-gray-600"
                aria-label="Pratique seu esporte favorito! Encontre quadras e ambientes confortáveis para você treinar com qualidade"
              >
                Pratique seu esporte favorito! Encontre quadras e ambientes confortáveis para você treinar com qualidade.
              </p>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('sala_de_reuniões')}
            role="listitem"
            tabIndex="0"
            aria-label="Espaço para reuniões"
            onKeyPress={(e) => e.key === 'Enter' && handleCardClick('sala_de_reuniões')}
          >
            <img 
              src={Escritorio} 
              alt="Sala de reuniões" 
              className="w-full h-48 object-cover"
              aria-label="Imagem de uma sala de reuniões"
            />
            <div className="p-6">
              <h3 
                className="text-xl font-bold mb-2"
                aria-label="Um lugar para reuniões?"
              >
                Um lugar para reuniões?
              </h3>
              <p 
                className="text-gray-600"
                aria-label="Ambiente profissional e equipado para tornar suas reuniões mais produtivas"
              >
                Ambiente profissional e equipado para tornar suas reuniões mais produtivas.
              </p>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('salao_festas')}
            role="listitem"
            tabIndex="0"
            aria-label="Espaço para festas"
            onKeyPress={(e) => e.key === 'Enter' && handleCardClick('salao_festas')}
          >
            <img 
              src={SalaoDeFestas} 
              alt="Salão de festas" 
              className="w-full h-48 object-cover"
              aria-label="Imagem de um salão de festas"
            />
            <div className="p-6">
              <h3 
                className="text-xl font-bold mb-2"
                aria-label="Um salão para festas?"
              >
                Um salão para festas?
              </h3>
              <p 
                className="text-gray-600"
                aria-label="Espaço amplo, elegante e pronto para tornar seu evento inesquecível"
              >
                Espaço amplo, elegante e pronto para tornar seu evento inesquecível.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdealSpaceSection; 