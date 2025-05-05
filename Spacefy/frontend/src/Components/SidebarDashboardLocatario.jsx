import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

export default function SidebarDashboardLocatario({ espacos: espacosProp }) {
  // Estado local para os nomes dos espaços
  const [espacos, setEspacos] = useState(espacosProp || []);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Substituir este bloco pelo fetch/axios
    //
    // fetch("/api/espacos")
    //   .then(res => res.json())
    //   .then(data => setEspacos(data));
    //
    // Exemplo:
    if (!espacosProp) {
      setEspacos(["Espaço 1", "Espaço 2", "Espaço 3", "Espaço 4", "Espaço 5", "Espaço 6", "Espaço 7", "Espaço 8", "Espaço 9", "Espaço 10", "ababa"]);
    }
  }, [espacosProp]);

  return (
    <nav className="w-60 bg-white border-r border-gray-200 flex flex-col py-6 px-4" aria-label="Menu lateral do dashboard">
      <div className="mb-3">
        <button className="w-full flex items-center px-3 py-3 rounded bg-[#1486B8] hover:bg-[#0f6a94] text-white font-semibold text-lg text-left transition-colors cursor-pointer">
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
            {espacos.map((nome, idx) => (
              <li
                key={idx}
                className="py-1 pl-2 text-gray-700 hover:text-[#236B8E] hover:bg-gray-100 cursor-pointer transition-colors rounded"
              >
                {nome}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-1 flex flex-col gap-1">
        <button className="text-left px-3 py-3 rounded hover:bg-gray-100 text-lg cursor-pointer font-semibold">Avaliações</button>
        <button className="text-left px-3 py-3 rounded hover:bg-gray-100 text-lg cursor-pointer font-semibold">Reservas</button>
        <button className="text-left px-3 py-3 rounded hover:bg-gray-100 text-lg cursor-pointer font-semibold">Mensagens</button>
        <button className="text-left px-3 py-3 rounded hover:bg-gray-100 text-lg cursor-pointer font-semibold">Perfil</button>
      </div>
    </nav>
  );
} 