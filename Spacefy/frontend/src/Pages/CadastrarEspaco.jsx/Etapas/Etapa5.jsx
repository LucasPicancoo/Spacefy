import React from 'react';

const Etapa5 = ({ formData, onUpdate }) => {
    const handleChange = (e) => {
        const { name, checked } = e.target;
        const currentAmenities = formData.space_amenities || [];
        
        if (checked) {
            onUpdate({
                ...formData,
                space_amenities: [...currentAmenities, name]
            });
        } else {
            onUpdate({
                ...formData,
                space_amenities: currentAmenities.filter(amenity => amenity !== name)
            });
        }
    };

    const categorias = [
        {
            titulo: 'Acessibilidade',
            itens: [
                { id: 'estacionamento', label: 'Estacionamento' },
                { id: 'bicicletario', label: 'Bicicletário' },
                { id: 'ponto_transporte', label: 'Ponto de Transporte' },
                { id: 'acesso_pcd', label: 'Acesso para PCD' },
                { id: 'elevador', label: 'Elevador' },
                { id: 'rampa_acesso', label: 'Rampa de Acesso' },
                { id: 'banheiro_pcd', label: 'Banheiro Adaptado' },
            ],
        },
        {
            titulo: 'Segurança',
            itens: [
                { id: 'cameras', label: 'Cameras de segurança' },
                { id: 'alarme', label: 'Sistema de alarme' },
                { id: 'combate_incendio', label: 'Sistema de combate a incêndios' },
                { id: 'iluminacao_emergencia', label: 'Iluminação de emergência' },
                { id: 'guarita', label: 'Guarita de Segurança' },
                { id: 'controle_acesso', label: 'Controle de Acesso' },
                { id: 'monitoramento_24h', label: 'Monitoramento 24h' },
            ],
        },
        {
            titulo: 'Conforto e Infraestrutura',
            itens: [
                { id: 'ar_condicionado', label: 'Ar-condicionado' },
                { id: 'cadeiras', label: 'Cadeiras' },
                { id: 'mesas', label: 'Mesas' },
                { id: 'palco', label: 'Palco/Espaço Elevado' },
                { id: 'som', label: 'Sistema de som' },
                { id: 'microfones', label: 'Microfones' },
                { id: 'banheiros', label: 'Banheiros' },
                { id: 'vestiarios', label: 'Vestiários' },
                { id: 'chuveiros', label: 'Chuveiros' },
                { id: 'armarios', label: 'Armários' },
                { id: 'espelho', label: 'Espelhos' },
                { id: 'ventiladores', label: 'Ventiladores' },
                { id: 'aquecimento', label: 'Sistema de Aquecimento' },
                { id: 'acustica', label: 'Tratamento Acústico' },
                { id: 'iluminacao_cenica', label: 'Iluminação Cênica' },
            ],
        },
        {
            titulo: 'Alimentação e Conveniência',
            itens: [
                { id: 'cafeteira', label: 'Máquina de Café' },
                { id: 'bebedouro', label: 'Bebedouro' },
                { id: 'cozinha', label: 'Cozinha' },
                { id: 'loucas', label: 'Louças' },
                { id: 'talheres', label: 'Talheres' },
                { id: 'fogao', label: 'Fogão' },
                { id: 'forno', label: 'Forno' },
                { id: 'microondas', label: 'Micro-ondas' },
                { id: 'churrasqueira', label: 'Churrasqueira' },
                { id: 'geladeira', label: 'Geladeira' },
                { id: 'freezer', label: 'Freezer' },
                { id: 'pia', label: 'Pia' },
                { id: 'mesa_bar', label: 'Mesa de Bar' },
                { id: 'buffet', label: 'Área de Buffet' },
            ],
        },
        {
            titulo: 'Equipamentos e Tecnologia',
            itens: [
                { id: 'wifi', label: 'Wi-Fi' },
                { id: 'projetor', label: 'Projetor' },
                { id: 'tela_projecao', label: 'Tela de Projeção' },
                { id: 'som_tecnologia', label: 'Sistema de Som' },
                { id: 'microfones_tecnologia', label: 'Microfones' },
                { id: 'equipamentos_auxiliares', label: 'Equipamentos Auxiliares' },
                { id: 'computador', label: 'Computador' },
                { id: 'tv', label: 'TV' },
                { id: 'smart_tv', label: 'Smart TV' },
                { id: 'video_conferencia', label: 'Videoconferência' },
                { id: 'impressora', label: 'Impressora' },
                { id: 'scanner', label: 'Scanner' },
                { id: 'tomadas_220v', label: 'Tomadas 220V' },
                { id: 'gerador', label: 'Gerador' },
            ],
        },
        {
            titulo: 'Áreas Externas',
            itens: [
                { id: 'jardim', label: 'Jardim' },
                { id: 'area_verde', label: 'Área Verde' },
                { id: 'deck', label: 'Deck' },
                { id: 'piscina', label: 'Piscina' },
                { id: 'quadra', label: 'Quadra' },
                { id: 'playground', label: 'Playground' },
                { id: 'varanda', label: 'Varanda' },
                { id: 'terraco', label: 'Terraço' },
                { id: 'estacionamento_coberto', label: 'Estacionamento Coberto' },
                { id: 'churrasqueira', label: 'Churrasqueira' },
                { id: 'banheiro_pcd', label: 'Banheiro Adaptado' },
            ],
        },
    ];

    const categoriasCima = categorias.filter(cat => [
        'Acessibilidade',
        'Conforto e Infraestrutura',
        'Alimentação e Conveniência',
        'Equipamentos e Tecnologia',
    ].includes(cat.titulo));

    const categoriasBaixo = categorias.filter(cat => [
        'Segurança',
        'Áreas Externas',
    ].includes(cat.titulo));

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Infraestrutura e Serviços</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Itens Disponíveis no Espaço</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {categoriasCima.map((cat) => (
                    <div key={cat.titulo}>
                        <h4 className="font-semibold text-gray-800 mb-2 text-base">{cat.titulo}</h4>
                        <ul className="space-y-2">
                            {cat.itens.map((item) => (
                                <li key={item.id} className="flex flex-col items-start">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name={item.id}
                                            checked={formData.space_amenities?.includes(item.id) || false}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2 cursor-pointer"
                                        />
                                        <span className="text-gray-800 text-sm">{item.label}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoriasBaixo.map((cat) => (
                        <div key={cat.titulo}>
                            <h4 className="font-semibold text-gray-800 mb-2 text-base">{cat.titulo}</h4>
                            <ul className="space-y-2">
                                {cat.itens.map((item) => (
                                    <li key={item.id} className="flex flex-col items-start">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name={item.id}
                                                checked={formData.space_amenities?.includes(item.id) || false}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2 cursor-pointer"
                                            />
                                            <span className="text-gray-800 text-sm">{item.label}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Etapa5; 