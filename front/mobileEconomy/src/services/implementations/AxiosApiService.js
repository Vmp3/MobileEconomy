import { IApiService } from '../interfaces/IApiService';
import { API_BASE_URL, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '../../config/api';

// Simulação do Axios para funcionar sem instalação
const axios = {
  create: (config) => ({
    defaults: { ...config },
    interceptors: {
      request: { use: () => {} },
      response: { use: () => {} }
    },
    get: async (url, config) => {
      const response = await fetch(url, { 
        method: 'GET',
        headers: config?.headers || {}
      });
      
      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Servidor retornou HTML/texto em vez de JSON. Verifique se o backend está rodando em ${url}`);
      }
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      return { data, status: response.status };
    },
    post: async (url, data, config) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...config?.headers },
        body: JSON.stringify(data)
      });
      
      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Servidor retornou HTML/texto em vez de JSON. Verifique se o backend está rodando em ${url}`);
      }
      
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || `HTTP ${response.status}`);
      return { data: responseData, status: response.status };
    },
    put: async (url, data, config) => {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...config?.headers },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || `HTTP ${response.status}`);
      return { data: responseData, status: response.status };
    },
    delete: async (url, config) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: config?.headers || {}
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || `HTTP ${response.status}`);
      return { data: responseData, status: response.status };
    }
  })
};

/**
 * Implementação do serviço de API usando Axios
 * Segue exatamente os endpoints definidos no README.md
 */
export class AxiosApiService extends IApiService {
  constructor(baseURL = API_BASE_URL) {
    super();
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: REQUEST_TIMEOUT,
      headers: DEFAULT_HEADERS,
    });

    // Interceptor para adicionar token automaticamente
    this.client.interceptors.request.use(async (config) => {
      const token = await this.getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar respostas
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.removeToken(); // Remove token inválido
        }
        throw error;
      }
    );
  }

  async get(endpoint, options = {}) {
    try {
      const response = await this.client.get(endpoint, options);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erro na requisição GET');
    }
  }

  async post(endpoint, data, options = {}) {
    try {
      const response = await this.client.post(endpoint, data, options);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erro na requisição POST');
    }
  }

  async put(endpoint, data, options = {}) {
    try {
      const response = await this.client.put(endpoint, data, options);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erro na requisição PUT');
    }
  }

  async delete(endpoint, options = {}) {
    try {
      const response = await this.client.delete(endpoint, options);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erro na requisição DELETE');
    }
  }

  async getStoredToken() {
    try {
      // Simulação do AsyncStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('token');
      }
      return null;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  async storeToken(token) {
    try {
      // Simulação do AsyncStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  async removeToken() {
    try {
      // Simulação do AsyncStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
} 