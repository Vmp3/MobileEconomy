import { useState, useEffect } from 'react';
import { serviceContainer } from '../services/ServiceContainer';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Injeção de dependência - obter serviço do container
  const authService = serviceContainer.get('authService');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        // Em uma implementação real, você buscaria os dados do usuário do token
        // Por enquanto, vou simular dados básicos
        setUser({
          nome: 'Usuário',
          email: 'usuario@email.com',
        });
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      setIsAuthenticated(true);
      
      // Simular dados do usuário baseado na resposta
      if (response.user) {
        setUser(response.user);
      } else {
        setUser({
          nome: 'Usuário',
          email: email,
        });
      }

      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    signup,
    checkAuthStatus,
  };
}; 