import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';
import { isAfter, startOfDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { LocationSearch } from './LocationSearch';

export default function SearchBarLaddingPage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const navigate = useNavigate();
  const today = startOfDay(new Date());

  const handlePeopleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setNumberOfPeople(value);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex items-center gap-2 bg-[#1486B8] rounded-xl p-4" style={{ boxShadow: '0 7px 10px rgba(0, 0, 0, 0.30)' }}>
      {/* Campo de Localização com autocomplete */}
      <LocationSearch />

      {/* Campo de Datas */}
      <div className="flex-1 flex items-center bg-white rounded-xl justify-between px-4 py-3">
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            const [start, end] = update;
            setStartDate(start);
            setEndDate(end);
          }}
          locale={ptBR}
          placeholderText="Selecione as datas"
          className="w-full outline-none text-gray-700 text-sm cursor-pointer"
          dateFormat="dd/MM/yyyy"
          minDate={today}
          filterDate={(date) => isAfter(date, today) || date.getTime() === today.getTime()}
        />
        <FaChevronDown className="text-gray-400 text-sm" />
      </div>

      {/* Campo de Pessoas */}
      <div className="flex-1 flex items-center bg-white rounded-xl justify-between px-4 py-3">
        <input
          type="text"
          value={numberOfPeople}
          onChange={handlePeopleChange}
          placeholder="Número de pessoas"
          className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>

      {/* Botão de Pesquisa */}
      <button
        type="button"
        onClick={() => navigate('/Descobrir')}
        className="bg-[#1EACE3] hover:bg-[#32C6FF] hover:scale-[1.05] text-white font-medium px-8 py-2.5 rounded-lg transition-all duration-300 cursor-pointer"
        style={{ boxShadow: '0 7px 10px rgba(0, 0, 0, 0.30)' }}
      >
        Pesquisar
      </button>
    </div>
  );
}
