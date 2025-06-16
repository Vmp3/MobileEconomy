import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Verificar autenticação ao inicializar o hook
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Verificar status de autenticação
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userData = await authService.getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fazer login
  const login = async (credentials) => {
    try {
      const result = await authService.signin(credentials);
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.data.user);
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro inesperado no login' };
    }
  };

  // Fazer logout
  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Atualizar dados do usuário
  const updateUser = (userData) => {
    setUser(userData);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };
}; 