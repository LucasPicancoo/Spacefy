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
        <div className="flex justify-center items-center w-full">
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-[#363636] mb-4">Localização:</h2>
                <div className="w-[800px] h-[400px] rounded-lg overflow-hidden shadow-lg">
                    <div ref={mapRef} className="w-full h-full" />
                </div>
            </div>
        </div>
    );
}

export default MapaEspaço; 