// Serviços para buscar dados do IBGE - APIs oficiais do governo brasileiro
const IBGE_BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';
const VIACEP_BASE_URL = 'https://viacep.com.br/ws';

// Cache inteligente para evitar múltiplas requisições
let statesCache = null;
let citiesCache = {};

// Buscar todos os estados brasileiros via API oficial do IBGE
export const fetchStates = async () => {
  // Retorna cache se já carregado
  if (statesCache) {
    console.log('📦 Estados carregados do cache');
    return statesCache;
  }

  try {
    console.log('🌐 Buscando estados na API do IBGE...');
    const response = await fetch(`${IBGE_BASE_URL}/estados?orderBy=nome`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Erro ao buscar estados`);
    }
    
    const states = await response.json();
    console.log(`✅ ${states.length} estados recebidos da API IBGE`);
    
    // Mapear dados para formato padronizado
    statesCache = states.map(state => ({
      id: state.id,
      code: state.sigla,
      name: state.nome,
      region: state.regiao?.nome || 'N/A'
    }));
    
    return statesCache;
  } catch (error) {
    console.error('❌ Erro ao buscar estados do IBGE:', error);
    console.log('🔄 Usando dados de fallback...');
    // Fallback para dados estáticos em caso de erro
    return getFallbackStates();
  }
};

// Buscar cidades por estado via API oficial do IBGE
export const fetchCitiesByState = async (stateId) => {
  // Verificar cache primeiro
  if (citiesCache[stateId]) {
    console.log(`📦 Cidades do estado ${stateId} carregadas do cache`);
    return citiesCache[stateId];
  }

  try {
    console.log(`🏙️ Buscando cidades do estado ${stateId} na API IBGE...`);
    const response = await fetch(`${IBGE_BASE_URL}/estados/${stateId}/municipios?orderBy=nome`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Erro ao buscar cidades`);
    }
    
    const cities = await response.json();
    console.log(`✅ ${cities.length} cidades recebidas para estado ${stateId}`);
    
    // Mapear dados para formato padronizado
    const cityList = cities.map(city => ({
      id: city.id,
      name: city.nome,
      ibgeCode: city.id
    }));
    
    // Armazenar no cache para próximas consultas
    citiesCache[stateId] = cityList;
    
    return cityList;
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    // Fallback para dados estáticos em caso de erro
    return getFallbackCities(stateId);
  }
};

// Buscar endereço por CEP via API ViaCEP
export const fetchAddressByCEP = async (cep) => {
  try {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');
    console.log(`📮 Validando CEP: ${cleanCEP}`);
    
    if (cleanCEP.length !== 8) {
      throw new Error('CEP deve ter exatamente 8 dígitos');
    }

    console.log(`🔍 Buscando endereço para CEP: ${cleanCEP}`);
    const response = await fetch(`${VIACEP_BASE_URL}/${cleanCEP}/json/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Erro ao buscar CEP`);
    }
    
    const address = await response.json();
    
    if (address.erro) {
      throw new Error('CEP não encontrado na base de dados');
    }
    
    console.log('✅ Endereço encontrado:', address.localidade, '/', address.uf);
    
    return {
      cep: address.cep,
      street: address.logradouro || '',
      neighborhood: address.bairro || '',
      city: address.localidade || '',
      state: address.uf || '',
      ibgeCode: address.ibge || '',
      complement: address.complemento || ''
    };
  } catch (error) {
    console.error('❌ Erro ao buscar CEP:', error.message);
    throw error;
  }
};

// Função para formatar CPF
export const formatCPF = (value) => {
  let cpf = value.replace(/\D/g, '');
  cpf = cpf.substring(0, 11);
  
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return cpf.replace(/(\d{3})(\d+)/, '$1.$2');
  } else if (cpf.length <= 9) {
    return cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  } else {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
  }
};

// Função para formatar CEP
export const formatCEP = (value) => {
  let cep = value.replace(/\D/g, '');
  cep = cep.substring(0, 8);
  
  if (cep.length <= 5) {
    return cep;
  } else {
    return cep.replace(/(\d{5})(\d+)/, '$1-$2');
  }
};

// Função para formatar WhatsApp
export const formatWhatsApp = (value) => {
  let phone = value.replace(/\D/g, '');
  phone = phone.substring(0, 11);
  
  if (phone.length <= 2) {
    return phone;
  } else if (phone.length <= 7) {
    return phone.replace(/(\d{2})(\d+)/, '($1) $2');
  } else {
    return phone.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  }
};

