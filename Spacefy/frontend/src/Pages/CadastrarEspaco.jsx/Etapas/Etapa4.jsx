import React from 'react';

const Etapa4 = ({ formData, onUpdate }) => {
    const handleChange = (e) => {
        const { name, checked } = e.target;
        const currentRules = formData.space_rules || [];
        
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
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Regras e Políticas
                </h3>
                <p className="text-gray-600 mb-6">
                    Defina as regras e políticas que se aplicam ao seu espaço.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Regras Básicas
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="animais"
                                    name="animais"
                                    checked={formData.space_rules?.includes('animais') || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="animais" className="font-medium text-gray-700">
                                    Permite Animais
                                </label>
                                <p className="text-gray-500">
                                    Seu espaço permite a entrada de animais de estimação?
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="fumar"
                                    name="fumar"
                                    checked={formData.space_rules?.includes('fumar') || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="fumar" className="font-medium text-gray-700">
                                    Permite Fumar
                                </label>
                                <p className="text-gray-500">
                                    Seu espaço permite o uso de tabaco?
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="bebidas_alcoolicas"
                                    name="bebidas_alcoolicas"
                                    checked={formData.space_rules?.includes('bebidas_alcoolicas') || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="bebidas_alcoolicas" className="font-medium text-gray-700">
                                    Permite Bebidas Alcoólicas
                                </label>
                                <p className="text-gray-500">
                                    Seu espaço permite o consumo de bebidas alcoólicas?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Etapa4; 