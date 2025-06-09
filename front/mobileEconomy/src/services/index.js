import { serviceContainer } from './ServiceContainer';

/**
 * Facade para facilitar o acesso aos serviços
 * Usa injeção de dependência reversa através do ServiceContainer
 */

// Serviços disponíveis
export const getAuthService = () => serviceContainer.get('authService');
export const getApiService = () => serviceContainer.get('apiService');

// Re-exportar o container para casos avançados
export { serviceContainer };

// Re-exportar interfaces para tipagem (se usando TypeScript)
export { IApiService } from './interfaces/IApiService';
export { IAuthService } from './interfaces/IAuthService';

// Re-exportar implementações para testes
export { AxiosApiService } from './implementations/AxiosApiService';
export { AuthService } from './implementations/AuthService'; 