import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getApiBaseUrl } from '../utils/apiUtils';

// URL base padrão da API (será substituída pela URL dinâmica)
let BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:8080/api' 
  : Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080/api' 
    : 'http://localhost:8080/api';

// Criar instância do axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para atualizar a URL base da API
export const updateApiBaseUrl = async () => {
  try {
    const url = await getApiBaseUrl();
    api.defaults.baseURL = url;
    BASE_URL = url;
    console.log(`API configurada para: ${url} (${Platform.OS})`);
    return url;
  } catch (error) {
    console.error('Erro ao atualizar URL base da API:', error);
    return BASE_URL;
  }
};

// Inicializar a URL base da API
updateApiBaseUrl();

// Exportar a URL base atual (pode mudar durante a execução do app)
export { BASE_URL };

// Verificar se o token está armazenado no AsyncStorage
export const hasStoredToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Erro ao verificar token armazenado:', error);
    return false;
  }
};

// Configurar interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros comuns
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Se o token for inválido (401), fazer logout automático
    // Mas apenas se não for um erro de rede
    if (error.response?.status === 401 && error.config?.url !== '/auth/profile') {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        console.log('Token inválido - usuário deslogado automaticamente');
        
        // Recarregar a aplicação para voltar ao login
        // Em React Native, você pode usar um evento global ou Context para notificar
        if (global.onUnauthorized) {
          global.onUnauthorized();
        }
      } catch (storageError) {
        console.error('Erro ao limpar storage:', storageError);
      }
    }
    
    // Para erros de rede, não deslogar o usuário
    if (!error.response && error.request) {
      console.log('Erro de rede detectado, mantendo sessão');
      // Não fazer nada para manter o usuário logado
    }
    
    return Promise.reject(error);
  }
);

// Função para verificar se o token é válido
export const validateToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return false;
    
    // Tenta fazer uma requisição para verificar se o token é válido
    const response = await api.get('/auth/profile');
    return response.status === 200;
  } catch (error) {
    // Se for erro de rede, consideramos o token como válido
    if (!error.response && error.request) {
      console.log('Erro de rede ao validar token, considerando como válido');
      return true;
    }
    
    // Se for erro de autorização, token é inválido
    if (error.response?.status === 401) {
      return false;
    }
    
    // Para outros erros, consideramos o token como válido
    console.error('Erro ao validar token:', error);
    return true;
  }
};

export default api; 