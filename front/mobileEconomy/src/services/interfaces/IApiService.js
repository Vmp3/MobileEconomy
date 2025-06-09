/**
 * Interface para serviços de API
 * Define os métodos que qualquer implementação de API deve ter
 */
export class IApiService {
  async get(endpoint, options = {}) {
    throw new Error('Method get must be implemented');
  }

  async post(endpoint, data, options = {}) {
    throw new Error('Method post must be implemented');
  }

  async put(endpoint, data, options = {}) {
    throw new Error('Method put must be implemented');
  }

  async delete(endpoint, options = {}) {
    throw new Error('Method delete must be implemented');
  }

  async getStoredToken() {
    throw new Error('Method getStoredToken must be implemented');
  }

  async storeToken(token) {
    throw new Error('Method storeToken must be implemented');
  }

  async removeToken() {
    throw new Error('Method removeToken must be implemented');
  }
} 