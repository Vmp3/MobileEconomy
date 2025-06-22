import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { BASE_URL } from '../config/api';

// Verificar se a API está configurada corretamente
console.log('API configurada:', BASE_URL);
console.log('API post method:', typeof axios.post);

// Serviço de autenticação
export const authService = {
  // Registrar novo usuário
  async signup(userData) {
    try {
      console.log('Dados enviados para signup:', userData);
      
      const { nome, email, dataNascimento, senha, confirmacaoSenha } = userData;
      
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        nome,
        email,
        dataNascimento,
        senha,
        confirmacaoSenha
      });

      console.log('Resposta do servidor:', response.data);

      // Salvar token e dados do usuário no AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        // Só salvar user se ele existir na resposta
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro no signup:', error);
      
      let errorMessage = 'Erro interno do servidor';
      
      if (error.response) {
        // Servidor retornou erro
        console.log('Erro de resposta:', error.response.data);
        if (error.response.status === 409) {
          errorMessage = 'Email já está em uso';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.error || 'Dados inválidos';
        }
      } else if (error.request) {
        // Erro de rede
        console.log('Erro de rede:', error.request);
        errorMessage = 'Erro de conexão. Verifique sua internet e se o backend está rodando na porta 8080.';
      } else {
        // Outro tipo de erro
        console.log('Erro geral:', error.message);
        errorMessage = error.message || 'Erro inesperado';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Fazer login
  async signin(credentials) {
    try {
      console.log('Dados enviados para signin:', credentials);
      
      const { email, senha } = credentials;
      
      const response = await axios.post(`${BASE_URL}/auth/signin`, {
        email,
        senha
      });

      console.log('Resposta do servidor:', response.data);

      // Salvar token
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        
        // Se os dados do usuário não vieram na resposta, buscar o perfil
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          console.log('Dados do usuário não encontrados na resposta, buscando perfil...');
          try {
            const profileResult = await this.getUserProfile();
            if (profileResult.success && profileResult.data) {
              await AsyncStorage.setItem('user', JSON.stringify(profileResult.data));
              // Adicionar dados do usuário à resposta
              response.data.user = profileResult.data;
            }
          } catch (profileError) {
            console.warn('Não foi possível buscar perfil do usuário:', profileError);
          }
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro no signin:', error);
      
      let errorMessage = 'Erro interno do servidor';
      
      if (error.response) {
        // Servidor retornou erro
        console.log('Erro de resposta:', error.response.data);
        if (error.response.status === 401) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.error || 'Dados inválidos';
        }
      } else if (error.request) {
        // Erro de rede
        console.log('Erro de rede:', error.request);
        errorMessage = 'Erro de conexão. Verifique sua internet e se o backend está rodando na porta 8080.';
      } else {
        // Outro tipo de erro
        console.log('Erro geral:', error.message);
        errorMessage = error.message || 'Erro inesperado';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Fazer logout
  async logout() {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { success: false, error: 'Erro ao fazer logout' };
    }
  },

  // Verificar se usuário está logado
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  },

  // Obter dados do usuário armazenados
  async getUser() {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  },

  // Obter token armazenado
  async getToken() {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  },

  // Buscar perfil do usuário
  async getUserProfile() {
    try {
      const response = await api.get('/auth/profile');

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      
      let errorMessage = 'Erro interno do servidor';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Token inválido ou expirado';
        } else if (error.response.status === 404) {
          errorMessage = 'Usuário não encontrado';
        }
      } else if (error.request) {
        errorMessage = 'Erro de conexão';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }
}; 