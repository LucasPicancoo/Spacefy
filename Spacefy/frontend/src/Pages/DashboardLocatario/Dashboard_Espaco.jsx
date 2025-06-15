import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaChevronDown } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdCalendarToday, MdEdit, MdDelete } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CommentsModal from "../../Components/CommentsModal";
import { spaceService } from "../../services/spaceService";
import { rentalService } from "../../services/rentalService";
import { useUser } from "../../Contexts/UserContext";

function renderStars(avaliacao) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (avaliacao >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400" aria-hidden="true" />);
    } else if (avaliacao >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" aria-hidden="true" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" aria-hidden="true" />);
    }
  }
  return (
    <div role="img" aria-label={`Avaliação: ${avaliacao} de 5 estrelas`}>
      {stars}
    </div>
  );
}

export default function Dashboard_Espaco({ subEspacoSelecionado = 0, onEditarEspaco }) {
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [rentalData, setRentalData] = useState([]);
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

  useEffect(() => {
    const buscarDadosAluguel = async () => {
      if (espacos.length > 0) {
        const espacoSelecionado = espacos[subEspacoSelecionado] || espacos[0];
        try {
          if (!espacoSelecionado._id) {
            setRentalData([]);
            return;
          }

          const response = await rentalService.getRentedDatesBySpace(espacoSelecionado._id);
          
          if (response && response.dates && Array.isArray(response.dates)) {
            const dadosProcessados = response.dates.map(item => ({
              data: new Date(item.date).toLocaleDateString('pt-BR'),
              quantidade: item.times.length
            }));

            dadosProcessados.sort((a, b) => new Date(a.data) - new Date(b.data));
            setRentalData(dadosProcessados);
          } else {
            setRentalData([]);
          }
        } catch (err) {
          setRentalData([]);
        }
      }
    };

    buscarDadosAluguel();
  }, [espacos, subEspacoSelecionado]);

  const handleDeleteSpace = async () => {
    try {
      const espacoSelecionado = espacos[subEspacoSelecionado] || espacos[0];
      await spaceService.deleteSpace(espacoSelecionado._id);
      
      const espacosAtualizados = await spaceService.getSpacesByOwnerId(user.id);
      setEspacos(espacosAtualizados);
      
      setShowDeleteModal(false);
      setDeleteError(null);
    } catch (error) {
      setDeleteError('Erro ao excluir espaço. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
      <div 
        className="w-full h-full p-6 flex items-center justify-center"
        role="status"
        aria-label="Carregando informações do espaço"
      >
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1486B8]"
          aria-hidden="true"
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="w-full h-full p-6 flex items-center justify-center"
        role="alert"
        aria-label="Erro ao carregar informações"
      >
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!espacos.length) {
    return (
      <div 
        className="w-full h-full p-6 flex items-center justify-center"
        role="status"
        aria-label="Nenhum espaço encontrado"
      >
        <div className="text-gray-500">Nenhum espaço encontrado</div>
      </div>
    );
  }

  const espacoSelecionado = espacos[subEspacoSelecionado] || espacos[0];

  return (
    <div 
      className="w-full h-full p-6 flex gap-6"
      role="main"
      aria-label={`Detalhes do espaço ${espacoSelecionado.space_name}`}
    >
      {/* Conteúdo principal */}
      <div 
        className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6"
        role="region"
        aria-label="Informações do espaço"
      >
        <div className="flex items-center justify-between">
          <h2 
            className="text-3xl font-bold mb-2"
            aria-label={`Nome do espaço: ${espacoSelecionado.space_name}`}
          >
            {espacoSelecionado.space_name}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => onEditarEspaco(espacoSelecionado)}
              className="flex items-center gap-1 bg-[#1486B8] hover:bg-[#0f6a94] text-white font-semibold py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out shadow cursor-pointer"
              aria-label={`Editar espaço ${espacoSelecionado.space_name}`}
            >
              <MdEdit aria-hidden="true" /> Editar
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out shadow cursor-pointer"
              aria-label={`Excluir espaço ${espacoSelecionado.space_name}`}
            >
              <MdDelete aria-hidden="true" /> Excluir
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-6">
          {/* Gráfico */}
          <div 
            className="bg-white rounded-lg p-4 flex flex-col items-center justify-center min-h-[550px]"
            role="region"
            aria-label="Gráfico de histórico de aluguéis"
          >
            {rentalData.length > 0 ? (
              <div role="img" aria-label="Gráfico de linha mostrando o histórico de aluguéis ao longo do tempo">
                <ResponsiveContainer width="100%" height={550}>
                  <LineChart data={rentalData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="data" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Quantidade de Aluguéis', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }}
                      allowDecimals={false}
                      domain={[0, 'auto']}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} aluguéis`, 'Quantidade']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Line 
                      type="linear" 
                      dataKey="quantidade" 
                      stroke="#1486B8" 
                      strokeWidth={2}
                      dot={{ fill: '#1486B8', r: 4 }}
                      activeDot={{ r: 8 }}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div 
                className="h-full w-full flex items-center justify-center text-gray-500"
                role="status"
                aria-label="Nenhum dado de aluguel disponível"
              >
                Nenhum dado de aluguel disponível
              </div>
            )}
          </div>
          {/* Card lateral */}
          <div 
            className="bg-gradient-to-br from-[#eaf6fd] to-[#b2d6f7] rounded-xl shadow p-4 flex flex-col gap-3"
            role="complementary"
            aria-label="Detalhes do espaço"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-bold">
                <BsCurrencyDollar aria-hidden="true" /> 
                <span>Preço</span>
              </div>
            </div>
            <div 
              className="text-base font-semibold"
              aria-label={`Preço por hora: R$ ${espacoSelecionado.price_per_hour}`}
            >
              R$ {espacoSelecionado.price_per_hour}/hora
            </div>
            <div className="flex items-center gap-2 text-base font-bold mt-2">
              <MdCalendarToday aria-hidden="true" /> 
              <span>Dias de funcionamento</span>
            </div>
            <div 
              className="text-sm"
              aria-label={`Dias de funcionamento: ${espacoSelecionado.week_days.join(", ")}`}
            >
              {espacoSelecionado.week_days.join(", ")}
            </div>
            <div className="flex items-center gap-2 text-base font-bold mt-2">
              <FaWifi aria-hidden="true" /> 
              <span>Comodidades</span>
            </div>
            <div className="text-sm">
              <span aria-label={`Comodidades: ${espacoSelecionado.space_amenities.join(", ")}`}>
                {espacoSelecionado.space_amenities.slice(0, showAllAmenities ? undefined : 8).join(", ")}
              </span>
              {espacoSelecionado.space_amenities.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="ml-2 text-[#1486B8] hover:text-[#0f6a94] font-medium flex items-center gap-1 cursor-pointer"
                  aria-expanded={showAllAmenities}
                  aria-label={showAllAmenities ? "Mostrar menos comodidades" : "Mostrar mais comodidades"}
                >
                  {showAllAmenities ? "Ver menos" : "Ver mais"}
                  <FaChevronDown 
                    className={`transition-transform duration-300 ${showAllAmenities ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
            <div className="text-base font-bold mt-2">Dias já alugados</div>
            {/* Placeholder do calendário */}
            <div 
              className="bg-white rounded-lg p-2 shadow mt-1"
              role="region"
              aria-label="Calendário de dias alugados"
            >
              <div className="text-xs font-semibold mb-1">June 2021</div>
              <div 
                className="grid grid-cols-7 gap-1 text-center text-[10px]"
                role="grid"
                aria-label="Calendário"
              >
                <div role="columnheader">Su</div>
                <div role="columnheader">Mo</div>
                <div role="columnheader">Tu</div>
                <div role="columnheader">We</div>
                <div role="columnheader">Th</div>
                <div role="columnheader">Fr</div>
                <div role="columnheader">Sa</div>
                {Array.from({length: 30}, (_,i) => i+1).map(day => (
                  <div 
                    key={day} 
                    role="gridcell"
                    className={`py-1 rounded-full ${espacoSelecionado.alugados?.includes(`2021-06-${day.toString().padStart(2,'0')}`) ? 'bg-blue-300 text-white font-bold' : ''}`}
                    aria-label={`Dia ${day} ${espacoSelecionado.alugados?.includes(`2021-06-${day.toString().padStart(2,'0')}`) ? 'alugado' : 'disponível'}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Avaliações */}
        <div 
          className="bg-white rounded-lg border-0 p-4 mt-4"
          role="region"
          aria-label="Seção de avaliações"
        >
          <div className="flex items-center gap-2 text-lg font-bold mb-1">Avaliações</div>
          <div className="flex items-center gap-2 mb-1">
            {renderStars(espacoSelecionado.rating || 0)}
            <span 
              className="text-xl font-bold ml-2"
              aria-label={`Média de avaliações: ${espacoSelecionado.rating || 0}`}
            >
              {espacoSelecionado.rating || 0}
            </span>
          </div>
          <button 
            className="mt-3 bg-[#1486B8] hover:bg-[#0f6a94] text-white font-semibold py-2 px-4 rounded-lg text-lg transition duration-300 ease-in-out shadow cursor-pointer" 
            onClick={() => setShowCommentsModal(true)}
            aria-label="Ver todas as avaliações"
          >
            Ver Avaliações
          </button>
        </div>
      </div>

      {showCommentsModal && (
        <CommentsModal 
          isOpen={showCommentsModal} 
          onClose={() => setShowCommentsModal(false)} 
          reviews={espacoSelecionado.reviews || []}
          aria-label="Modal de avaliações"
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Modal de confirmação de exclusão"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200">
            <h3 
              className="text-xl font-bold mb-4"
              aria-label="Confirmar exclusão do espaço"
            >
              Confirmar Exclusão
            </h3>
            <p 
              className="text-gray-600 mb-6"
              aria-label={`Tem certeza que deseja excluir o espaço ${espacoSelecionado.space_name}? Esta ação não pode ser desfeita.`}
            >
              Tem certeza que deseja excluir o espaço "{espacoSelecionado.space_name}"? Esta ação não pode ser desfeita.
            </p>
            {deleteError && (
              <p 
                className="text-red-500 mb-4"
                role="alert"
                aria-label="Erro ao excluir espaço"
              >
                {deleteError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                aria-label="Cancelar exclusão"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSpace}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                aria-label="Confirmar exclusão do espaço"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 