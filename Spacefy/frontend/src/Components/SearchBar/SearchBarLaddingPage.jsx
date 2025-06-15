import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';
import { isAfter, startOfDay, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { LocationSearch } from './LocationSearch';

// Componente customizado para o input do DatePicker
const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <input
    type="text"
    className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent border-none"
    onClick={onClick}
    ref={ref}
    value={value}
    placeholder={placeholder}
    readOnly
  />
));

export default function SearchBarLaddingPage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();
  const today = startOfDay(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);

  // Fecha o datepicker ao clicar fora
  useEffect(() => {
    if (!isDatePickerOpen) return;
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

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

  // Função para formatar o texto do input de datas
  const getDateInputValue = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
    } else if (startDate) {
      return format(startDate, 'dd/MM/yyyy');
    }
    return '';
  };

  return (
    <div 
      className="w-full max-w-5xl mx-auto flex items-center gap-2 bg-[#1486B8] rounded-xl p-4" 
      style={{ boxShadow: '0 7px 10px rgba(0, 0, 0, 0.30)' }}
      role="search"
      aria-label="Busca de espaços"
    >
      {/* Campo de Localização com autocomplete */}
      <div role="group" aria-labelledby="localizacao-label" className="flex-1">
        <span id="localizacao-label" className="sr-only">Localização do espaço</span>
        <LocationSearch 
          onLocationSelect={handleLocationSelect}
          aria-label="Digite a localização desejada"
        />
      </div>

      {/* Campo de Datas */}
      <div 
        className="flex-1 bg-white rounded-xl px-4 py-3 h-full flex items-center relative"
        role="group"
        aria-labelledby="datas-label"
        ref={datePickerRef}
      >
        <span id="datas-label" className="sr-only">Período de reserva</span>
        <input
          type="text"
          className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent border-none cursor-pointer"
          value={getDateInputValue()}
          onFocus={() => setIsDatePickerOpen(true)}
          onClick={() => setIsDatePickerOpen(true)}
          placeholder="Selecione as datas"
          readOnly
          aria-label="Selecione o período de reserva"
        />
        {isDatePickerOpen && (
          <div className="absolute top-full left-0 z-50 mt-2">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                const [start, end] = update;
                setStartDate(start);
                setEndDate(end);
                if (start && end) setIsDatePickerOpen(false);
              }}
              locale={ptBR}
              inline
              minDate={today}
              filterDate={(date) => isAfter(date, today) || date.getTime() === today.getTime()}
            />
          </div>
        )}
      </div>

      {/* Campo de Pessoas */}
      <div 
        className="flex items-center bg-white rounded-xl justify-between px-4 py-3 flex-1"
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
