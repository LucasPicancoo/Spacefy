import React, { useEffect, useRef, useState } from 'react';
import { googleMapsService } from '../../../services/googleMapsService';

// Componente reutilizável para campos de texto
const CampoTexto = ({ label, id, name, value, onChange, required = false, type = "text", min, placeholder, maxLength, inputRef, onBlur, onFocus }) => (
    <div role="group" aria-labelledby={`${id}-label`}>
        <label id={`${id}-label`} htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            name={name}
            id={id}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            min={min}
            maxLength={maxLength}
            placeholder={placeholder}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 focus:outline-none py-2 px-3"
            required={required}
            ref={inputRef}
            aria-required={required}
            aria-label={typeof label === 'string' ? label : undefined}
        />
    </div>
);

// Componente reutilizável para campos de seleção
const CampoSelect = ({ label, id, name, value, onChange, options, required = false }) => (
    <div role="group" aria-labelledby={`${id}-label`}>
        <label id={`${id}-label`} htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <select
            name={name}
            id={id}
            value={value || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-400 focus:ring-0 focus:outline-none py-2 px-3"
            required={required}
            aria-required={required}
            aria-label={typeof label === 'string' ? label : undefined}
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
    const streetInputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [streetValue, setStreetValue] = useState(formData.street || '');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isPlaceSelected, setIsPlaceSelected] = useState(false);
    const [isApiInitialized, setIsApiInitialized] = useState(false);

    const initializeAutocomplete = async () => {
        try {
            await googleMapsService.loadGoogleMaps();
            
            if (streetInputRef.current) {
                autocompleteRef.current = googleMapsService.createAutocomplete(streetInputRef.current, {
                    fields: ['address_components', 'formatted_address'],
                });

                autocompleteRef.current.addListener('place_changed', () => {
                    const place = autocompleteRef.current.getPlace();
                    if (place && place.address_components) {
                        setSelectedPlace(place);
                        setIsPlaceSelected(true);
                        handlePlaceSelect(place);
                    }
                });
            }
            setIsApiInitialized(true);
        } catch (error) {
            console.error('Erro ao inicializar o Autocomplete:', error);
        }
    };

    const handleInputFocus = async () => {
        if (!isApiInitialized) {
            await initializeAutocomplete();
        }
    };

    const handlePlaceSelect = (place = selectedPlace) => {
        if (!place) return;

        const addressComponents = place.address_components;
        const newData = {};

        // Função auxiliar para encontrar o componente do endereço
        const getAddressComponent = (types) => {
            const component = addressComponents.find(component => 
                types.some(type => component.types.includes(type))
            );
            return component ? component.long_name : '';
        };

        // Função auxiliar para encontrar o componente do estado (usando short_name)
        const getStateComponent = () => {
            const component = addressComponents.find(component => 
                component.types.includes('administrative_area_level_1')
            );
            return component ? component.short_name : '';
        };

        // Preenche cada campo com seu respectivo componente
        const street = getAddressComponent(['route']);
        const number = getAddressComponent(['street_number']);
        const neighborhood = getAddressComponent(['sublocality_level_1', 'sublocality']);
        const city = getAddressComponent(['administrative_area_level_2']);
        const state = getStateComponent();
        const zipCode = getAddressComponent(['postal_code']);

        // Obtém as coordenadas do lugar selecionado
        const coordinates = place.geometry?.location ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        } : null;

        // Atualiza o estado local e o formulário
        setStreetValue(street);
        onUpdate({
            street,
            number,
            neighborhood,
            city,
            state,
            zipCode,
            coordinates
        });
    };

    const handleBlur = () => {
        if (isPlaceSelected) {
            setIsPlaceSelected(false);
            setSelectedPlace(null);
        }
    };

    // Função para atualizar os dados do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'street') {
            setStreetValue(value);
        }
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
        <div className="space-y-8" role="form" aria-label="Etapa 2: Endereço do Espaço">
            {/* Cabeçalho da etapa */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4" id="etapa2-titulo">
                    Endereço do Espaço
                </h3>
                <p className="text-sm text-gray-500" role="doc-subtitle">
                    Preencha os dados do endereço onde o espaço está localizado
                </p>
            </div>

            {/* Grid com os campos do formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12" role="group" aria-labelledby="etapa2-titulo">
                <div className="space-y-6" role="group" aria-label="Campos de endereço">
                    <CampoTexto
                        label="Rua"
                        id="street"
                        name="street"
                        value={streetValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                        required
                        placeholder="Digite o nome da rua"
                        inputRef={streetInputRef}
                    />

                    <div className="grid grid-cols-2 gap-4" role="group" aria-label="Número e CEP">
                        <CampoTexto
                            label="Número"
                            id="number"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            required
                        />
                        
                        <CampoTexto
                            label="CEP"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                            placeholder="00000-000"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4" role="group" aria-label="Bairro e Cidade">
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
                <div className="bg-gray-50 p-6 rounded-lg" role="complementary" aria-label="Instruções de preenchimento">
                    <h4 className="text-lg font-medium text-gray-900 mb-4" id="instrucoes-titulo">
                        Instruções
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600" role="list" aria-labelledby="instrucoes-titulo">
                        <li role="listitem">Digite o nome da rua para autopreenchimento do endereço</li>
                        <li role="listitem">Verifique se todos os dados estão corretos</li>
                        <li role="listitem">O endereço será usado para localização no mapa</li>
                        <li role="listitem">Certifique-se de que o endereço está completo e correto</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Etapa1_2; 