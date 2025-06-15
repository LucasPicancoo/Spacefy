import React, { useState, useEffect } from "react";
import CommentsModal from "../../Components/CommentsModal";
import { spaceService } from '../../services/spaceService';
import SpaceCard from "../../Components/SpaceCard/SpaceCard";
import { useUser } from "../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard_Perfil() {
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/NotFound");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Buscar espaços do usuário
        const spacesData = await spaceService.getSpacesByOwnerId(user.id);
        setEspacos(spacesData);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isLoggedIn, navigate]);

  if (loading) {
    return (
      <div 
        className="flex justify-center items-center h-screen"
        role="status"
        aria-label="Carregando perfil do usuário"
      >
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <div 
        className="flex justify-center items-center h-screen"
        role="alert"
        aria-label="Usuário não encontrado"
      >
        Usuário não encontrado
      </div>
    );
  }

  return (
    <div 
      className="p-8 flex flex-col gap-10 h-full w-full"
      role="main"
      aria-label="Perfil do locatário"
    >
      <div className="flex flex-col md:flex-row gap-12 w-full">
        {/* Card lateral */}
        <div 
          className="w-full md:w-96 flex-shrink-0 flex flex-col gap-6"
          role="complementary"
          aria-label="Informações do perfil"
        >
          <div 
            className="bg-white rounded-xl shadow p-8 flex flex-col items-center"
            role="region"
            aria-label="Dados do usuário"
          >
            <div 
              className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-4"
              role="img"
              aria-label="Avatar do usuário"
            >
              <svg 
                className="w-16 h-16 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-center">
              <div 
                className="font-bold text-2xl"
                aria-label={`Nome do usuário: ${user.name} ${user.surname}`}
              >
                {user.name} {user.surname}
              </div>
              <div 
                className="text-gray-500 text-base"
                aria-label="Tipo de usuário: Locatário"
              >
                Locatário
              </div>
            </div>
          </div>
          <div 
            className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 text-base items-stretch"
            role="region"
            aria-label="Estatísticas do anunciante"
          >
            <div 
              className="font-bold text-gray-700 mb-1 text-lg"
              aria-label="Sobre o anunciante"
            >
              Sobre o anunciante
            </div>
            <div 
              className="flex items-center gap-2 text-gray-700"
              aria-label={`${espacos.length} imóveis cadastrados`}
            >
              <span className="font-bold">{espacos.length}</span> imóveis cadastrados
            </div>
            <div 
              className="flex items-center gap-2 text-gray-700"
              aria-label="Avaliação média: 4.2 de 5 estrelas em 183 avaliações"
            >
              <svg 
                className="w-5 h-5 text-yellow-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
              4.2/5 (183 avaliações)
            </div>
            <button 
              className="mt-3 bg-[#1486B8] hover:bg-[#0f6a94] text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out" 
              onClick={() => setShowCommentsModal(true)}
              aria-label="Ver todas as avaliações"
            >
              Ver avaliações
            </button>
          </div>
        </div>
        {/* Conteúdo principal */}
        <div 
          className="flex-1 bg-white rounded-xl shadow p-12 flex flex-col gap-12 min-w-[340px]"
          role="region"
          aria-label="Lista de espaços do usuário"
        >
          <div>
            <div 
              className="font-bold text-2xl mb-5"
              aria-label="Meus locais cadastrados"
            >
              Meus Locais
            </div>
            <div 
              className="flex flex-wrap gap-10"
              role="list"
              aria-label="Lista de espaços cadastrados"
            >
              {espacos.map((espaco) => (
                <SpaceCard
                  key={espaco._id}
                  space={espaco}
                  containerClassName="w-[280px] min-w-[280px] text-left bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col cursor-pointer"
                  aria-label={`Espaço: ${espaco.space_name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showCommentsModal && (
        <CommentsModal 
          isOpen={showCommentsModal} 
          onClose={() => setShowCommentsModal(false)} 
          reviews={[]}
          aria-label="Modal de avaliações"
        />
      )}
    </div>
  );
} 