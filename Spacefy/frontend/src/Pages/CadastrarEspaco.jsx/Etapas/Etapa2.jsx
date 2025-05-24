import React from 'react';

// Componente reutilizável para campos de texto
const CampoTexto = ({ label, id, name, value, onChange, required = false, type = "text", min, placeholder, maxLength }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            name={name}
            id={id}
            value={value || ''}
            onChange={onChange}
            min={min}
            maxLength={maxLength}
            placeholder={placeholder}
            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
            required={required}
        />
    </div>
);

// Componente reutilizável para campos de seleção
const CampoSelect = ({ label, id, name, value, onChange, options, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <select
            name={name}
            id={id}
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full border-0 border-b-2 border-black focus:border-black focus:ring-0 focus:outline-none py-1"
            required={required}
        >
            <option value="">Selecione uma opção</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const Etapa1_2 = ({ formData, onUpdate }) => {
    // Função para atualizar os dados do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });
    };

    // Lista de estados brasileiros
    const estados = [
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espírito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' }
    ];

    return (
        <div className="space-y-8">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Endereço do Espaço
                </h3>
                <p className="text-sm text-gray-500">
                    Preencha os dados do endereço onde o espaço está localizado
                </p>
            </div>

            {/* Grid com os campos do formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                <div className="space-y-6">
                    <CampoTexto
                        label="CEP"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        placeholder="00000-000"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <CampoTexto
                            label="Rua"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            required
                        />
                        
                        <CampoTexto
                            label="Número"
                            id="number"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <CampoTexto
                            label="Bairro"
                            id="neighborhood"
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={handleChange}
                            required
                        />
                        
                        <CampoTexto
                            label="Cidade"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <CampoSelect
                        label="Estado"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        options={estados}
                        required
                    />
                </div>

                {/* Coluna da direita - Mapa ou instruções */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Instruções
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Preencha o CEP para autopreenchimento do endereço</li>
                        <li>Verifique se todos os dados estão corretos</li>
                        <li>O endereço será usado para localização no mapa</li>
                        <li>Certifique-se de que o endereço está completo e correto</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Etapa1_2; 