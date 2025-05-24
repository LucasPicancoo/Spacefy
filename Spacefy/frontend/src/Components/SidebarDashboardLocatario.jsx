import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { spaceService } from "../services/spaceService";
import { useUser } from "../Contexts/userContext";

export default function SidebarDashboardLocatario({ onPageChange, paginaAtual, subEspacoSelecionado }) {
  const [espacos, setEspacos] = useState([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const truncarNome = (nome) => {
    if (nome.length > 20) {
      return nome.substring(0, 20) + "...";
    }
    return nome;
  };

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

  return (
    <nav className="w-60 bg-white border-r border-gray-200 flex flex-col py-6 px-4" aria-label="Menu lateral do dashboard">
      <div className="mb-3">
        <button 
          onClick={() => onPageChange('Home')} 
          className={`w-full flex items-center px-3 py-3 rounded text-lg text-left font-semibold transition-colors cursor-pointer ${
            paginaAtual === 'Home' 
              ? 'bg-[#1486B8] text-white' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          Home
        </button>
      </div>
      <div>
        <button
          className="w-full flex items-center justify-between px-3 py-3 rounded hover:bg-gray-100 text-lg text-left font-semibold cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>Espaços</span>
          {open ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
        </button>
        {open && (
          <ul
            className="ml-6 mt-1 flex flex-col gap-1 transition-all duration-300 ease-in-out overflow-hidden animate-fadein"
            style={{
              maxHeight: open ? espacos.length * 40 + 'px' : '0px',
              opacity: open ? 1 : 0,
            }}
          >
            {loading ? (
              <li className="py-1 pl-2 text-gray-500">Carregando...</li>
            ) : error ? (
              <li className="py-1 pl-2 text-red-500">{error}</li>
            ) : espacos.length === 0 ? (
              <li className="py-1 pl-2 text-gray-500">Nenhum espaço encontrado</li>
            ) : (
              espacos.map((espaco, idx) => (
                <li
                  key={espaco._id}
                  className={`py-1 pl-2 text-gray-700 hover:text-[#236B8E] hover:bg-gray-100 cursor-pointer transition-colors rounded ${
                    paginaAtual === 'Espaco' && subEspacoSelecionado === idx ? 'bg-[#1486B8] text-white' : ''
                  }`}
                  onClick={() => onPageChange('Espaco', idx)}
                  title={espaco.space_name}
                >
                  {truncarNome(espaco.space_name)}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <div className="mt-1 flex flex-col gap-1">
        <button 
          onClick={() => onPageChange('Reservas')} 
          className={`text-left px-3 py-3 rounded text-lg cursor-pointer font-semibold ${
            paginaAtual === 'Reservas' 
              ? 'bg-[#1486B8] text-white' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          Reservas
        </button>
        <button 
          onClick={() => onPageChange('Mensagens')}
          className={`text-left px-3 py-3 rounded text-lg cursor-pointer font-semibold ${
            paginaAtual === 'Mensagens' 
              ? 'bg-[#1486B8] text-white' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          Mensagens
        </button>
        <button 
          onClick={() => onPageChange('Perfil')}
          className={`text-left px-3 py-3 rounded text-lg cursor-pointer font-semibold ${
            paginaAtual === 'Perfil' 
              ? 'bg-[#1486B8] text-white' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          Perfil
        </button>
      </div>
    </nav>
  );
} 