// Validar CPF
export const validateCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto < 2 ? 0 : resto;
  
  if (digito1 !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto < 2 ? 0 : resto;
  
  return digito2 === parseInt(cpf.charAt(10));
};

// Função para limpar cache (útil para desenvolvimento e testes)
export const clearCache = () => {
  statesCache = null;
  citiesCache = {};
  console.log('🗑️ Cache limpo');
};

// Função para verificar status do cache
export const getCacheInfo = () => {
  return {
    statesLoaded: !!statesCache,
    citiesCacheSize: Object.keys(citiesCache).length,
    statesCount: statesCache?.length || 0
  };
};

// Dados de fallback em caso de falha na API - Estados brasileiros oficiais
const getFallbackStates = () => {
  console.log('🔄 Usando dados de fallback para estados');
  return [
    { id: 12, code: 'AC', name: 'Acre', region: 'Norte' },
    { id: 27, code: 'AL', name: 'Alagoas', region: 'Nordeste' },
    { id: 16, code: 'AP', name: 'Amapá', region: 'Norte' },
    { id: 13, code: 'AM', name: 'Amazonas', region: 'Norte' },
    { id: 29, code: 'BA', name: 'Bahia', region: 'Nordeste' },
    { id: 23, code: 'CE', name: 'Ceará', region: 'Nordeste' },
    { id: 53, code: 'DF', name: 'Distrito Federal', region: 'Centro-Oeste' },
    { id: 32, code: 'ES', name: 'Espírito Santo', region: 'Sudeste' },
    { id: 52, code: 'GO', name: 'Goiás', region: 'Centro-Oeste' },
    { id: 21, code: 'MA', name: 'Maranhão', region: 'Nordeste' },
    { id: 51, code: 'MT', name: 'Mato Grosso', region: 'Centro-Oeste' },
    { id: 50, code: 'MS', name: 'Mato Grosso do Sul', region: 'Centro-Oeste' },
    { id: 31, code: 'MG', name: 'Minas Gerais', region: 'Sudeste' },
    { id: 15, code: 'PA', name: 'Pará', region: 'Norte' },
    { id: 25, code: 'PB', name: 'Paraíba', region: 'Nordeste' },
    { id: 41, code: 'PR', name: 'Paraná', region: 'Sul' },
    { id: 26, code: 'PE', name: 'Pernambuco', region: 'Nordeste' },
    { id: 22, code: 'PI', name: 'Piauí', region: 'Nordeste' },
    { id: 33, code: 'RJ', name: 'Rio de Janeiro', region: 'Sudeste' },
    { id: 24, code: 'RN', name: 'Rio Grande do Norte', region: 'Nordeste' },
    { id: 43, code: 'RS', name: 'Rio Grande do Sul', region: 'Sul' },
    { id: 11, code: 'RO', name: 'Rondônia', region: 'Norte' },
    { id: 14, code: 'RR', name: 'Roraima', region: 'Norte' },
    { id: 42, code: 'SC', name: 'Santa Catarina', region: 'Sul' },
    { id: 35, code: 'SP', name: 'São Paulo', region: 'Sudeste' },
    { id: 28, code: 'SE', name: 'Sergipe', region: 'Nordeste' },
    { id: 17, code: 'TO', name: 'Tocantins', region: 'Norte' }
  ];
};

// Cidades principais como fallback
const getFallbackCities = (stateId) => {
  console.log(`🔄 Usando dados de fallback para cidades do estado ${stateId}`);
  const fallbackCities = {
    35: [ // São Paulo
      { id: 3550308, name: 'São Paulo', ibgeCode: 3550308 },
      { id: 3518800, name: 'Guarulhos', ibgeCode: 3518800 },
      { id: 3509502, name: 'Campinas', ibgeCode: 3509502 }
    ],
    33: [ // Rio de Janeiro
      { id: 3304557, name: 'Rio de Janeiro', ibgeCode: 3304557 },
      { id: 3303302, name: 'Niterói', ibgeCode: 3303302 },
      { id: 3301702, name: 'Duque de Caxias', ibgeCode: 3301702 }
    ],
    31: [ // Minas Gerais
      { id: 3106200, name: 'Belo Horizonte', ibgeCode: 3106200 },
      { id: 3170206, name: 'Uberlândia', ibgeCode: 3170206 },
      { id: 3113404, name: 'Contagem', ibgeCode: 3113404 }
    ]
  };
  
  return fallbackCities[stateId] || [
    { id: `${stateId}001`, name: 'Capital', ibgeCode: `${stateId}001` }
  ];
};