import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdCalendarToday } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

export default function Dashboard_Espaco({ subEspacoSelecionado = 0 }) {
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicoReservas, setHistoricoReservas] = useState([]);
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
    const buscarHistoricoReservas = async () => {
      if (espacos.length > 0) {
        const espacoSelecionado = espacos[subEspacoSelecionado] || espacos[0];
        try {
          console.log('Buscando reservas para o espaço:', espacoSelecionado._id);
          const data = await spaceService.getRentedDatesBySpace(espacoSelecionado._id);
          console.log('Dados brutos recebidos da API:', data);
          
          if (!data.dates || data.dates.length === 0) {
            console.log('Nenhuma data de reserva encontrada');
            setHistoricoReservas([]);
            return;
          }

          // Processar os dados para o formato do gráfico
          const reservasPorDia = {};
          data.dates.forEach(reserva => {
            const dataISO = reserva.date;
            if (!reservasPorDia[dataISO]) {
              reservasPorDia[dataISO] = 0;
            }
            // Incrementa a contagem para cada horário diferente na mesma data
            reservasPorDia[dataISO] += reserva.times.length;
          });

          console.log('Reservas por dia (contagem detalhada):', reservasPorDia);

          const dadosGrafico = Object.entries(reservasPorDia)
            .map(([dataISO, quantidade]) => ({
              dataISO,
              reservas: quantidade
            }))
            .sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO));

          console.log('Dados formatados para o gráfico:', dadosGrafico);
          setHistoricoReservas(dadosGrafico);
        } catch (error) {
          console.error('Erro ao buscar histórico de reservas:', error);
          setHistoricoReservas([]);
        }
      }
    };

    buscarHistoricoReservas();
  }, [espacos, subEspacoSelecionado]);

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
        <h2 className="text-3xl font-bold mb-2">{espacoSelecionado.space_name}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-6">
          {/* Gráfico */}
          <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center min-h-[550px]">
            <div className="h-[550px] w-full">
              {historicoReservas.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicoReservas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="dataISO"
                      tickFormatter={dataISO => {
                        const [year, month, day] = dataISO.split('-');
                        return `${day}/${month}/${year}`;
                      }}
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Número de Reservas', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }}
                      tickFormatter={(value) => Math.round(value)}
                      domain={[0, (dataMax) => Math.max(dataMax + 2, 5)]}
                      allowDecimals={false}
                      tickCount={6}
                    />
                    <Tooltip 
                      formatter={(value) => [Math.round(value), 'Reservas']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Line 
                      type="linear" 
                      dataKey="reservas" 
                      stroke="#1486B8" 
                      strokeWidth={2}
                      dot={{ fill: '#1486B8' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-gray-500 text-lg">Nenhum dado de reserva disponível para exibição</p>
                </div>
              )}
            </div>
          </div>
          {/* Card lateral */}
          <div className="bg-gradient-to-br from-[#eaf6fd] to-[#b2d6f7] rounded-xl shadow p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-lg font-bold"><BsCurrencyDollar /> Preço</div>
            <div className="text-base font-semibold">R$ {espacoSelecionado.price_per_hour}/hora</div>
            <div className="flex items-center gap-2 text-base font-bold mt-2"><MdCalendarToday /> Dias de funcionamento</div>
            <div className="text-sm">{espacoSelecionado.week_days.join(", ")}</div>
            <div className="flex items-center gap-2 text-base font-bold mt-2"><FaWifi /> Comodidades</div>
            <div className="text-sm">{espacoSelecionado.space_amenities.join(", ")}</div>
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