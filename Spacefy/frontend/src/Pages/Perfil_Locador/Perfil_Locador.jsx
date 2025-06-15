import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { FaChevronRight, FaStar } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { spaceService } from '../../services/spaceService';
import SpaceCard from "../../Components/SpaceCard/SpaceCard";

function Perfil_Locador() {
    const { id } = useParams();
    const [locador, setLocador] = useState(null);
    const [espacos, setEspacos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocadorData = async () => {
            try {
                const userData = await userService.getUserById(id);
                setLocador(userData);

                // Buscar espaços do locador
                const spacesData = await spaceService.getSpacesByOwnerId(id);
                setEspacos(spacesData);
            } catch (error) {
                console.error('Erro ao buscar dados do locador:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocadorData();
    }, [id]);

    if (loading) {
        return (
            <div 
                className="flex justify-center items-center h-screen" 
                role="status" 
                aria-label="Carregando informações do locador"
            >
                Carregando...
            </div>
        );
    }

    if (!locador) {
        return (
            <div 
                className="flex justify-center items-center h-screen" 
                role="alert" 
                aria-label="Locador não encontrado"
            >
                Locador não encontrado
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" role="main" aria-label="Página de perfil do locador">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Barra lateral */}
                    <aside className="w-80 self-start sticky top-4" role="complementary" aria-label="Informações do locador">
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                            <div className="flex items-center space-x-4 mb-6">
                                <div 
                                    className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center"
                                    role="img"
                                    aria-label={`Foto de perfil de ${locador.name} ${locador.surname}`}
                                >
                                    <svg 
                                        className="w-8 h-8 text-gray-600" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                    >
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold" aria-label={`Nome do locador: ${locador.name} ${locador.surname}`}>
                                        {locador.name} {locador.surname}
                                    </h2>
                                    <p className="text-gray-600 text-sm">Locador</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6" role="region" aria-label="Informações adicionais">
                            <h3 className="text-lg font-bold mb-4">Sobre o anunciante</h3>
                            <div className="space-y-4" role="list" aria-label="Estatísticas do locador">
                                <div className="flex items-center space-x-3" role="listitem">
                                    <svg 
                                        className="w-5 h-5 text-gray-600" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className="text-sm" aria-label={`${espacos.length} imóveis cadastrados`}>
                                        {espacos.length} imóveis cadastrados
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3" role="listitem">
                                    <FaStar className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                                    <span className="text-sm" aria-label="Avaliação média: 4.8 de 5 estrelas, baseado em 120 avaliações">
                                        4.8 (120 avaliações)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Área principal */}
                    <div className="flex-1" role="region" aria-label="Lista de espaços do locador">
                        <div className="p-6">
                            {/* Seção de Locais */}
                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-6" aria-label={`Locais do ${locador.name}`}>
                                    Locais do {locador.name}
                                </h2>
                                <div 
                                    className="flex flex-wrap gap-6"
                                    role="list"
                                    aria-label="Lista de espaços disponíveis"
                                >
                                    {espacos.map((espaco) => (
                                        <SpaceCard
                                            key={espaco._id}
                                            space={espaco}
                                            onClick={() => navigate(`/espaco/${espaco._id}`)}
                                            containerClassName="w-[280px] min-w-[280px] text-left bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col cursor-pointer"
                                            aria-label={`Espaço: ${espaco.space_name}`}
                                        />
                                    ))}
                                </div>
                                <div className="mt-6 border-b border-[#00A3FF]" aria-hidden="true"></div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Perfil_Locador;