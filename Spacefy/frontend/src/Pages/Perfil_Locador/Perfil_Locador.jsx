import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { FaChevronRight } from 'react-icons/fa';

function Perfil_Locatario() {
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
                                    <h2 className="text-lg font-bold">Zaylian Vortelli</h2>
                                    <p className="text-gray-600 text-sm">Locatário</p>
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
                                    <span className="text-sm">01 imóvel cadastrado</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">Desde 17 de março de 2022</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-sm">4.2/5 (183 avaliações)</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Área principal */}
                    <div className="flex-1">
                        <div className="p-6">
                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">Descrição de Zaylian:</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue, magna sed feugiat lobortis, est tellus laoreet purus, sed auctor quam dolor at ipsum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas risus tellus, vehicula rutrum pellentesque vitae, pretium at libero.
                                </p>
                                <div className="mt-6 border-b border-[#00A3FF]"></div>
                            </section>

                            {/* Seção de Locais */}
                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-6">Locais de Zaylian</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Card do Local */}
                                    <div className="flex flex-col">
                                        <div className="w-50 aspect-square rounded-2xl overflow-hidden mb-3">
                                            <img 
                                                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" 
                                                alt="Palácio de Cristal" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="font-bold text-xl">Palácio de Cristal</h3>
                                        <p className="text-gray-600">Rua Leonídio Valemtim Ferr...</p>
                                    </div>
                                </div>
                                <div className="mt-6 border-b border-[#00A3FF]"></div>
                            </section>

                            {/* Seção de Avaliação */}
                            <section className="mt-8">
                                <h2 className="text-xl font-bold mb-6">Avaliação dos usuários</h2>
                                <div className="flex gap-6 items-stretch">
                                    {/* Comentário 1 */}
                                    <article className="bg-white rounded-lg shadow-md p-4 w-[320px] flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 bg-[#2196F3] rounded-full flex items-center justify-center text-white font-bold">M</div>
                                            <span className="font-bold text-[#363636]">Maria Oliveira</span>
                                            <span className="text-xs text-gray-500 ml-auto">★★★★☆</span>
                                        </div>
                                        <p className="text-xs text-[#363636]">Pode melhorar. O espaço é bom, mas a organização deixou a desejar. Tivemos problemas com a iluminação e atrasos na liberação do local. Não comprometeu a festa, mas esperava mais.</p>
                                    </article>

                                    {/* Comentário 2 */}
                                    <article className="bg-white rounded-lg shadow-md p-4 w-[320px] flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 bg-[#2196F3] rounded-full flex items-center justify-center text-white font-bold">R</div>
                                            <span className="font-bold text-[#363636]">Ricardo Fernandes</span>
                                            <span className="text-xs text-gray-500 ml-auto">★★★★★</span>
                                        </div>
                                        <p className="text-xs text-[#363636]">Experiência incrível! O espaço para festas superou todas as expectativas - amplo, bem organizado e exatamente como descrito. A estrutura é perfeita para eventos, com iluminação, som e conforto impecáveis. A comunicação com o anfitrião foi rápida e eficiente, garantindo que tudo saísse como planejado. Com certeza voltarei para futuras celebrações. Recomendo a todos!</p>
                                    </article>

                                    {/* Comentário 3 */}
                                    <article className="bg-white rounded-lg shadow-md p-4 w-[320px] flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 bg-[#2196F3] rounded-full flex items-center justify-center text-white font-bold">C</div>
                                            <span className="font-bold text-[#363636]">Clara Silva</span>
                                            <span className="text-xs text-gray-500 ml-auto">★★★★☆</span>
                                        </div>
                                        <p className="text-xs text-[#363636]">O espaço é bom, mas a organização deixou a desejar. Tivemos problemas com a iluminação e atrasos na liberação do local. Não comprometeu a festa, mas esperava mais.</p>
                                    </article>
                                </div>
                                <div className="mt-8">
                                    <button 
                                        className="bg-[#00A3FF] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0084CC] transition-colors"
                                    >
                                        Ver todas as avaliações
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Perfil_Locatario;