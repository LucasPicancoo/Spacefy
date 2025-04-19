import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title, StyledButton } from "./StyledLaddingPage";
import Header from "../../Components/Header/Header";
import banner from "../../assets/Banner.svg";

const Landing = () => {
  const navigate = useNavigate();

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
      </section>
      <Title>Bem-vindo à Landing Page</Title>
      <StyledButton onClick={() => navigate("/home")}>
        Ir para Home
      </StyledButton>
    </>
  );
};

export default Landing;
