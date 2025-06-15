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
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();
  const today = startOfDay(new Date());

  const handlePeopleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setNumberOfPeople(value);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleSearch = () => {
    const filtros = {
      location: selectedLocation,
      pessoasMin: numberOfPeople,
      dataInicio: startDate,
      dataFim: endDate
    };

    navigate('/Descobrir', { state: { filtros } });
  };

  return (
    <div 
      className="w-full max-w-5xl mx-auto flex items-center gap-2 bg-[#1486B8] rounded-xl p-4" 
      style={{ boxShadow: '0 7px 10px rgba(0, 0, 0, 0.30)' }}
      role="search"
      aria-label="Busca de espaços"
    >
      {/* Campo de Localização com autocomplete */}
      <div role="group" aria-labelledby="localizacao-label">
        <span id="localizacao-label" className="sr-only">Localização do espaço</span>
        <LocationSearch 
          onLocationSelect={handleLocationSelect}
          aria-label="Digite a localização desejada"
        />
      </div>

      {/* Campo de Datas */}
      <div 
        className="bg-white rounded-xl"
        role="group"
        aria-labelledby="datas-label"
      >
        <span id="datas-label" className="sr-only">Período de reserva</span>
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
          className="w-full outline-none text-gray-700 text-sm cursor-pointer bg-transparent border-none shadow-none"
          dateFormat="dd/MM/yyyy"
          minDate={today}
          filterDate={(date) => isAfter(date, today) || date.getTime() === today.getTime()}
          aria-label="Selecione o período de reserva"
        />
      </div>

      {/* Campo de Pessoas */}
      <div 
        className="flex-1 flex items-center bg-white rounded-xl justify-between px-4 py-3"
        role="group"
        aria-labelledby="pessoas-label"
      >
        <span id="pessoas-label" className="sr-only">Número de pessoas</span>
        <input
          type="text"
          value={numberOfPeople}
          onChange={handlePeopleChange}
          placeholder="Número de pessoas"
          className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label="Digite o número de pessoas"
          aria-describedby="pessoas-desc"
        />
        <span id="pessoas-desc" className="sr-only">Digite apenas números</span>
      </div>

      {/* Botão de Pesquisa */}
      <button
        type="button"
        onClick={handleSearch}
        className="bg-[#1EACE3] hover:bg-[#32C6FF] hover:scale-[1.05] text-white font-medium px-8 py-2.5 rounded-lg transition-all duration-300 cursor-pointer"
        style={{ boxShadow: '0 7px 10px rgba(0, 0, 0, 0.30)' }}
        aria-label="Buscar espaços com os filtros selecionados"
      >
        Pesquisar
      </button>
    </div>
  );
}
