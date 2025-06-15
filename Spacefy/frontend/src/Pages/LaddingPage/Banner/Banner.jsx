import React from 'react';
import banner from "../../../assets/Banner.svg";
import SearchBarLaddingPage from "../../../Components/SearchBar/SearchBarLaddingPage.jsx";

const Banner = () => {
  return (
    <section
      role="banner"
      aria-label="Banner principal da página"
    >
      <div 
        className="relative w-full h-[50vh]"
        role="img"
        aria-label="Imagem de fundo do banner"
      >
        <img
          src={banner}
          alt="Banner decorativo da página inicial"
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 flex flex-col justify-center items-start text-white p-35"
          role="contentinfo"
          aria-label="Conteúdo do banner"
        >
          <h2 
            className="text-4xl font-bold"
            aria-label="Seu espaço ideal, perto de você"
          >
            Seu espaço ideal, perto de você.
          </h2>
          <p 
            className="text-4xl font-bold"
            aria-label="Encontre, reserve e aproveite com facilidade"
          >
            Encontre, reserve e aproveite com facilidade!
          </p>
        </div>
      </div>
      <div 
        className="relative -mt-10 z-10"
        role="search"
        aria-label="Barra de pesquisa de espaços"
      >
        <SearchBarLaddingPage />
      </div>
    </section>
  );
};

export default Banner; 