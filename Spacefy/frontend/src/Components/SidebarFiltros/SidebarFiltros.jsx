import { useState } from "react";

function SidebarFiltros({ onFiltrosChange }) {
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
        
        // Notifica o componente pai sobre a limpeza dos filtros
        onFiltrosChange({
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
    };

    const handleFiltroChange = (campo, valor) => {
        // Atualiza o estado local
        switch (campo) {
            case 'ordenarPor':
                setOrdenarPor(valor);
                break;
            case 'tipoEspaco':
                setTipoEspaco(valor);
                break;
            case 'valorMin':
                setValorMin(valor);
                break;
            case 'valorMax':
                setValorMax(valor);
                break;
            case 'areaMin':
                setAreaMin(valor);
                break;
            case 'areaMax':
                setAreaMax(valor);
                break;
            case 'pessoasMin':
                setPessoasMin(valor);
                break;
            case 'caracteristicas':
                setCaracteristicas(valor);
                break;
            case 'caracteristicasTipo':
                setCaracteristicasTipo(valor);
                break;
            default:
                break;
        }

        // Notifica o componente pai sobre a mudança
        onFiltrosChange({
            ordenarPor,
            tipoEspaco,
            valorMin,
            valorMax,
            areaMin,
            areaMax,
            pessoasMin,
            caracteristicas,
            caracteristicasTipo,
            [campo]: valor
        });
    };

    return (
        <aside className="w-[320px] bg-white border-r border-gray-200 p-6 flex flex-col gap-4 h-screen sticky top-0">
            {/* Ordenar Por */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar Por</label>
                <select 
                    value={ordenarPor} 
                    onChange={e => handleFiltroChange('ordenarPor', e.target.value)} 
                    className="w-full border rounded px-3 py-2 text-gray-700"
                >
                    {opcoesOrdenar.map(op => <option key={op}>{op}</option>)}
                </select>
            </div>

            {/* Tipo do Espaço */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo do Espaço</label>
                <select 
                    value={tipoEspaco} 
                    onChange={e => handleFiltroChange('tipoEspaco', e.target.value)} 
                    className="w-full border rounded px-3 py-2 text-gray-700"
                >
                    {opcoesTipo.map(op => <option key={op}>{op}</option>)}
                </select>
            </div>

            {/* Valores e Área */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="block text-xs text-gray-500">Valor Min</label>
                    <input 
                        type="number" 
                        value={valorMin} 
                        onChange={e => handleFiltroChange('valorMin', e.target.value)} 
                        placeholder="R$" 
                        className="w-full border rounded px-2 py-1" 
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs text-gray-500">Valor Max</label>
                    <input 
                        type="number" 
                        value={valorMax} 
                        onChange={e => handleFiltroChange('valorMax', e.target.value)} 
                        placeholder="R$" 
                        className="w-full border rounded px-2 py-1" 
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="block text-xs text-gray-500">Area Min</label>
                    <input 
                        type="number" 
                        value={areaMin} 
                        onChange={e => handleFiltroChange('areaMin', e.target.value)} 
                        placeholder="m2" 
                        className="w-full border rounded px-2 py-1" 
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs text-gray-500">Area Max</label>
                    <input 
                        type="number" 
                        value={areaMax} 
                        onChange={e => handleFiltroChange('areaMax', e.target.value)} 
                        placeholder="m2" 
                        className="w-full border rounded px-2 py-1" 
                    />
                </div>
            </div>

            {/* Pessoas Min */}
            <div>
                <label className="block text-xs text-gray-500">Pessoas Min</label>
                <input 
                    type="number" 
                    value={pessoasMin} 
                    onChange={e => handleFiltroChange('pessoasMin', e.target.value)} 
                    placeholder="0" 
                    className="w-full border rounded px-2 py-1" 
                />
            </div>

            {/* Características do espaço */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Características do espaço</label>
                <div className="flex flex-col gap-1">
                    {opcoesCaracteristicas.map((op, i) => (
                        <label key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                            <input 
                                type="radio" 
                                name="caracteristicas" 
                                checked={caracteristicas === op} 
                                onChange={() => handleFiltroChange('caracteristicas', op)} 
                            />
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
                            <input 
                                type="radio" 
                                name="caracteristicasTipo" 
                                checked={caracteristicasTipo === op} 
                                onChange={() => handleFiltroChange('caracteristicasTipo', op)} 
                            />
                            {op}
                        </label>
                    ))}
                </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2 mt-2">
                <button 
                    onClick={limparFiltros} 
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold"
                >
                    Limpar
                </button>
                <button 
                    className="flex-1 bg-[#1EACE3] text-white py-2 rounded font-semibold"
                >
                    Buscar
                </button>
            </div>
        </aside>
    );
}

export default SidebarFiltros; 