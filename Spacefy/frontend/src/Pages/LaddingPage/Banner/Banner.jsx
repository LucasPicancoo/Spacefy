import React from 'react';
import banner from "../../../assets/Banner.svg";
import SearchBarLaddingPage from "../../../Components/SearchBar/SearchBarLaddingPage.jsx";

const Banner = () => {
  return (
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
  );
};

export default Banner; 