import React from 'react';

const Etapa6 = ({ formData, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Dados do Proprietário
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div>
                        <label htmlFor="owner_name" className="block text-base font-medium text-gray-700">
                            Nome do Proprietário
                        </label>
                        <input
                            type="text"
                            id="owner_name"
                            name="owner_name"
                            value={formData.owner_name || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="document_number" className="block text-base font-medium text-gray-700">
                            CPF / CNPJ
                        </label>
                        <input
                            type="text"
                            id="document_number"
                            name="document_number"
                            value={formData.document_number || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                        />
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <label htmlFor="owner_phone" className="block text-base font-medium text-gray-700">
                            Telefone
                        </label>
                        <input
                            type="text"
                            id="owner_phone"
                            name="owner_phone"
                            value={formData.owner_phone || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="owner_email" className="block text-base font-medium text-gray-700">
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="owner_email"
                            name="owner_email"
                            value={formData.owner_email || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                        />
                    </div>
                </div>
            </div>

            {/* Campos de texto para documentos */}
            <div className="grid grid-cols-1 gap-6 mt-8">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Documento do Proprietário</h4>
                    <input
                        type="text"
                        id="documento"
                        name="documento"
                        value={formData.documento || ''}
                        onChange={handleChange}
                        placeholder="URL do documento"
                        className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Documento do Espaço</h4>
                    <input
                        type="text"
                        id="documentoEspaco"
                        name="documentoEspaco"
                        value={formData.documentoEspaco || ''}
                        onChange={handleChange}
                        placeholder="URL do documento do espaço"
                        className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default Etapa6; 