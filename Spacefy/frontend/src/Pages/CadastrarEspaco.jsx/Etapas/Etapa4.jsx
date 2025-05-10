import React from 'react';

const Etapa4 = ({ formData, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ [name]: type === 'checkbox' ? checked : value });
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
                                    id="permite_animais"
                                    name="permite_animais"
                                    checked={formData.permite_animais || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="permite_animais" className="font-medium text-gray-700">
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
                                    id="permite_fumar"
                                    name="permite_fumar"
                                    checked={formData.permite_fumar || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="permite_fumar" className="font-medium text-gray-700">
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
                                    id="permite_bebidas"
                                    name="permite_bebidas"
                                    checked={formData.permite_bebidas || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="permite_bebidas" className="font-medium text-gray-700">
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