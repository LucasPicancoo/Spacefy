import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { spaceService } from '../../services/spaceService';

function Perfil_Locador() {
    const { id } = useParams();
    const [locador, setLocador] = useState(null);
    const [espacos, setEspacos] = useState([]);
    const [loading, setLoading] = useState(true);

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
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    if (!locador) {
        return <div className="flex justify-center items-center h-screen">Locador não encontrado</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Barra lateral */}
                    <aside className="w-80 self-start sticky top-4">
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">{locador.name} {locador.surname}</h2>
                                    <p className="text-gray-600 text-sm">Locador</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4">Sobre o anunciante</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className="text-sm">{espacos.length} imóveis cadastrados</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">Desde {new Date(locador.createdAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Área principal */}
                    <div className="flex-1">
                        <div className="p-6">
                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">Descrição:</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {locador.description || "Este locador ainda não adicionou uma descrição."}
                                </p>
                                <div className="mt-6 border-b border-[#00A3FF]"></div>
                            </section>

                            {/* Seção de Locais */}
                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-6">Locais do {locador.name}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {espacos.map((espaco) => (
                                        <div key={espaco._id} className="flex flex-col">
                                            <div className="w-50 aspect-square rounded-2xl overflow-hidden mb-3">
                                                <img 
                                                    src={espaco.image_url[0] || "https://via.placeholder.com/400"} 
                                                    alt={espaco.space_name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="font-bold text-xl">{espaco.space_name}</h3>
                                            <p className="text-gray-600">{espaco.location.formatted_address}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 border-b border-[#00A3FF]"></div>
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