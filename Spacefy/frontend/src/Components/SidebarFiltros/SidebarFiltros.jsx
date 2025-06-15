import { useState, useEffect } from "react";
import { startOfDay } from 'date-fns';
import { LocationSearch } from '../SearchBar/LocationSearch';

function SidebarFiltros({ onFiltrosChange, onBuscar, filtrosIniciais }) {
    // Estados para os filtros
    const [ordenarPor, setOrdenarPor] = useState(filtrosIniciais?.ordenarPor || 'asc');
    const [tipoEspaco, setTipoEspaco] = useState(filtrosIniciais?.tipoEspaco || '');
    const [valorMin, setValorMin] = useState(filtrosIniciais?.valorMin || '');
    const [valorMax, setValorMax] = useState(filtrosIniciais?.valorMax || '');
    const [areaMin, setAreaMin] = useState(filtrosIniciais?.areaMin || '');
    const [areaMax, setAreaMax] = useState(filtrosIniciais?.areaMax || '');
    const [pessoasMin, setPessoasMin] = useState(filtrosIniciais?.pessoasMin || '');
    const [caracteristicas, setCaracteristicas] = useState(filtrosIniciais?.caracteristicas || []);
    const [location, setLocation] = useState(filtrosIniciais?.location || '');
    const [startDate, setStartDate] = useState(filtrosIniciais?.dataInicio || null);
    const [endDate, setEndDate] = useState(filtrosIniciais?.dataFim || null);
    const today = startOfDay(new Date());

    // Atualiza os estados quando os filtros iniciais mudam
    useEffect(() => {
        if (filtrosIniciais) {
            setOrdenarPor(filtrosIniciais.ordenarPor || 'asc');
            setTipoEspaco(filtrosIniciais.tipoEspaco || '');
            setValorMin(filtrosIniciais.valorMin || '');
            setValorMax(filtrosIniciais.valorMax || '');
            setAreaMin(filtrosIniciais.areaMin || '');
            setAreaMax(filtrosIniciais.areaMax || '');
            setPessoasMin(filtrosIniciais.pessoasMin || '');
            setCaracteristicas(filtrosIniciais.caracteristicas || []);
            setLocation(filtrosIniciais.location || '');
            setStartDate(filtrosIniciais.dataInicio || null);
            setEndDate(filtrosIniciais.dataFim || null);
        }
    }, [filtrosIniciais]);

    // Mock de opções
    const opcoesOrdenar = [
        { value: 'recent', label: 'Mais recentes' },
        { value: 'asc', label: 'Menor preço' },
        { value: 'desc', label: 'Maior preço' }
    ];
    const opcoesTipo = [
        { value: '', label: 'Todos os tipos' },
        { value: 'estudio', label: 'Estúdio' },
        { value: 'quadra', label: 'Quadra' },
        { value: 'sala_de_reuniões', label: 'Sala de Reuniões' }
    ];
    
    const categoriasCaracteristicas = {
        'Acessibilidade': [
            'estacionamento',
            'bicicletario',
            'ponto_transporte',
            'acesso_pcd',
            'elevador',
            'rampa_acesso',
            'banheiro_pcd'
        ],
        'Conforto e Infraestrutura': [
            'ar_condicionado',
            'cadeiras',
            'mesas',
            'palco',
            'som',
            'microfones',
            'banheiros',
            'vestiarios',
            'chuveiros',
            'armarios',
            'espelho',
            'ventiladores',
            'aquecimento',
            'acustica',
            'iluminacao_cenica'
        ],
        'Alimentação e Conveniência': [
            'cafeteira',
            'bebedouro',
            'cozinha',
            'loucas',
            'talheres',
            'fogao',
            'forno',
            'microondas',
            'churrasqueira',
            'geladeira',
            'freezer',
            'pia',
            'mesa_bar',
            'buffet'
        ],
        'Equipamentos e Tecnologia': [
            'wifi',
            'projetor',
            'tela_projecao',
            'som_tecnologia',
            'microfones_tecnologia',
            'equipamentos_auxiliares',
            'computador',
            'tv',
            'video_conferencia',
            'impressora',
            'scanner',
            'tomadas_220v',
            'gerador'
        ],
        'Segurança': [
            'cameras',
            'alarme',
            'combate_incendio',
            'iluminacao_emergencia',
            'guarita',
            'controle_acesso',
            'monitoramento_24h'
        ],
        'Áreas Externas': [
            'jardim',
            'deck',
            'piscina',
            'quadra',
            'playground',
            'varanda',
            'terraco',
            'estacionamento_coberto'
        ]
    };

    const limparFiltros = () => {
        setOrdenarPor('Relevantes');
        setTipoEspaco('');
        setValorMin('');
        setValorMax('');
        setAreaMin('');
        setAreaMax('');
        setPessoasMin('');
        setCaracteristicas([]);
        setLocation('');
        setStartDate(null);
        setEndDate(null);
        
        // Notifica o componente pai sobre a limpeza dos filtros
        onFiltrosChange({
            ordenarPor: 'Relevantes',
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
    };

    const handleFiltroChange = (campo, valor) => {
        // Atualiza o estado local
        let numPessoas, valorMinNum, valorMaxNum, areaMinNum, areaMaxNum;
        
        switch (campo) {
            case 'ordenarPor':
                setOrdenarPor(valor);
                break;
            case 'tipoEspaco':
                setTipoEspaco(valor);
                break;
            case 'valorMin':
                valorMinNum = parseInt(valor);
                setValorMin(valorMinNum >= 0 ? valorMinNum : '');
                break;
            case 'valorMax':
                valorMaxNum = parseInt(valor);
                setValorMax(valorMaxNum >= 0 ? valorMaxNum : '');
                break;
            case 'areaMin':
                areaMinNum = parseInt(valor);
                setAreaMin(areaMinNum >= 0 ? areaMinNum : '');
                break;
            case 'areaMax':
                areaMaxNum = parseInt(valor);
                setAreaMax(areaMaxNum >= 0 ? areaMaxNum : '');
                break;
            case 'pessoasMin':
                numPessoas = parseInt(valor);
                if (numPessoas > 0) {
                    setPessoasMin(numPessoas);
                } else {
                    setPessoasMin('');
                }
                break;
            case 'caracteristicas':
                setCaracteristicas(prev => {
                    const newCaracteristicas = prev.includes(valor)
                        ? prev.filter(c => c !== valor)
                        : [...prev, valor];
                    return newCaracteristicas;
                });
                break;
            case 'location':
                setLocation(valor);
                break;
            case 'dataInicio':
                setStartDate(valor);
                break;
            case 'dataFim':
                setEndDate(valor);
                break;
            default:
                break;
        }

        const getCaracteristicasValue = () => {
            if (campo !== 'caracteristicas') return valor;
            return caracteristicas.includes(valor)
                ? caracteristicas.filter(c => c !== valor)
                : [...caracteristicas, valor];
        };

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
            location,
            dataInicio: startDate,
            dataFim: endDate,
            [campo]: getCaracteristicasValue()
        });
    };

    return (
        <aside 
            className="w-[320px] min-w-[320px] max-w-[320px] bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-hidden"
            role="complementary"
            aria-label="Filtros de busca"
        >
            <div 
                className="p-6 flex flex-col gap-8 overflow-y-auto overflow-x-hidden flex-1"
                role="form"
                aria-label="Formulário de filtros"
            >
                {/* Localização */}
                <div role="group" aria-labelledby="localizacao-label">
                    <label id="localizacao-label" className="block text-sm font-medium text-gray-800 mb-2">Localização</label>
                    <LocationSearch 
                        onLocationSelect={(loc) => handleFiltroChange('location', loc)}
                        initialLocation={location}
                        aria-label="Buscar localização"
                    />
                </div>

                {/* Datas */}
                <div role="group" aria-labelledby="periodo-label">
                    <label id="periodo-label" className="block text-sm font-medium text-gray-800 mb-2">Período</label>
                    <div className="flex gap-2">
                        <div className="w-[140px]">
                            <input
                                type="date"
                                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : null;
                                    handleFiltroChange('dataInicio', date);
                                }}
                                min={today.toISOString().split('T')[0]}
                                className="w-full border-0 bg-gray-50 rounded-lg px-2 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:ring-inset text-sm cursor-text"
                                aria-label="Data de início"
                            />
                        </div>
                        <div className="w-[140px]">
                            <input
                                type="date"
                                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : null;
                                    handleFiltroChange('dataFim', date);
                                }}
                                min={startDate ? startDate.toISOString().split('T')[0] : today.toISOString().split('T')[0]}
                                className="w-full border-0 bg-gray-50 rounded-lg px-2 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:ring-inset text-sm cursor-text"
                                aria-label="Data de término"
                            />
                        </div>
                    </div>
                </div>

                {/* Ordenar Por */}
                <div role="group" aria-labelledby="ordenar-label">
                    <label id="ordenar-label" className="block text-sm font-medium text-gray-800 mb-2">Ordenar Por</label>
                    <select 
                        value={ordenarPor} 
                        onChange={e => handleFiltroChange('ordenarPor', e.target.value)} 
                        className="w-full border-0 bg-gray-50 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:ring-inset cursor-pointer"
                        aria-label="Ordenar resultados por"
                    >
                        {opcoesOrdenar.map(op => (
                            <option key={op.value} value={op.value}>
                                {op.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tipo do Espaço */}
                <div role="group" aria-labelledby="tipo-label">
                    <label id="tipo-label" className="block text-sm font-medium text-gray-800 mb-2">Tipo do Espaço</label>
                    <select 
                        value={tipoEspaco} 
                        onChange={e => handleFiltroChange('tipoEspaco', e.target.value)} 
                        className="w-full border-0 bg-gray-50 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:ring-inset cursor-pointer"
                        aria-label="Selecionar tipo de espaço"
                    >
                        {opcoesTipo.map(op => (
                            <option key={op.value} value={op.value}>
                                {op.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Valores e Área */}
                <div className="space-y-6" role="group" aria-labelledby="valores-area-label">
                    <h3 id="valores-area-label" className="text-sm font-medium text-gray-800 mb-2">Faixa de Preço</h3>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <input 
                                type="number" 
                                value={valorMin} 
                                onChange={e => handleFiltroChange('valorMin', e.target.value)} 
                                placeholder="Valor Min" 
                                className="w-full border-0 bg-gray-50 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:ring-inset"
                                aria-label="Valor mínimo em reais"
                            />
                        </div>
                        <div className="flex-1">
                            <input 
                                type="number" 
                                value={valorMax} 
                                onChange={e => handleFiltroChange('valorMax', e.target.value)} 
                                placeholder="Valor Max" 
                                className="w-full border-0 bg-gray-50 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:ring-inset"
                                aria-label="Valor máximo em reais"
                            />
                        </div>
                    </div>

                    <div role="group" aria-labelledby="area-label">
                        <h3 id="area-label" className="text-sm font-medium text-gray-800 mb-2">Área do Espaço</h3>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <input 
                                    type="number" 
                                    value={areaMin} 
                                    onChange={e => handleFiltroChange('areaMin', e.target.value)} 
                                    placeholder="Area Min" 
                                    className="w-full border-0 bg-gray-50 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:ring-inset"
                                    aria-label="Área mínima em metros quadrados"
                                />
                            </div>
                            <div className="flex-1">
                                <input 
                                    type="number" 
                                    value={areaMax} 
                                    onChange={e => handleFiltroChange('areaMax', e.target.value)} 
                                    placeholder="Area Max" 
                                    className="w-full border-0 bg-gray-50 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:ring-inset"
                                    aria-label="Área máxima em metros quadrados"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pessoas Min */}
                <div role="group" aria-labelledby="pessoas-label">
                    <label id="pessoas-label" className="block text-sm font-medium text-gray-800 mb-2">Capacidade Mínima</label>
                    <input 
                        type="number" 
                        value={pessoasMin} 
                        onChange={e => handleFiltroChange('pessoasMin', e.target.value)} 
                        placeholder="Número de pessoas" 
                        className="w-full border-0 bg-gray-50 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1486B8] focus:ring-inset"
                        aria-label="Número mínimo de pessoas"
                    />
                </div>

                {/* Características do espaço */}
                <div role="group" aria-labelledby="caracteristicas-label">
                    <label id="caracteristicas-label" className="block text-sm font-medium text-gray-800 mb-3">Características do espaço</label>
                    <div className="flex flex-col gap-6">
                        {Object.entries(categoriasCaracteristicas).map(([categoria, itens]) => (
                            <div key={categoria} className="border-b border-gray-100 pb-4 last:border-0">
                                <h3 className="font-medium text-gray-800 mb-3">{categoria}</h3>
                                <div className="flex flex-col gap-2.5" role="group" aria-label={`Características de ${categoria}`}>
                                    {itens.map((item) => (
                                        <label key={item} className="flex items-center gap-2.5 text-gray-600 text-sm hover:text-[#1486B8] cursor-pointer transition-colors">
                                            <div className="relative">
                                                <input 
                                                    type="checkbox" 
                                                    name="caracteristicas" 
                                                    checked={caracteristicas.includes(item)} 
                                                    onChange={() => handleFiltroChange('caracteristicas', item)}
                                                    className="peer sr-only"
                                                    aria-label={item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                />
                                                <div className="w-4 h-4 border-2 border-gray-200 rounded-full peer-checked:border-[#1486B8] peer-checked:bg-[#1486B8] transition-colors">
                                                    {caracteristicas.includes(item) && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Botões */}
            <div className="p-6 border-t border-gray-100 bg-white" role="group" aria-label="Ações dos filtros">
                <div className="flex gap-3">
                    <button 
                        onClick={limparFiltros} 
                        className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        aria-label="Limpar todos os filtros"
                    >
                        Limpar
                    </button>
                    <button 
                        onClick={onBuscar}
                        className="flex-1 bg-[#1486B8] text-white py-2.5 rounded-lg font-medium hover:bg-[#0f6a94] transition-colors"
                        aria-label="Buscar espaços com os filtros selecionados"
                    >
                        Buscar
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default SidebarFiltros; 