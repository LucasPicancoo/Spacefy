import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

function MapaEspaço({ location }) {
    const mapRef = useRef(null);

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                version: 'weekly',
                libraries: ['places']
            });

            try {
                const google = await loader.load();
                
                const position = {
                    lat: location.coordinates.lat,
                    lng: location.coordinates.lng
                };

                const mapOptions = {
                    center: position,
                    zoom: 15,
                    mapId: 'spacefy_map'
                };

                const map = new google.maps.Map(mapRef.current, mapOptions);
                
                new google.maps.Marker({
                    position: position,
                    map: map,
                    title: location.formatted_address
                });
            } catch (error) {
                console.error('Erro ao carregar o mapa:', error);
            }
        };

        if (location && location.coordinates) {
            initMap();
        }
    }, [location]);

    return (
        <div 
            className="flex justify-center items-center w-full"
            role="region"
            aria-label="Seção de localização do espaço"
        >
            <div 
                className="flex flex-col items-center"
                role="group"
                aria-label="Informações de localização"
            >
                <h2 
                    className="text-2xl font-bold text-[#363636] mb-4"
                    aria-label="Localização do espaço"
                >
                    Localização:
                </h2>
                <div 
                    className="w-[800px] h-[400px] rounded-lg overflow-hidden shadow-lg"
                    role="application"
                    aria-label={`Mapa mostrando a localização do espaço em ${location?.formatted_address || 'endereço não disponível'}`}
                >
                    <div 
                        ref={mapRef} 
                        className="w-full h-full"
                        role="img"
                        aria-label={`Mapa interativo do Google Maps mostrando a localização em ${location?.formatted_address || 'endereço não disponível'}`}
                    />
                </div>
            </div>
        </div>
    );
}

export default MapaEspaço; 