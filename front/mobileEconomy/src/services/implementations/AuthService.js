import { IAuthService } from '../interfaces/IAuthService';
import { AUTH_ENDPOINTS } from '../../config/api';

/**
 * Implementação do serviço de autenticação
 * Segue exatamente os endpoints definidos no README.md
 */
export class AuthService extends IAuthService {
  constructor(apiService) {
    super();
    this.apiService = apiService;
  }

  /**
   * Fazer login
   * POST /api/auth/signin
   * Request: { email: string, senha: string }
   * Response: { token: string, user: object }
   */
  async login(email, senha) {
    try {
      const response = await this.apiService.post(AUTH_ENDPOINTS.SIGNIN, {
        email,
        senha,
      });

      // Armazenar token se recebido
      if (response.token) {
        await this.apiService.storeToken(response.token);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Criar conta
   * POST /api/auth/signup
   * Request: { nome, email, dataNascimento, senha, confirmacaoSenha }
   * Response: { message: string }
   */
  async signup(userData) {
    try {
      const response = await this.apiService.post(AUTH_ENDPOINTS.SIGNUP, {
        nome: userData.nome,
        email: userData.email,
        dataNascimento: userData.dataNascimento,
        senha: userData.senha,
        confirmacaoSenha: userData.confirmacaoSenha,
      });

      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Fazer logout (remove token local)
   */
  async logout() {
    try {
      await this.apiService.removeToken();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Verificar se está autenticado
   */
  async isAuthenticated() {
    try {
      const token = await this.apiService.getStoredToken();
      return !!token;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }

  /**
   * Obter token armazenado
   */
  async getStoredToken() {
    return await this.apiService.getStoredToken();
  }
} 