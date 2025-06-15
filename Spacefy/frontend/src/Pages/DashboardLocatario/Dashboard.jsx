import React, { useState, useEffect } from 'react';
import SidebarDashboardLocatario from "../../Components/SidebarDashboardLocatario";
import Header from "../../Components/Header/Header";
import Dashboard_Home from "./Dashboard_Home";
import Dashboard_Reservas from "./Dashboard_Reservas";
import Dashboard_Perfil from "./Dashboard_Perfil";
import Dashboard_Mensagens from "../Messages/Messages";
import Dashboard_Espaco from "./Dashboard_Espaco";
import Dashboard_Editar_Espaco from "./Dashboard_Editar_Espaco";
import { useUser } from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [paginaAtual, setPaginaAtual] = useState('Home');
  const [subEspacoSelecionado, setSubEspacoSelecionado] = useState(0);
  const [espacoParaEditar, setEspacoParaEditar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { isLoggedIn, user } = useUser();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "locatario") {
      navigate("/NotFound");
    }
    setIsLoading(false);
  }, [isLoggedIn, user?.role, navigate]);

  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-[#1BAAE9] to-[#093C6B] flex items-center justify-center"
        role="status"
        aria-label="Carregando dashboard"
      >
        <div 
          className="text-white text-xl"
          aria-label="Aguarde, carregando conteúdo"
        >
          Carregando...
        </div>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== "locatario") {
    return null;
  }

  const handlePageChange = (pagina, subEspacoIdx) => {
    setPaginaAtual(pagina);
    if (pagina === 'Espaco' && typeof subEspacoIdx === 'number') {
      setSubEspacoSelecionado(subEspacoIdx);
    }
  };

  const handleEditarEspaco = (espaco) => {
    setEspacoParaEditar(espaco);
    setPaginaAtual('EditarEspaco');
  };

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'Home':
        return <Dashboard_Home aria-label="Página inicial do dashboard" />;
      case 'Reservas':
        return <Dashboard_Reservas aria-label="Página de reservas" />;
      case 'Avaliacoes':
        return (
          <div 
            className="p-8"
            role="region"
            aria-label="Página de avaliações"
          >
            Página de Avaliações
          </div>
        );
      case 'Mensagens':
        return <Dashboard_Mensagens showHeader={false} aria-label="Página de mensagens" />;
      case 'Perfil':
        return <Dashboard_Perfil aria-label="Página de perfil" />;
      case 'Espaco':
        return (
          <Dashboard_Espaco 
            subEspacoSelecionado={subEspacoSelecionado} 
            onEditarEspaco={handleEditarEspaco}
            aria-label="Página de gerenciamento de espaços"
          />
        );
      case 'EditarEspaco':
        return (
          <Dashboard_Editar_Espaco 
            espaco={espacoParaEditar} 
            onVoltar={() => {
              setPaginaAtual('Espaco');
              setEspacoParaEditar(null);
            }}
            aria-label="Página de edição de espaço"
          />
        );
      default:
        return <Dashboard_Home aria-label="Página inicial do dashboard" />;
    }
  };

  return (
    <div 
      className="flex flex-col min-h-screen bg-gradient-to-br from-[#1BAAE9] to-[#093C6B]"
      role="main"
      aria-label="Dashboard do locatário"
    >
      <Header />
      <div 
        className="flex flex-1"
        role="region"
        aria-label="Área principal do dashboard"
      >
        <SidebarDashboardLocatario 
          onPageChange={handlePageChange} 
          paginaAtual={paginaAtual} 
          subEspacoSelecionado={subEspacoSelecionado}
          aria-label="Menu de navegação do dashboard"
        />
        <main 
          className="flex-1"
          role="region"
          aria-label={`Conteúdo da página ${paginaAtual}`}
        >
          {renderizarPagina()}
        </main>
      </div>
    </div>
  );
} 