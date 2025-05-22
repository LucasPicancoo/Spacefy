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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Encontre o espaço ideal para o seu evento</h2>
        <p className="text-gray-600 text-center mb-12">Explore uma variedade de espaços, de salões a quadras, para todas as suas necessidades.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('espaco_estudio_quadra')}
          >
            <img src={Volei} alt="Esportes" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Um espaço para esportes?</h3>
              <p className="text-gray-600">Pratique seu esporte favorito! Encontre quadras e ambientes confortáveis para você treinar com qualidade.</p>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('sala_de_reuniões')}
          >
            <img src={Escritorio} alt="Reuniões" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Um lugar para reuniões?</h3>
              <p className="text-gray-600">Ambiente profissional e equipado para tornar suas reuniões mais produtivas.</p>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('salao_festas')}
          >
            <img src={SalaoDeFestas} alt="Festas" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Um salão para festas?</h3>
              <p className="text-gray-600">Espaço amplo, elegante e pronto para tornar seu evento inesquecível.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdealSpaceSection; 