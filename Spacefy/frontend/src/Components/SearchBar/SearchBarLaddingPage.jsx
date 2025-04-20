import React from 'react';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';

export default function SearchBarLaddingPage() {
  return (
    <div className="w-full max-w-5xl mx-auto flex items-center gap-2 bg-[#1486B8] rounded-xl p-4" style={{ boxShadow: '0 7px 10px rgba(0, 0, 0, 0.30)' }}>


      {/* Campo de Localização */}
      <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3">
        <FaMapMarkerAlt className="text-gray-400 mr-2 text-lg" />
        <input
          type="text"
          placeholder="Localização"
          className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
        />
      </div>


      {/* Campo de Datas */}
      <div className="flex-1 flex items-center bg-white rounded-xl justify-between px-4 py-3 cursor-pointer">
        <div className="flex items-center">
          <span className="text-sm text-gray-600">Datas</span>
        </div>
        <FaChevronDown className="text-gray-400 text-sm" />
      </div>



      {/* Campo de Pessoas */}
      <div className="flex-1 flex items-center bg-white rounded-xl justify-between px-4 py-3 cursor-pointer">
        <div className="flex items-center">
          <span className="text-sm text-gray-600">Pessoas</span>
        </div>
        <FaChevronDown className="text-gray-400 text-sm" />
      </div>

      {/* Botão de Pesquisa */}
      <button
        type="button"
        className="bg-[#1EACE3] hover:bg-[#32C6FF] hover:scale-[1.05] text-white font-medium px-8 py-2.5 rounded-lg transition-all duration-300 cursor-pointer" style={{ boxShadow: '0 7px 10px rgba(0, 0, 0, 0.30)' }}>
        Pesquisar
      </button>
    </div>
  );
};
