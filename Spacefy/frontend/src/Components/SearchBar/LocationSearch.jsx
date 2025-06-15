import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { googleMapsService } from '../../services/googleMapsService';

export function LocationSearch({ onLocationSelect, initialLocation }) {
  const [location, setLocation] = useState(initialLocation || '');
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isApiInitialized, setIsApiInitialized] = useState(false);

  useEffect(() => {
    setLocation(initialLocation || '');
  }, [initialLocation]);

  const initializeAutocomplete = async () => {
    try {
      if (!googleMapsService.isApiLoaded()) {
        await googleMapsService.loadGoogleMaps();
      }
      
      if (inputRef.current && !autocompleteRef.current) {
        autocompleteRef.current = googleMapsService.createAutocomplete(inputRef.current, {
          fields: ['formatted_address', 'place_id'],
          types: ['geocode']
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place && place.formatted_address) {
            setLocation(place.formatted_address);
            onLocationSelect(place.formatted_address);
          }
        });
      }
      setIsApiInitialized(true);
    } catch (error) {
      console.error('Erro ao inicializar o Autocomplete:', error);
    }
  };

  const handleInputFocus = async () => {
    if (!isApiInitialized) {
      await initializeAutocomplete();
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocation(newValue);
    if (!newValue) {
      onLocationSelect('');
    }
  };

  return (
    <div 
      className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 location-search"
      role="searchbox"
      aria-label="Campo de busca de localização"
    >
      <FaMapMarkerAlt 
        className="text-gray-400 mr-2 text-lg" 
        aria-hidden="true"
      />
      <input
        type="text"
        ref={inputRef}
        placeholder="Localização"
        className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
        value={location}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        aria-label="Digite o endereço ou localização desejada"
        aria-autocomplete="list"
        aria-expanded={isApiInitialized}
        aria-controls="location-suggestions"
        aria-describedby="location-description"
      />
      <span id="location-description" className="sr-only">
        Digite um endereço para ver sugestões de localização. Use as setas do teclado para navegar entre as sugestões e pressione Enter para selecionar.
      </span>
      <div id="location-suggestions" className="sr-only" role="listbox" aria-label="Sugestões de localização" />
    </div>
  );
} 