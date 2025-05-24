import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'],
});

export function LocationSearch() {
  const [location, setLocation] = useState('');
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    loader.load().then(() => {
      if (inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          // Retira o filtro de types para permitir resultados amplos
          componentRestrictions: { country: 'br' },
          fields: ['formatted_address', 'geometry', 'place_id', 'name', 'types'],
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place && place.formatted_address) {
            setLocation(place.formatted_address);
          }
        });
      }
    });
  }, []);

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
      />
    </div>
  );
} 