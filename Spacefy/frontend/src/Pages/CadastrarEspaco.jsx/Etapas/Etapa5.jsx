import React from 'react';

const categorias = [
  {
    titulo: 'Acessibilidade',
    itens: [
      { id: 'estacionamento', label: 'Estacionamento' },
      { id: 'bicicletario', label: 'Bicicletário' },
      { id: 'ponto_transporte', label: 'Ponto de Transporte' },
      { id: 'acesso_pcd', label: 'Acesso para PCD', obs: '(Rampas, piso tátil, sinalização visual e tátil em portas ou banheiros...)' },
    ],
  },
  {
    titulo: 'Segurança',
    itens: [
      { id: 'cameras', label: 'Cameras de segurança' },
      { id: 'alarme', label: 'Sistema de alarme' },
      { id: 'combate_incendio', label: 'Sistema de combate a incêndios', obs: '(Extintores, saídas de emergência, sprinklers)' },
      { id: 'iluminacao_emergencia', label: 'Iluminação de emergência' },
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
    ],
  },
  {
    titulo: 'Equipamentos e Tecnologia',
    itens: [
      { id: 'wifi', label: 'Wi-Fi' },
      { id: 'projetor', label: 'Projetor' },
      { id: 'tela_projecao', label: 'Tela de Projeção' },
      { id: 'som_tecnologia', label: 'Sistema de som' },
      { id: 'microfones_tecnologia', label: 'Microfones' },
      { id: 'equipamentos_auxiliares', label: 'Equipamentos auxiliares', obs: '(Mesa de som, amplificador...)' },
    ],
  },
];

const categoriasCima = categorias.filter(cat => [
  'Acessibilidade',
  'Conforto e Infraestrutura',
  'Alimentação e Conveniência',
  'Equipamentos e Tecnologia',
].includes(cat.titulo));

const categoriaSeguranca = categorias.find(cat => cat.titulo === 'Segurança');

const Etapa5 = ({ formData, onUpdate }) => {
  const handleChange = (e) => {
    const { name, checked } = e.target;
    onUpdate({
      equipamentosEServicos: {
        ...formData.equipamentosEServicos,
        [name]: checked,
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
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
                      checked={formData.equipamentosEServicos?.[item.id] || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                    />
                    <span className="text-gray-800 text-sm">{item.label}</span>
                  </label>
                  {item.obs && (
                    <span className="text-xs text-gray-400 ml-6 leading-tight">{item.obs}</span>
                  )}
                  {item.id === 'estacionamento' && formData.equipamentosEServicos?.estacionamento && (
                    <div className="ml-6 mt-1 w-full">
                      <label htmlFor="vagas_estacionamento" className="block text-xs text-gray-600 mb-1">Vagas disponíveis</label>
                      <input
                        type="number"
                        id="vagas_estacionamento"
                        name="vagas_estacionamento"
                        min="0"
                        value={formData.equipamentosEServicos?.vagas_estacionamento || ''}
                        onChange={e => onUpdate({
                          equipamentosEServicos: {
                            ...formData.equipamentosEServicos,
                            vagas_estacionamento: e.target.value,
                          },
                        })}
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2 text-base">{categoriaSeguranca.titulo}</h4>
        <ul className="space-y-2">
          {categoriaSeguranca.itens.map((item) => (
            <li key={item.id} className="flex flex-col items-start">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name={item.id}
                  checked={formData.equipamentosEServicos?.[item.id] || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                />
                <span className="text-gray-800 text-sm">{item.label}</span>
              </label>
              {item.obs && (
                <span className="text-xs text-gray-400 ml-6 leading-tight">{item.obs}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Etapa5; 