import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { googleMapsService } from '../../services/googleMapsService';

export function LocationSearch() {
  const [location, setLocation] = useState('');
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isApiInitialized, setIsApiInitialized] = useState(false);

  const initializeAutocomplete = async () => {
    try {
      if (!googleMapsService.isApiLoaded()) {
        await googleMapsService.loadGoogleMaps();
      }
      
      if (inputRef.current && !autocompleteRef.current) {
        autocompleteRef.current = googleMapsService.createAutocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry', 'place_id', 'name', 'types'],
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place && place.formatted_address) {
            setLocation(place.formatted_address);
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

  return (
    <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3">
      <FaMapMarkerAlt className="text-gray-400 mr-2 text-lg" />
      <input
        type="text"
        ref={inputRef}
        placeholder="Localização"
        className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onFocus={handleInputFocus}
      />
    </div>
  );
} 