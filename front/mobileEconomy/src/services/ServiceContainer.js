import { AxiosApiService } from './implementations/AxiosApiService';
import { AuthService } from './implementations/AuthService';
import { API_BASE_URL } from '../config/api';

/**
 * Container de Injeção de Dependência
 * Gerencia a criação e injeção de dependências dos serviços
 */
class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
    this.setupServices();
  }

  /**
   * Configurar os serviços e suas dependências
   */
  setupServices() {
    // Registrar ApiService como singleton
    this.registerSingleton('apiService', () => {
      return new AxiosApiService(API_BASE_URL);
    });

    // Registrar AuthService com dependência do ApiService
    this.registerSingleton('authService', () => {
      const apiService = this.get('apiService');
      return new AuthService(apiService);
    });
  }

  /**
   * Registrar um serviço como singleton
   * @param {string} name - Nome do serviço
   * @param {Function} factory - Função que cria o serviço
   */
  registerSingleton(name, factory) {
    this.services.set(name, { factory, isSingleton: true });
  }

  /**
   * Registrar um serviço transiente (nova instância a cada chamada)
   * @param {string} name - Nome do serviço
   * @param {Function} factory - Função que cria o serviço
   */
  registerTransient(name, factory) {
    this.services.set(name, { factory, isSingleton: false });
  }

  /**
   * Obter uma instância do serviço
   * @param {string} name - Nome do serviço
   * @returns {*} Instância do serviço
   */
  get(name) {
    const serviceConfig = this.services.get(name);
    
    if (!serviceConfig) {
      throw new Error(`Service '${name}' not found. Available services: ${Array.from(this.services.keys()).join(', ')}`);
    }

    if (serviceConfig.isSingleton) {
      // Retornar singleton existente ou criar novo
      if (!this.singletons.has(name)) {
        this.singletons.set(name, serviceConfig.factory());
      }
      return this.singletons.get(name);
    } else {
      // Criar nova instância a cada chamada
      return serviceConfig.factory();
    }
  }

  /**
   * Verificar se um serviço está registrado
   * @param {string} name - Nome do serviço
   * @returns {boolean}
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Limpar todos os singletons (útil para testes)
   */
  clearSingletons() {
    this.singletons.clear();
  }

  /**
   * Listar todos os serviços registrados
   * @returns {string[]}
   */
  getRegisteredServices() {
    return Array.from(this.services.keys());
  }
}

// Exportar instância singleton do container
export const serviceContainer = new ServiceContainer();

// Exportar classe para testes
export { ServiceContainer }; 