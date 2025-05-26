import { Loader } from '@googlemaps/js-api-loader';

let loader = null;
let isLoaded = false;
let loadPromise = null;

export const googleMapsService = {
  async loadGoogleMaps() {
    if (isLoaded) return;
    
    if (!loadPromise) {
      if (!loader) {
        loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places'],
        });
      }
      
      loadPromise = loader.load().then(() => {
        isLoaded = true;
      });
    }
    
    return loadPromise;
  },

  createAutocomplete(inputElement, options = {}) {
    if (!isLoaded) {
      throw new Error('Google Maps API não foi carregada. Chame loadGoogleMaps() primeiro.');
    }

    return new window.google.maps.places.Autocomplete(inputElement, {
      componentRestrictions: { country: 'br' },
      ...options
    });
  },

  isApiLoaded() {
    return isLoaded;
  }
}; 