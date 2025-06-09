import { FaStar, FaRegCommentDots } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { spaceService } from "../../services/spaceService";
import { assessmentService } from "../../services/assessmentService";
import { rentalService } from "../../services/rentalService";
import { useUser } from "../../Contexts/UserContext";

export default function Dashboard_Home() {
  const [totalEspacos, setTotalEspacos] = useState(0);
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState(0);
  const [totalReservas, setTotalReservas] = useState(0);
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

          // Buscar total de reservas
          const reservas = await rentalService.getRentalsByOwner(user.id);
          setTotalReservas(reservas.length);
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
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
      } else {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
      }
    }
    return stars;
  };

  return (
    <>
      {/* Cards superiores */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-1">
          {/* Card 1: Total de Espaços */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-xl font-semibold">Espaços</span>
            <span className="text-4xl font-bold mt-2">{totalEspacos}</span>
          </div>

          {/* Card 2: Avaliação Média */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-xl font-semibold">Avaliações</span>
            <div className="flex items-center mt-2">
              {renderStars(mediaAvaliacoes)}
              <span className="ml-2 text-3xl font-bold">{mediaAvaliacoes}</span>
            </div>
          </div>

          {/* Card 3: Total de Mensagens */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-xl font-semibold">Mensagens</span>
            <div className="flex items-center mt-2">
              <FaRegCommentDots className="text-gray-500 text-2xl" />
              <span className="ml-2 text-3xl font-bold">12</span>
            </div>
          </div>

          {/* Card 4: Total de Reservas */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-xl font-semibold">Reservas</span>
            <span className="text-4xl font-bold mt-2">{totalReservas}</span>
          </div>
        </div>
      </div>

      {/* Gráfico e Perfil */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 px-8 pb-8">
        {/* Gráfico */}
        <div className="flex-1 bg-white rounded-lg shadow p-8 flex flex-col mb-8 lg:mb-0">
          <h2 className="text-3xl font-bold mb-6">Historico de reservas</h2>
          {/* Placeholder do gráfico */}
          <div className="h-64 flex items-center justify-center bg-blue-50 rounded flex-1">
            <span className="text-gray-400">[Gráfico de linhas aqui]</span>
          </div>
        </div>
        {/* Perfil */}
        <div className="w-full lg:w-[420px] bg-white rounded-lg shadow p-10 flex flex-col items-center max-h-[calc(100vh-64px)] overflow-auto">
          <div className="mb-6">
            <FaRegUserCircle className="text-gray-400" size={100} />
          </div>
          <div className="text-center w-full">
            <h3 className="text-2xl font-bold mb-1">Zaylian Vortelli</h3>
            <span className="text-base text-gray-500">Locatário</span>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
              <span>Desde 17 de março de 2022</span>
            </div>
            <div className="mt-6 text-left w-full">
              <span className="font-bold text-lg">Descrição:</span>
              <p className="text-base text-gray-600 mt-2 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue, magna sed feugiat lobortis, est tellus laoreet purus, sed auctor quam dolor at ipsum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas risus tellus, vehicula rutrum pellentesque vitae, pretium at libero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
