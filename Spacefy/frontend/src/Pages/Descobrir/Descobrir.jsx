import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import { useState, useEffect } from "react";
import { spaceService } from "../../services/spaceService";
import SidebarFiltros from "../../Components/SidebarFiltros/SidebarFiltros";
import { useNavigate } from "react-router-dom";

function Descobrir() {
    const navigate = useNavigate();
    const [espacos, setEspacos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        ordenarPor: 'Relevantes',
        tipoEspaco: '',
        valorMin: '',
        valorMax: '',
        areaMin: '',
        areaMax: '',
        pessoasMin: '',
        caracteristicas: '',
        caracteristicasTipo: ''
    });

    useEffect(() => {
        buscarEspacos();
    }, []);

    const buscarEspacos = async () => {
        try {
            setLoading(true);
            const response = await spaceService.getSpaces();
            setEspacos(response);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar os espaços. Por favor, tente novamente mais tarde.');
            console.error('Erro ao buscar espaços:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltrosChange = (novosFiltros) => {
        setFiltros(novosFiltros);
        // Aqui você pode implementar a lógica de filtragem dos espaços
        // baseado nos novos filtros
    };

    const handleEspacoClick = (espacoId) => {
        navigate(`/espaco/${espacoId}`);
    };

    return (
        <div>
            <Header />
            <div className="flex bg-gray-50 min-h-screen">
                <SidebarFiltros onFiltrosChange={handleFiltrosChange} />
                
                {/* Conteúdo principal (cards com scroll) */}
                <main className="flex-1 p-8 h-screen overflow-y-auto">
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
                        <button className="flex items-center gap-2 bg-[#1486B8] hover:bg-[#0f6a94] text-white font-medium px-6 py-2 rounded shadow">
                            Ordenar por
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-4 h-4'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                            </svg>
                        </button>
                    </div>
                    {/* Cards de resultados */}
                    <div>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1486B8] mx-auto"></div>
                                <p className="mt-4 text-gray-600">Carregando espaços...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-500">{error}</p>
                                <button 
                                    onClick={buscarEspacos}
                                    className="mt-4 bg-[#1486B8] text-white px-4 py-2 rounded hover:bg-[#0f6a94]"
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="block text-base font-semibold mb-4">{espacos.length} Resultados encontrados</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {espacos.map((espaco) => (
                                        <div 
                                            key={espaco._id} 
                                            className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col cursor-pointer"
                                            onClick={() => handleEspacoClick(espaco._id)}
                                        >
                                            <img 
                                                src={Array.isArray(espaco.image_url) ? espaco.image_url[0] : (espaco.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80")} 
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
                                                        {espaco.rating || '4.80'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">{espaco.location}</span>
                                                <span className="text-[#1486B8] font-semibold text-base">
                                                    R$ {espaco.price_per_hour} <span className="text-xs font-normal text-gray-500">por hora</span>
                                                </span>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-500">Cabe até <b>{espaco.max_people}</b> pessoas</span>
                                                    <button 
                                                        className="text-[#1486B8] hover:text-[#0f6a94]"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Impede que o clique no botão propague para o card
                                                            // Aqui você pode adicionar a lógica para favoritar o espaço
                                                        }}
                                                    >
                                                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-6 h-6'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' d='M16.5 5.25a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 5.25C5.014 5.25 3 7.264 3 9.75c0 4.418 7.5 9 7.5 9s7.5-4.582 7.5-9c0-2.486-2.014-4.5-4.5-4.5z' />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Descobrir;
