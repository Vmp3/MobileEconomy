/**
 * Interface para serviços de autenticação
 * Define os métodos baseados nos endpoints do README.md
 */
export class IAuthService {
  /**
   * Fazer login
   * POST /api/auth/signin
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, senha) {
    throw new Error('Method login must be implemented');
  }

  /**
   * Criar conta
   * POST /api/auth/signup
   * @param {object} userData - {nome, email, dataNascimento, senha, confirmacaoSenha}
   * @returns {Promise<{message: string}>}
   */
  async signup(userData) {
    throw new Error('Method signup must be implemented');
  }

  /**
   * Fazer logout (remove token local)
   * @returns {Promise<void>}
   */
  async logout() {
    throw new Error('Method logout must be implemented');
  }

  /**
   * Verificar se está autenticado
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    throw new Error('Method isAuthenticated must be implemented');
  }

  /**
   * Obter token armazenado
   * @returns {Promise<string|null>}
   */
  async getStoredToken() {
    throw new Error('Method getStoredToken must be implemented');
  }
} 