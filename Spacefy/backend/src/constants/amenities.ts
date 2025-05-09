export const AMENITIES = {
  ACESSIBILIDADE: [
    'estacionamento',
    'bicicletario',
    'ponto_transporte',
    'acesso_pcd',
    'elevador',
    'rampa_acesso',
    'banheiro_pcd'
  ],
  SEGURANCA: [
    'cameras',
    'alarme',
    'combate_incendio',
    'iluminacao_emergencia',
    'guarita',
    'controle_acesso',
    'monitoramento_24h'
  ],
  CONFORTO_INFRAESTRUTURA: [
    'ar_condicionado',
    'cadeiras',
    'mesas',
    'palco',
    'som',
    'microfones',
    'banheiros',
    'vestiarios',
    'chuveiros',
    'armarios',
    'espelho',
    'ventiladores',
    'aquecimento',
    'acustica',
    'iluminacao_cenica'
  ],
  ALIMENTACAO_CONVENIENCIA: [
    'cafeteira',
    'bebedouro',
    'cozinha',
    'loucas',
    'talheres',
    'fogao',
    'forno',
    'microondas',
    'churrasqueira',
    'geladeira',
    'freezer',
    'pia',
    'mesa_bar',
    'buffet'
  ],
  EQUIPAMENTOS_TECNOLOGIA: [
    'wifi',
    'projetor',
    'tela_projecao',
    'som_tecnologia',
    'microfones_tecnologia',
    'equipamentos_auxiliares',
    'computador',
    'tv',
    'smart_tv',
    'video_conferencia',
    'impressora',
    'scanner',
    'tomadas_220v',
    'gerador'
  ],
  AREAS_EXTERNAS: [
    'jardim',
    'area_verde',
    'deck',
    'piscina',
    'quadra',
    'playground',
    'varanda',
    'terraco',
    'estacionamento_coberto',
    'churrasqueira',
    'banheiro_pcd'
  ]
};

// Lista plana de todas as comodidades permitidas
export const ALLOWED_AMENITIES = Object.values(AMENITIES).flat(); 