import axios from 'axios';

interface AddressValidationResult {
  isValid: boolean;
  formattedAddress?: string;
  placeId?: string;
  error?: string;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleMapsResponse {
  status: string;
  results: Array<{
    formatted_address: string;
    place_id: string;
    address_components: AddressComponent[];
  }>;
}

export class GoogleMapsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY não configurada nas variáveis de ambiente');
    }
    this.apiKey = apiKey;
  }

  async validateAddress(address: string | { street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; zipCode: string }): Promise<AddressValidationResult> {
    try {
      // Formata o endereço se for um objeto
      let formattedAddress: string;
      if (typeof address === 'object') {
        formattedAddress = `${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ''}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.zipCode}`;
      } else {
        formattedAddress = address;
      }

      // Faz a requisição para a API do Google Maps
      const response = await axios.get<GoogleMapsResponse>(this.baseUrl, {
        params: {
          address: formattedAddress,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        
        // Tenta encontrar o bairro nos componentes do endereço
        const neighborhood = result.address_components.find(
          (component: AddressComponent) => component.types.includes('sublocality_level_1') || 
                      component.types.includes('sublocality')
        );

        // Se não encontrou o bairro nos componentes, usa o bairro fornecido no input
        const finalFormattedAddress = neighborhood 
          ? result.formatted_address
          : typeof address === 'object' 
            ? `${result.formatted_address.split(',')[0]}, ${address.neighborhood}, ${result.formatted_address.split(',').slice(1).join(',').trim()}`
            : result.formatted_address;

        return {
          isValid: true,
          formattedAddress: finalFormattedAddress,
          placeId: result.place_id
        };
      }

      return {
        isValid: false,
        error: 'Endereço não encontrado'
      };
    } catch (error) {
      console.error('Erro ao validar endereço:', error);
      return {
        isValid: false,
        error: 'Erro ao validar endereço'
      };
    }
  }
} 