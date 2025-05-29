import Header from "../../Components/Header/Header";
import { useState, useEffect } from "react";
import { spaceService } from "../../services/spaceService";
import { userService } from "../../services/userService";
import { useUser } from "../../Contexts/UserContext";
import SidebarFiltros from "../../Components/SidebarFiltros/SidebarFiltros";
import { useNavigate, useLocation } from "react-router-dom";
import { FavoriteButton } from "../../components/FavoriteButton/FavoriteButton";

function Descobrir() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn } = useUser();
    const [espacos, setEspacos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        ordenarPor: 'asc',
        tipoEspaco: '',
        valorMin: '',
        valorMax: '',
        areaMin: '',
        areaMax: '',
        pessoasMin: '',
        caracteristicas: []
    });

    useEffect(() => {
        // Verifica se há filtros na navegação
        if (location.state?.filtros) {
            setFiltros(location.state.filtros);
            buscarEspacos(location.state.filtros);
        } else {
            buscarEspacos();
        }
    }, [location]);

    const buscarEspacos = async (filtrosAtuais = null) => {
        try {
            setLoading(true);
            const filtrosParaBusca = filtrosAtuais || filtros;
            
            // Prepara os parâmetros para a busca
            const params = new URLSearchParams();
            
            if (filtrosParaBusca.tipoEspaco) {
                params.append('space_type', filtrosParaBusca.tipoEspaco);
            }
            
            if (filtrosParaBusca.valorMin) {
                params.append('min_price', filtrosParaBusca.valorMin);
            }
            
            if (filtrosParaBusca.valorMax) {
                params.append('max_price', filtrosParaBusca.valorMax);
            }
            
            if (filtrosParaBusca.areaMin) {
                params.append('min_area', filtrosParaBusca.areaMin);
            }
            
            if (filtrosParaBusca.areaMax) {
                params.append('max_area', filtrosParaBusca.areaMax);
            }
            
            if (filtrosParaBusca.pessoasMin) {
                params.append('min_people', filtrosParaBusca.pessoasMin);
            }
            
            if (filtrosParaBusca.caracteristicas && filtrosParaBusca.caracteristicas.length > 0) {
                params.append('amenities', filtrosParaBusca.caracteristicas.join(','));
            }

            // Adiciona o parâmetro de ordenação
            if (filtrosParaBusca.ordenarPor) {
                params.append('order_by', filtrosParaBusca.ordenarPor);
            }

            // Faz a chamada para o endpoint com os filtros
            const response = await spaceService.getSpacesWithFilters(params.toString());
            setEspacos(response);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao carregar os espaços. Por favor, tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleFiltrosChange = (novosFiltros) => {
        setFiltros(novosFiltros);
    };

    const handleBuscar = () => {
        buscarEspacos(filtros);
    };

    const handleEspacoClick = async (espacoId) => {
        if (isLoggedIn && user) {
            try {
                await userService.registerSpaceView(user.id, espacoId);
            } catch (error) {
                console.error('Erro ao registrar visualização:', error);
            }
        }
        navigate(`/espaco/${espacoId}`);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1486B8] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando espaços...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                    <button 
                        onClick={() => buscarEspacos()}
                        className="mt-4 bg-[#1486B8] text-white px-4 py-2 rounded hover:bg-[#0f6a94]"
                    >
                        Tentar novamente
                    </button>
                </div>
            );
        }

        return (
            <>
                <span className="block text-base font-semibold mb-4">{espacos.length} Resultados encontrados</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {espacos.map((espaco) => {
                        const rating = espaco.rating ?? '4.80';
                        const imageUrl = Array.isArray(espaco.image_url) 
                            ? espaco.image_url[0] 
                            : (espaco.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80");
                        return (
                            <div 
                                key={espaco._id} 
                                className="w-full text-left bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col cursor-pointer"
                                onClick={() => handleEspacoClick(espaco._id)}
                            >
                                <img 
                                    src={imageUrl}
                                    alt={espaco.space_name} 
                                    className="w-full h-48 object-cover" 
                                />
                                <div className="p-4 flex flex-col gap-1 flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-base">{espaco.space_name}</span>
                                        <span className="flex items-center gap-1 text-sm text-gray-700">
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20' className='w-4 h-4 text-yellow-400'>
                                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z'/>
                                            </svg>
                                            {rating}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">{espaco.location.formatted_address}</span>
                                    <span className="text-[#1486B8] font-semibold text-base">
                                        R$ {espaco.price_per_hour} <span className="text-xs font-normal text-gray-500">por hora</span>
                                    </span>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500">Cabe até <b>{espaco.max_people}</b> pessoas</span>
                                        <FavoriteButton spaceId={espaco._id} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex bg-gray-50 flex-1 overflow-hidden">
                <SidebarFiltros 
                    onFiltrosChange={handleFiltrosChange} 
                    onBuscar={handleBuscar}
                />
                
                {/* Conteúdo principal (cards com scroll) */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Barra de pesquisa */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="flex items-center flex-1 bg-white rounded shadow px-3 py-2">
                            <span className="text-[#1486B8] mr-2 text-lg">
                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z' />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Faça sua pesquisa aqui...."
                                className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-base"
                            />
                        </div>
                        <button 
                            className="flex items-center gap-2 bg-[#1486B8] hover:bg-[#0f6a94] text-white font-medium px-6 py-2 rounded shadow"
                            onClick={handleBuscar}
                        >
                            Ordenar por
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-4 h-4'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                            </svg>
                        </button>
                    </div>
                    {/* Cards de resultados */}
                    <div>
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Descobrir;
