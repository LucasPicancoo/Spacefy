import React, { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdCalendarToday } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import CommentsModal from "../../Components/CommentsModal";

const subespacos = [
  {
    id: 1,
    nome: "Palacio de Cristal",
    preco: "R$ 500/dia",
    diasFuncionamento: "Segunda a domingo",
    comodidades: ["Wi-Fi", "Ar Condicionado", "Estacionamento"],
    avaliacao: 4.5,
    totalAvaliacoes: 120,
    alugados: ["2021-06-22"],
    reviews: [
      { name: "João Silva", review: "Espaço excelente, muito limpo!" },
      { name: "Ana Paula", review: "Ótima localização e atendimento." },
    ],
  },
  {
    id: 2,
    nome: "Espaço 2",
    preco: "R$ 300/dia",
    diasFuncionamento: "Segunda a sexta",
    comodidades: ["Wi-Fi", "Estacionamento"],
    avaliacao: 4.2,
    totalAvaliacoes: 80,
    alugados: ["2021-06-15"],
    reviews: [
      { name: "Carlos Lima", review: "Bom custo-benefício." },
    ],
  },
  {
    id: 3,
    nome: "Espaço 3",
    preco: "R$ 700/dia",
    diasFuncionamento: "Somente finais de semana",
    comodidades: ["Wi-Fi", "Ar Condicionado"],
    avaliacao: 4.8,
    totalAvaliacoes: 200,
    alugados: ["2021-06-10"],
    reviews: [
      { name: "Marina Souza", review: "Perfeito para eventos!" },
      { name: "Pedro Henrique", review: "Voltarei mais vezes." },
    ],
  },
];

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
  const espacoSelecionado = subespacos[subEspacoSelecionado] || subespacos[0];

  return (
    <div className="w-full h-full p-6 flex gap-6">
      {/* Conteúdo principal */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-3xl font-bold mb-2">{espacoSelecionado.nome}</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Gráfico */}
          <div className="flex-1 bg-white rounded-lg p-4 flex flex-col items-center justify-center min-h-[220px] w-full">
            {/* Placeholder do gráfico igual ao da Home */}
            <div className="h-64 flex items-center justify-center bg-blue-50 rounded flex-1 w-full">
              <span className="text-gray-400">[Gráfico de linhas aqui]</span>
            </div>
          </div>
          {/* Card lateral */}
          <div className="w-full lg:w-64 bg-gradient-to-br from-[#eaf6fd] to-[#b2d6f7] rounded-xl shadow p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-lg font-bold"><BsCurrencyDollar /> Preço</div>
            <div className="text-base font-semibold">{espacoSelecionado.preco}</div>
            <div className="flex items-center gap-2 text-base font-bold mt-2"><MdCalendarToday /> Dias de funcionamento</div>
            <div className="text-sm">{espacoSelecionado.diasFuncionamento}</div>
            <div className="flex items-center gap-2 text-base font-bold mt-2"><FaWifi /> Comodidades</div>
            <div className="text-sm">{espacoSelecionado.comodidades.join(", ")}</div>
            <div className="text-base font-bold mt-2">Dias já alugados</div>
            {/* Placeholder do calendário */}
            <div className="bg-white rounded-lg p-2 shadow mt-1">
              <div className="text-xs font-semibold mb-1">June 2021</div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                {/* Exemplo de dias */}
                {Array.from({length: 30}, (_,i) => i+1).map(day => (
                  <div key={day} className={`py-1 rounded-full ${espacoSelecionado.alugados.includes(`2021-06-${day.toString().padStart(2,'0')}`) ? 'bg-blue-300 text-white font-bold' : ''}`}>{day}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Avaliações */}
        <div className="bg-white rounded-lg border-0 p-4 mt-4">
          <div className="flex items-center gap-2 text-lg font-bold mb-1">Avaliações</div>
          <div className="flex items-center gap-2 mb-1">
            {renderStars(espacoSelecionado.avaliacao)}
            <span className="text-xl font-bold ml-2">{espacoSelecionado.avaliacao}</span>
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