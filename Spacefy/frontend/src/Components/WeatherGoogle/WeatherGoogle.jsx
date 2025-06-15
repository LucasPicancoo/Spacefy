import React, { useEffect, useState } from 'react';

const WeatherGoogle = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const latitude = location?.coordinates?.lat;
  const longitude = location?.coordinates?.lng;

  const fetchWeather = async (dayIndex) => {
    if (!latitude || !longitude) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://weather.googleapis.com/v1/forecast/days:lookup?key=${apiKey}&location.latitude=${latitude}&location.longitude=${longitude}&days=${dayIndex + 1}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      const data = await response.json();
      console.log('Dados da API do clima:', data);
      setWeather(data);
    } catch (err) {
      console.error('Erro ao buscar o clima:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedDay);
  }, [latitude, longitude, selectedDay]);

  const handleDayChange = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

  const getDayName = (index) => {
    const days = ['Hoje', 'Amanhã', 'Depois de Amanhã'];
    return days[index];
  };

  const formatDate = (displayDate) => {
    const { year, month, day } = displayDate;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div 
      className="p-4 bg-white"
      role="region"
      aria-label="Previsão do tempo"
    >
      <h2 
        className="text-xl font-bold text-[#363636] mb-4"
        id="weather-title"
      >
        Previsão do Tempo
      </h2>
      
      {/* Botões de navegação */}
      <div 
        className="flex justify-center gap-2 mb-4"
        role="tablist"
        aria-label="Seleção de dias"
      >
        {[0, 1, 2].map((day) => (
          <button
            key={day}
            onClick={() => handleDayChange(day)}
            className={`min-w-[70px] py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
              selectedDay === day
                ? 'bg-[#00A3FF] text-white shadow-md hover:bg-[#0088cc]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            role="tab"
            aria-selected={selectedDay === day}
            aria-controls={`weather-content-${day}`}
            aria-label={`Ver previsão do tempo para ${getDayName(day)}`}
          >
            {getDayName(day)}
          </button>
        ))}
      </div>

      {loading && (
        <p 
          className="text-[#696868]"
          role="status"
          aria-label="Carregando previsão do tempo"
        >
          Carregando...
        </p>
      )}
      
      {weather && weather.forecastDays && weather.forecastDays[selectedDay] && (
        <div 
          className="mt-2 text-[#696868] space-y-4"
          role="tabpanel"
          id={`weather-content-${selectedDay}`}
          aria-labelledby="weather-title"
        >
          {/* Data */}
          <div 
            className="text-center"
            role="heading"
            aria-level="3"
          >
            <p className="text-lg font-semibold">
              {formatDate(weather.forecastDays[selectedDay].displayDate)}
            </p>
          </div>

          {/* Informações do Clima */}
          <div 
            className="grid grid-cols-2 gap-4"
            role="list"
            aria-label="Informações meteorológicas"
          >
            <div role="listitem">
              <p className="text-sm text-gray-500">Temperatura Máxima</p>
              <p 
                className="text-lg font-semibold"
                aria-label={`Temperatura máxima: ${weather.forecastDays[selectedDay].maxTemperature?.degrees} graus Celsius`}
              >
                {weather.forecastDays[selectedDay].maxTemperature?.degrees}°C
              </p>
            </div>
            <div role="listitem">
              <p className="text-sm text-gray-500">Temperatura Mínima</p>
              <p 
                className="text-lg font-semibold"
                aria-label={`Temperatura mínima: ${weather.forecastDays[selectedDay].minTemperature?.degrees} graus Celsius`}
              >
                {weather.forecastDays[selectedDay].minTemperature?.degrees}°C
              </p>
            </div>
            <div role="listitem">
              <p className="text-sm text-gray-500">Umidade</p>
              <p 
                className="text-lg font-semibold"
                aria-label={`Umidade relativa: ${weather.forecastDays[selectedDay].daytimeForecast?.relativeHumidity} por cento`}
              >
                {weather.forecastDays[selectedDay].daytimeForecast?.relativeHumidity}%
              </p>
            </div>
            <div role="listitem">
              <p className="text-sm text-gray-500">Prob. Chuva</p>
              <p 
                className="text-lg font-semibold"
                aria-label={`Probabilidade de chuva: ${weather.forecastDays[selectedDay].daytimeForecast?.precipitation?.probability?.percent} por cento`}
              >
                {weather.forecastDays[selectedDay].daytimeForecast?.precipitation?.probability?.percent}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherGoogle; 