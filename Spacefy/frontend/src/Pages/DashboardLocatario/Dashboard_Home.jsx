import { FaStar, FaRegCommentDots } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import SidebarDashboardLocatario from "../../Components/SidebarDashboardLocatario";

export default function Dashboard_Home() {

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1BAAE9] to-[#093C6B]">
      {/* Menu lateral */}
      <SidebarDashboardLocatario  />

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col p-0">
        {/* Cards superiores */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-xl font-semibold">Espaços</span>
              <span className="text-4xl font-bold mt-2">3</span>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-xl font-semibold">Avaliações</span>
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400 opacity-50" />
                <span className="ml-2 text-3xl font-bold">4,5</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-xl font-semibold">Mensagens</span>
              <div className="flex items-center mt-2">
                <FaRegCommentDots className="text-gray-500 text-2xl" />
                <span className="ml-2 text-3xl font-bold">12</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-xl font-semibold">Reservas</span>
              <span className="text-4xl font-bold mt-2">3</span>
            </div>
          </div>
        </div>

        {/* Gráfico e Perfil */}
        <div className="flex flex-col lg:flex-row gap-8 flex-1 px-8 pb-8">
          {/* Gráfico */}
          <div className="flex-1 bg-white rounded-lg shadow p-8 flex flex-col">
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
      </main>
    </div>
  );
}
