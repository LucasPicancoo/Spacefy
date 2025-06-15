import React from 'react';

// Array com as regras disponíveis para o espaço
const REGRAS = [
    {
        id: 'animais',
        label: 'Permite Animais',
        descricao: 'Seu espaço permite a entrada de animais de estimação?'
    },
    {
        id: 'fumar',
        label: 'Permite Fumar',
        descricao: 'Seu espaço permite o uso de tabaco?'
    },
    {
        id: 'bebidas_alcoolicas',
        label: 'Permite Bebidas Alcoólicas',
        descricao: 'Seu espaço permite o consumo de bebidas alcoólicas?'
    }
];

// Componente para checkbox de regra
const CheckboxRegra = ({ regra, checked, onChange }) => (
    <div className="flex items-start" role="group" aria-labelledby={`${regra.id}-label`}>
        <div className="flex items-center h-5">
            <input
                type="checkbox"
                id={regra.id}
                name={regra.id}
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                aria-label={regra.label}
                aria-describedby={`${regra.id}-description`}
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={regra.id} id={`${regra.id}-label`} className="font-medium text-gray-700">
                {regra.label}
            </label>
            <p id={`${regra.id}-description`} className="text-gray-500">
                {regra.descricao}
            </p>
        </div>
    </div>
);

// Componente principal da Etapa 5 - Regras e Políticas
const Etapa5 = ({ formData, onUpdate }) => {
    // Função para gerenciar mudanças nas regras
    const handleChange = (e) => {
        const { name, checked } = e.target;
        const currentRules = formData.space_rules || [];
        
        // Adiciona ou remove regras da lista
        if (checked) {
            onUpdate({
                ...formData,
                space_rules: [...currentRules, name]
            });
        } else {
            onUpdate({
                ...formData,
                space_rules: currentRules.filter(rule => rule !== name)
            });
        }
    };

    return (
        <div className="space-y-8" role="form" aria-label="Etapa 5: Regras e Políticas">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4" id="regras-titulo">
                    Regras e Políticas
                </h3>
                <p className="text-gray-600 mb-6" role="doc-subtitle">
                    Defina as regras e políticas que se aplicam ao seu espaço.
                </p>
            </div>

            <div className="space-y-6">
                {/* Seção de regras básicas */}
                <div role="region" aria-labelledby="regras-titulo">
                    <h4 className="text-lg font-medium text-gray-900 mb-4" id="regras-basicas-titulo">
                        Regras Básicas
                    </h4>
                    <div className="space-y-4" role="group" aria-labelledby="regras-basicas-titulo">
                        {REGRAS.map((regra) => (
                            <CheckboxRegra
                                key={regra.id}
                                regra={regra}
                                checked={formData.space_rules?.includes(regra.id) || false}
                                onChange={handleChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Etapa5; 