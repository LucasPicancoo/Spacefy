import { FaStar, FaRegCommentDots } from "react-icons/fa";
import { useState, useEffect } from "react";
import { spaceService } from "../../services/spaceService";
import { assessmentService } from "../../services/assessmentService";
import { rentalService } from "../../services/rentalService";
import { useUser } from "../../Contexts/UserContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard_Home() {
  const [totalEspacos, setTotalEspacos] = useState(0);
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState(0);
  const [totalReservas, setTotalReservas] = useState(0);
  const [rentalData, setRentalData] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Buscar espaços do locatário
        const espacosData = await spaceService.getSpacesByOwnerId(user.id);
        setTotalEspacos(espacosData.length);

        // Calcular média das avaliações
        if (espacosData.length > 0) {
          let somaTotalAvaliacoes = 0;
          let totalReviews = 0;

          // Buscar avaliações de cada espaço
          for (const espaco of espacosData) {
            const avaliacao = await assessmentService.getAverageScoreBySpace(espaco._id);
            if (avaliacao && avaliacao.totalReviews > 0) {
              somaTotalAvaliacoes += (avaliacao.averageScore * avaliacao.totalReviews);
              totalReviews += avaliacao.totalReviews;
            }
          }

          // Calcular média geral
          const mediaGeral = totalReviews > 0 ? somaTotalAvaliacoes / totalReviews : 0;
          setMediaAvaliacoes(Number(mediaGeral.toFixed(1)));

          // Buscar total de reservas e dados para o gráfico
          const reservas = await rentalService.getRentalsByOwner(user.id);
          console.log('Reservas recebidas:', reservas);
          setTotalReservas(reservas.length);

          // Processar dados para o gráfico
          const dadosPorData = {};
          reservas.forEach(reserva => {
            console.log('Processando reserva:', reserva);
            // Verifica se a data é válida antes de processar
            const dataReserva = new Date(reserva.start_date);
            console.log('Data da reserva:', dataReserva);
            if (!isNaN(dataReserva.getTime())) {
              const data = dataReserva.toLocaleDateString('pt-BR');
              console.log('Data formatada:', data);
              if (!dadosPorData[data]) {
                dadosPorData[data] = 0;
              }
              dadosPorData[data]++;
            }
          });

          console.log('Dados agrupados por data:', dadosPorData);

          const dadosProcessados = Object.entries(dadosPorData)
            .map(([data, quantidade]) => ({
              data,
              quantidade
            }))
            .filter(item => item.data !== 'Invalid Date');

          console.log('Dados processados:', dadosProcessados);

          // Ordenar por data
          dadosProcessados.sort((a, b) => {
            const dataA = new Date(a.data.split('/').reverse().join('-'));
            const dataB = new Date(b.data.split('/').reverse().join('-'));
            return dataA - dataB;
          });

          console.log('Dados finais ordenados:', dadosProcessados);
          setRentalData(dadosProcessados);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (user?.id) {
      buscarDados();
    }
  }, [user?.id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" aria-hidden="true" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" aria-hidden="true" />);
      } else {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" aria-hidden="true" />);
      }
    }
    return (
      <div role="img" aria-label={`Avaliação: ${rating} de 5 estrelas`} className="flex">
        {stars}
      </div>
    );
  };

  return (
    <div role="main" aria-label="Dashboard do locatário">
      {/* Cards superiores */}
      <div className="p-8">
        <div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-1"
          role="list"
          aria-label="Resumo de estatísticas"
        >
          {/* Card 1: Total de Espaços */}
          <div 
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
            role="listitem"
            aria-label={`Total de espaços: ${totalEspacos}`}
          >
            <span className="text-xl font-semibold">Espaços</span>
            <span className="text-4xl font-bold mt-2">{totalEspacos}</span>
          </div>

          {/* Card 2: Avaliação Média */}
          <div 
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
            role="listitem"
            aria-label={`Média de avaliações: ${mediaAvaliacoes} de 5 estrelas`}
          >
            <span className="text-xl font-semibold">Avaliações</span>
            <div className="flex items-center mt-2">
              {renderStars(mediaAvaliacoes)}
              <span className="ml-2 text-3xl font-bold">{mediaAvaliacoes}</span>
            </div>
          </div>

          {/* Card 3: Total de Mensagens */}
          <div 
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
            role="listitem"
            aria-label="Total de mensagens: 12"
          >
            <span className="text-xl font-semibold">Mensagens</span>
            <div className="flex items-center mt-2">
              <FaRegCommentDots className="text-gray-500 text-2xl" aria-hidden="true" />
              <span className="ml-2 text-3xl font-bold">12</span>
            </div>
          </div>

          {/* Card 4: Total de Reservas */}
          <div 
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
            role="listitem"
            aria-label={`Total de reservas: ${totalReservas}`}
          >
            <span className="text-xl font-semibold">Reservas</span>
            <span className="text-4xl font-bold mt-2">{totalReservas}</span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="px-8 pb-8">
        <div 
          className="bg-white rounded-lg shadow p-8"
          role="region"
          aria-label="Gráfico de histórico de reservas"
        >
          <h2 
            className="text-3xl font-bold mb-6"
            aria-label="Histórico total de reservas"
          >
            Histórico total de reservas
          </h2>
          {rentalData.length > 0 ? (
            <div role="img" aria-label="Gráfico de linha mostrando o histórico de reservas ao longo do tempo">
              <ResponsiveContainer width="100%" height={500}>
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
              className="h-64 flex items-center justify-center bg-blue-50 rounded"
              role="status"
              aria-label="Nenhum dado de aluguel disponível"
            >
              <span className="text-gray-400">Nenhum dado de aluguel disponível</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
