import React from 'react';

const Etapa1 = ({ formData, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Informações do Espaço
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="space_name" className="block text-sm font-medium text-gray-700">
                            Nome do espaço
                        </label>
                        <input
                            type="text"
                            name="space_name"
                            id="space_name"
                            value={formData.space_name || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="space_type" className="block text-sm font-medium text-gray-700">
                            Tipo do espaço <span className="text-xs text-gray-400">(Espaço para Eventos, Sala de Reuniões, Auditório, etc...)</span>
                        </label>
                        <input
                            type="text"
                            name="space_type"
                            id="space_type"
                            value={formData.space_type || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="max_people" className="block text-sm font-medium text-gray-700">
                            Capacidade máxima de pessoas
                        </label>
                        <input
                            type="number"
                            name="max_people"
                            id="max_people"
                            value={formData.max_people || ''}
                            onChange={handleChange}
                            min="1"
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Localização <span className="text-xs text-gray-400">(URL no MAPS)</span>
                        </label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col h-full ml-8">
                    <label htmlFor="space_description" className="block text-sm font-medium text-gray-700">
                        Descrição do espaço <span className="text-xs text-gray-400">(Max 250 caracteres)</span>
                    </label>
                    <textarea
                        name="space_description"
                        id="space_description"
                        rows={10}
                        value={formData.space_description || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        maxLength={250}
                        placeholder="Descreva brevemente o espaço, características, diferenciais, etc."
                    />
                    <p className="mt-1 text-sm text-gray-500 text-right">
                        {formData.space_description?.length || 0}/250 caracteres
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Etapa1; 