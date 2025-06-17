import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      
      // Verificar se há token salvo
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        // Primeiro, tentar carregar dados do usuário do AsyncStorage para exibição imediata
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (e) {
            console.error('Erro ao parsear dados do usuário:', e);
          }
        }

        // Em segundo plano, verificar se o token é válido buscando o perfil do usuário
        try {
          const userResult = await authService.getUserProfile();
          
          if (userResult.success) {
            // Token válido, atualizar dados do usuário
            setUser(userResult.data);
            setIsAuthenticated(true);
            
            // Atualizar dados no AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userResult.data));
          } else {
            // Se o token for inválido mas não for por erro de rede, fazer logout
            if (!userResult.error?.includes('conexão') && !userResult.error?.includes('network')) {
              console.log('Token inválido ou expirado, fazendo logout');
              await logout();
            } else {
              // Se for erro de rede, manter usuário logado com dados do AsyncStorage
              console.log('Erro de rede, mantendo usuário logado com dados locais');
            }
          }
        } catch (error) {
          // Em caso de erro de rede, manter o usuário logado com dados do AsyncStorage
          console.error('Erro ao verificar perfil do usuário:', error);
          // Não fazer logout em caso de erro de rede
        }
      } else {
        // Não há token, usuário não está autenticado
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      
      // Tentar recuperar dados do usuário do AsyncStorage mesmo em caso de erro
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (e) {
        // Se não conseguir recuperar, limpar dados de autenticação
        setIsAuthenticated(false);
        setUser(null);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fazer login
  const login = async (credentials) => {
    try {
      const result = await authService.signin(credentials);
      
      if (result.success) {
        // Salvar token e dados do usuário no AsyncStorage
        await AsyncStorage.setItem('token', result.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(result.data.user));
        
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
      // Remover dados de autenticação do AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      setIsAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: 'Erro ao fazer logout' };
    }
  };

  // Atualizar dados do usuário
  const updateUser = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      return { success: false, error: 'Erro ao atualizar dados do usuário' };
    }
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