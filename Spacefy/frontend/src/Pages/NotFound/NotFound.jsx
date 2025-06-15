import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#1BAAE9] to-[#093C6B] flex items-center justify-center px-4"
      role="main"
      aria-label="Página não encontrada"
    >
      <div className="max-w-lg w-full text-center">
        <div className="relative mb-8">
          <h1 
            className="text-[150px] font-bold text-white floating-404"
            aria-label="Erro 404"
          >
            404
          </h1>
          <div 
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="absolute w-40 h-40 border-2 border-[#00A3FF] rounded-full rotating-circle"></div>
            <div className="absolute w-48 h-48 border border-[#1EACE3] rounded-full rotating-circle-reverse"></div>
          </div>
        </div>
        <div 
          className="relative mb-8"
          aria-hidden="true"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent"></div>
        </div>
        <h2 
          className="text-3xl font-bold text-white mb-4"
          aria-label="Mensagem de erro: Parece que você se perdeu"
        >
          Parece que você se perdeu...
        </h2>
        <p 
          className="text-gray-200 mb-8"
          aria-label="Explicação: Esta página não existe ou não está disponível"
        >
          Esta página não existe ou não está disponível.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-4 text-lg font-bold text-white bg-[#1EACE3] rounded-lg hover:bg-[#1486B8] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          aria-label="Botão para voltar à página inicial"
        >
          Voltar para o inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 