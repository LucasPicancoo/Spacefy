import React from "react";
// import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import SearchBarLaddingPage from "../../Components/SearchBar/SearchBarLaddingPage.jsx";
import banner from "../../assets/Banner.svg";
import Volei from "../../assets/Spaces/Volei.jpg";
import Escritorio from "../../assets/Spaces/Escritorio.jpg";
import SalaoDeFestas from "../../assets/Spaces/SalaoDeFestas.jpg";

const Landing = () => {
  // const navigate = useNavigate();  //Vai ser ustilizado nas divs abaixo

  return (
    <>
      <Header />
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
      <section>
      <div className="relative w-full h-[30vh]">
      </div>
      
      </section>

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
    </>
  );
};

export default Landing;
