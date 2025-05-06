import React, { useState } from 'react';
import SidebarDashboardLocatario from "../../Components/SidebarDashboardLocatario";
import Header from "../../Components/Header/Header";
import Dashboard_Home from "./Dashboard_Home";
import Dashboard_Reservas from "./Dashboard_Reservas";
import Dashboard_Perfil from "./Dashboard_Perfil";
import Dashboard_Mensagens from "./Dashboard_Mensagens";
import Dashboard_Espaco from "./Dashboard_Espaco";

export default function Dashboard() {
  const [paginaAtual, setPaginaAtual] = useState('Home');
  const [subEspacoSelecionado, setSubEspacoSelecionado] = useState(0);

  const handlePageChange = (pagina, subEspacoIdx) => {
    setPaginaAtual(pagina);
    if (pagina === 'Espaco' && typeof subEspacoIdx === 'number') {
      setSubEspacoSelecionado(subEspacoIdx);
    }
  };

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'Home':
        return <Dashboard_Home />;
      case 'Reservas':
        return <Dashboard_Reservas />;
      case 'Avaliacoes':
        return <div className="p-8">Página de Avaliações</div>;
      case 'Mensagens':
        return <Dashboard_Mensagens />;
      case 'Perfil':
        return <Dashboard_Perfil />;
      case 'Espaco':
        return <Dashboard_Espaco subEspacoSelecionado={subEspacoSelecionado} />;
      default:
        return <Dashboard_Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1BAAE9] to-[#093C6B]">
      <Header />
      <div className="flex flex-1">
        <SidebarDashboardLocatario onPageChange={handlePageChange} paginaAtual={paginaAtual} subEspacoSelecionado={subEspacoSelecionado} />
        <main className="flex-1">
          {renderizarPagina()}
        </main>
      </div>
    </div>
  );
} 