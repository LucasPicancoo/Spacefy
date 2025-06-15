import Header from "../../Components/Header/Header";
import { useState, useEffect } from "react";
import { spaceService } from "../../services/spaceService";
import { userService } from "../../services/userService";
import { useUser } from "../../Contexts/UserContext";
import SidebarFiltros from "../../Components/SidebarFiltros/SidebarFiltros";
import { useNavigate, useLocation } from "react-router-dom";
import { FavoriteButton } from "../../Components/FavoriteButton/FavoriteButton";
import SpaceCard from "../../Components/SpaceCard/SpaceCard";
import MiniChat from "../../Components/MiniChat/MiniChat";

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
        caracteristicas: [],
        location: '',
        dataInicio: null,
        dataFim: null
    });

    useEffect(() => {
        // Verifica se há filtros na navegação
        if (location.state?.filtros) {
            const novosFiltros = {
                ...filtros,
                ...location.state.filtros
            };
            setFiltros(novosFiltros);
            buscarEspacos(novosFiltros);
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

            if (filtrosParaBusca.location) {
                params.append('location', filtrosParaBusca.location);
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
                <div 
                    className="text-center py-8"
                    role="status"
                    aria-label="Carregando espaços"
                >
                    <div 
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1486B8] mx-auto"
                        aria-hidden="true"
                    ></div>
                    <p className="mt-4 text-gray-600">Carregando espaços...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div 
                    className="text-center py-8"
                    role="alert"
                    aria-label="Mensagem de erro"
                >
                    <p className="text-red-500">{error}</p>
                    <button 
                        onClick={() => buscarEspacos()}
                        className="mt-4 bg-[#1486B8] text-white px-4 py-2 rounded hover:bg-[#0f6a94]"
                        aria-label="Tentar carregar os espaços novamente"
                    >
                        Tentar novamente
                    </button>
                </div>
            );
        }

        return (
            <div 
                className="w-full"
                role="region"
                aria-label="Resultados da busca"
            >
                <span 
                    className="block text-base font-semibold mb-4"
                    aria-label={`${espacos.length} espaços encontrados`}
                >
                    {espacos.length} Resultados encontrados
                </span>
                <div 
                    className="flex flex-wrap gap-6"
                    role="list"
                    aria-label="Lista de espaços encontrados"
                >
                    {espacos.map((espaco) => (
                        <SpaceCard
                            key={espaco._id}
                            space={espaco}
                            onClick={() => handleEspacoClick(espaco._id)}
                            containerClassName="w-[280px] min-w-[280px] text-left bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col cursor-pointer"
                            aria-label={`Espaço: ${espaco.space_name}`}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div 
            className="min-h-screen bg-gray-50"
            role="main"
            aria-label="Página de descoberta de espaços"
        >
            <Header />
            <div 
                className="flex bg-gray-50 flex-1 overflow-hidden"
                role="region"
                aria-label="Área principal de busca e resultados"
            >
                <SidebarFiltros 
                    onFiltrosChange={handleFiltrosChange} 
                    onBuscar={handleBuscar}
                    filtrosIniciais={filtros}
                    aria-label="Filtros de busca"
                />
                
                {/* Conteúdo principal (cards com scroll) */}
                <main 
                    className="flex-1 p-8 overflow-y-auto"
                    role="region"
                    aria-label="Resultados da busca"
                >
                    {/* Barra de pesquisa */}
                    <div 
                        className="flex items-center gap-2 mb-8"
                        role="search"
                        aria-label="Barra de pesquisa"
                    >
                        <div 
                            className="flex items-center flex-1 bg-white rounded shadow px-3 py-2"
                            role="searchbox"
                        >
                            <span 
                                className="text-[#1486B8] mr-2 text-lg"
                                aria-hidden="true"
                            >
                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z' />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Faça sua pesquisa aqui...."
                                className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-base"
                                aria-label="Campo de pesquisa de espaços"
                            />
                        </div>
                        <button 
                            className="flex items-center gap-2 bg-[#1486B8] hover:bg-[#0f6a94] text-white font-medium px-6 py-2 rounded shadow"
                            onClick={handleBuscar}
                            aria-label="Ordenar resultados"
                            aria-expanded="false"
                        >
                            Ordenar por
                            <svg 
                                xmlns='http://www.w3.org/2000/svg' 
                                fill='none' 
                                viewBox='0 0 24 24' 
                                strokeWidth={2} 
                                stroke='currentColor' 
                                className='w-4 h-4'
                                aria-hidden="true"
                            >
                                <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                            </svg>
                        </button>
                    </div>
                    {/* Cards de resultados */}
                    <div role="region" aria-label="Resultados da busca">
                        {renderContent()}
                    </div>
                </main>
            </div>
            <MiniChat aria-label="Chat de mensagens" />
        </div>
    );
}

export default Descobrir;
