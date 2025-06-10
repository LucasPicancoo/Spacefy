import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaChevronDown } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdCalendarToday, MdEdit } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import CommentsModal from "../../Components/CommentsModal";
import { spaceService } from "../../services/spaceService";
import { useUser } from "../../Contexts/UserContext";

function renderStars(avaliacao) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (avaliacao >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (avaliacao >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }
  return stars;
}

export default function Dashboard_Espaco({ subEspacoSelecionado = 0, onEditarEspaco }) {
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const buscarEspacos = async () => {
      try {
        setLoading(true);
        const espacosData = await spaceService.getSpacesByOwnerId(user.id);
        setEspacos(espacosData);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar os espaços. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      buscarEspacos();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="w-full h-full p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1486B8]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full p-6 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!espacos.length) {
    return (
      <div className="w-full h-full p-6 flex items-center justify-center">
        <div className="text-gray-500">Nenhum espaço encontrado</div>
      </div>
    );
  }

  const espacoSelecionado = espacos[subEspacoSelecionado] || espacos[0];

  return (
    <div className="w-full h-full p-6 flex gap-6">
      {/* Conteúdo principal */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold mb-2">{espacoSelecionado.space_name}</h2>
          <button
            onClick={() => onEditarEspaco(espacoSelecionado)}
            className="flex items-center gap-1 bg-[#1486B8] hover:bg-[#0f6a94] text-white font-semibold py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out shadow cursor-pointer"
          >
            <MdEdit /> Editar
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-6">
          {/* Gráfico */}
          <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center min-h-[550px]">
            {/* Placeholder do gráfico igual ao da Home */}
            <div className="h-[550px] flex items-center justify-center bg-blue-50 rounded w-full">
              <span className="text-gray-400">[Gráfico de linhas aqui]</span>
            </div>
          </div>
          {/* Card lateral */}
          <div className="bg-gradient-to-br from-[#eaf6fd] to-[#b2d6f7] rounded-xl shadow p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-bold"><BsCurrencyDollar /> Preço</div>
            </div>
            <div className="text-base font-semibold">R$ {espacoSelecionado.price_per_hour}/hora</div>
            <div className="flex items-center gap-2 text-base font-bold mt-2"><MdCalendarToday /> Dias de funcionamento</div>
            <div className="text-sm">{espacoSelecionado.week_days.join(", ")}</div>
            <div className="flex items-center gap-2 text-base font-bold mt-2"><FaWifi /> Comodidades</div>
            <div className="text-sm">
              {espacoSelecionado.space_amenities.slice(0, showAllAmenities ? undefined : 8).join(", ")}
              {espacoSelecionado.space_amenities.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="ml-2 text-[#1486B8] hover:text-[#0f6a94] font-medium flex items-center gap-1 cursor-pointer"
                >
                  {showAllAmenities ? "Ver menos" : "Ver mais"}
                  <FaChevronDown className={`transition-transform duration-300 ${showAllAmenities ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            <div className="text-base font-bold mt-2">Dias já alugados</div>
            {/* Placeholder do calendário */}
            <div className="bg-white rounded-lg p-2 shadow mt-1">
              <div className="text-xs font-semibold mb-1">June 2021</div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                {/* Exemplo de dias */}
                {Array.from({length: 30}, (_,i) => i+1).map(day => (
                  <div key={day} className={`py-1 rounded-full ${espacoSelecionado.alugados?.includes(`2021-06-${day.toString().padStart(2,'0')}`) ? 'bg-blue-300 text-white font-bold' : ''}`}>{day}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Avaliações */}
        <div className="bg-white rounded-lg border-0 p-4 mt-4">
          <div className="flex items-center gap-2 text-lg font-bold mb-1">Avaliações</div>
          <div className="flex items-center gap-2 mb-1">
            {renderStars(espacoSelecionado.rating || 0)}
            <span className="text-xl font-bold ml-2">{espacoSelecionado.rating || 0}</span>
          </div>
          <button className="mt-3 bg-[#1486B8] hover:bg-[#0f6a94] text-white font-semibold py-2 px-4 rounded-lg text-lg transition duration-300 ease-in-out shadow cursor-pointer" onClick={() => setShowCommentsModal(true)}>Ver Avaliações</button>
        </div>
      </div>
      {showCommentsModal && (
        <CommentsModal isOpen={showCommentsModal} onClose={() => setShowCommentsModal(false)} reviews={espacoSelecionado.reviews || []} />
      )}
    </div>
  );
} 