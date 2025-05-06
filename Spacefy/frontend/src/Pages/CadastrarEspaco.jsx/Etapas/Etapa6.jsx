import React from 'react';

const Etapa6 = ({ formData, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ [name]: type === 'checkbox' ? checked : value });
    };

    const metodosPagamento = [
        { id: 'pix', label: 'PIX' },
        { id: 'cartao_credito', label: 'Cartão de Crédito' },
        { id: 'cartao_debito', label: 'Cartão de Débito' },
        { id: 'dinheiro', label: 'Dinheiro' },
        { id: 'transferencia', label: 'Transferência Bancária' }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Métodos de Pagamento
                </h3>
                <p className="text-gray-600 mb-6">
                    Configure os métodos de pagamento aceitos no seu espaço.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Métodos de Pagamento Aceitos
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {metodosPagamento.map((metodo) => (
                            <div key={metodo.id} className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id={metodo.id}
                                        name={`metodos_pagamento.${metodo.id}`}
                                        checked={formData.metodos_pagamento?.[metodo.id] || false}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor={metodo.id}
                                        className="font-medium text-gray-700"
                                    >
                                        {metodo.label}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Configurações de Pagamento
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="taxa_servico" className="block text-sm font-medium text-gray-700">
                                Taxa de Serviço (%)
                            </label>
                            <input
                                type="number"
                                id="taxa_servico"
                                name="taxa_servico"
                                value={formData.taxa_servico || ''}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="0.01"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="desconto_antecipado" className="block text-sm font-medium text-gray-700">
                                Desconto para Pagamento Antecipado (%)
                            </label>
                            <input
                                type="number"
                                id="desconto_antecipado"
                                name="desconto_antecipado"
                                value={formData.desconto_antecipado || ''}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="0.01"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="dias_antecipacao" className="block text-sm font-medium text-gray-700">
                                Dias de Antecedência para Desconto
                            </label>
                            <input
                                type="number"
                                id="dias_antecipacao"
                                name="dias_antecipacao"
                                value={formData.dias_antecipacao || ''}
                                onChange={handleChange}
                                min="1"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Informações Bancárias
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="banco" className="block text-sm font-medium text-gray-700">
                                Banco
                            </label>
                            <input
                                type="text"
                                id="banco"
                                name="banco"
                                value={formData.banco || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="agencia" className="block text-sm font-medium text-gray-700">
                                Agência
                            </label>
                            <input
                                type="text"
                                id="agencia"
                                name="agencia"
                                value={formData.agencia || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="conta" className="block text-sm font-medium text-gray-700">
                                Conta
                            </label>
                            <input
                                type="text"
                                id="conta"
                                name="conta"
                                value={formData.conta || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Etapa6; 