import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import { useState } from "react";

function Descobrir() {
    // Estados para os filtros
    const [ordenarPor, setOrdenarPor] = useState('Relevantes');
    const [tipoEspaco, setTipoEspaco] = useState('');
    const [valorMin, setValorMin] = useState('');
    const [valorMax, setValorMax] = useState('');
    const [areaMin, setAreaMin] = useState('');
    const [areaMax, setAreaMax] = useState('');
    const [pessoasMin, setPessoasMin] = useState('');
    const [caracteristicas, setCaracteristicas] = useState('');
    const [caracteristicasTipo, setCaracteristicasTipo] = useState('');

    // Mock de opções
    const opcoesOrdenar = ['Relevantes', 'Mais recentes', 'Menor preço', 'Maior preço'];
    const opcoesTipo = ['Todos os tipos', 'Auditório', 'Sala de reunião', 'Coworking'];
    const opcoesCaracteristicas = Array(6).fill('TAL/TAL');
    const opcoesCaracteristicasTipo = Array(6).fill('TAL/TAL');

    const limparFiltros = () => {
        setOrdenarPor('Relevantes');
        setTipoEspaco('');
        setValorMin('');
        setValorMax('');
        setAreaMin('');
        setAreaMax('');
        setPessoasMin('');
        setCaracteristicas('');
        setCaracteristicasTipo('');
    };

    return (
        <div>
            <Header />
            <div className="flex bg-gray-50 min-h-screen">
                {/* Sidebar de Filtros */}
                <aside className="w-[320px] bg-white border-r border-gray-200 p-6 flex flex-col gap-4 h-screen sticky top-0">
                    {/* Ordenar Por */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar Por</label>
                        <select value={ordenarPor} onChange={e => setOrdenarPor(e.target.value)} className="w-full border rounded px-3 py-2 text-gray-700">
                            {opcoesOrdenar.map(op => <option key={op}>{op}</option>)}
                        </select>
                    </div>
                    {/* Tipo do Espaço */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo do Espaço</label>
                        <select value={tipoEspaco} onChange={e => setTipoEspaco(e.target.value)} className="w-full border rounded px-3 py-2 text-gray-700">
                            {opcoesTipo.map(op => <option key={op}>{op}</option>)}
                        </select>
                    </div>
                    {/* Valores e Área */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500">Valor Min</label>
                            <input type="number" value={valorMin} onChange={e => setValorMin(e.target.value)} placeholder="R$" className="w-full border rounded px-2 py-1" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500">Valor Max</label>
                            <input type="number" value={valorMax} onChange={e => setValorMax(e.target.value)} placeholder="R$" className="w-full border rounded px-2 py-1" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500">Area Min</label>
                            <input type="number" value={areaMin} onChange={e => setAreaMin(e.target.value)} placeholder="m2" className="w-full border rounded px-2 py-1" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500">Area Max</label>
                            <input type="number" value={areaMax} onChange={e => setAreaMax(e.target.value)} placeholder="m2" className="w-full border rounded px-2 py-1" />
                        </div>
                    </div>
                    {/* Pessoas Min */}
                    <div>
                        <label className="block text-xs text-gray-500">Pessoas Min</label>
                        <input type="number" value={pessoasMin} onChange={e => setPessoasMin(e.target.value)} placeholder="0" className="w-full border rounded px-2 py-1" />
                    </div>
                    {/* Características do espaço */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Características do espaço</label>
                        <div className="flex flex-col gap-1">
                            {opcoesCaracteristicas.map((op, i) => (
                                <label key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                    <input type="radio" name="caracteristicas" checked={caracteristicas === op} onChange={() => setCaracteristicas(op)} />
                                    {op}
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Características específicas do tipo do espaço */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Características específicas do tipo do espaço</label>
                        <div className="flex flex-col gap-1">
                            {opcoesCaracteristicasTipo.map((op, i) => (
                                <label key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                                    <input type="radio" name="caracteristicasTipo" checked={caracteristicasTipo === op} onChange={() => setCaracteristicasTipo(op)} />
                                    {op}
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Botões */}
                    <div className="flex gap-2 mt-2">
                        <button onClick={limparFiltros} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold">Limpar</button>
                        <button className="flex-1 bg-[#1EACE3] text-white py-2 rounded font-semibold">Buscar</button>
                    </div>
                </aside>
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
                        <span className="block text-base font-semibold mb-4">123 Resultados encontrados</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1,2,3,4,5,6].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Espaço" className="w-full h-48 object-cover" />
                                    <div className="p-4 flex flex-col gap-1 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-base">Porto Bello, Muriaé - MG</span>
                                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                                <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20' className='w-4 h-4 text-yellow-400'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z'/></svg>
                                                4,80
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">Rua Lendário Valenting Ferreira</span>
                                        <span className="text-[#1486B8] font-semibold text-base">R$ 2.000 <span className="text-xs font-normal text-gray-500">por hora</span></span>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">Cabe até <b>80</b> pessoas</span>
                                            <button className="text-[#1486B8] hover:text-[#0f6a94]">
                                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-6 h-6'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='M16.5 5.25a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 5.25C5.014 5.25 3 7.264 3 9.75c0 4.418 7.5 9 7.5 9s7.5-4.582 7.5-9c0-2.486-2.014-4.5-4.5-4.5z' />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Conteúdo dos espaços filtrados aqui */}
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default Descobrir;
