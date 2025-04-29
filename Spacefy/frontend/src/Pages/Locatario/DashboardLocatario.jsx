import React from "react";
import Header from "../../Components/Header/Header";

const DashboardLocatario = () => {
  return (
    <>
      <Header />
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem',
        marginTop: '2rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem' 
        }}>
          Dashboard do Locatário
        </h1>
        <p style={{ 
          fontSize: '1rem', 
          lineHeight: '1.5',
          marginBottom: '1rem'
        }}>
          Bem-vindo ao seu Dashboard! Aqui você poderá gerenciar todas as suas reservas,
          visualizar seus espaços favoritos, acompanhar seus pagamentos e muito mais.
          Este é o seu centro de controle para uma experiência completa na Spacefy.
        </p>
      </div>
    </>
  );
};

export default DashboardLocatario;
