import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criar o contexto de autenticação
const AuthContext = createContext();

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Verificar autenticação ao inicializar o hook (apenas uma vez)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Verificar se há token salvo
        const token = await AsyncStorage.getItem('token');
        
        if (token) {
          // Carregar dados do usuário do AsyncStorage
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              setIsAuthenticated(true);
              console.log('Usuário autenticado encontrado no AsyncStorage');
            } catch (e) {
              console.error('Erro ao parsear dados do usuário:', e);
            }
          }
        } else {
          // Não há token, usuário não está autenticado
          setUser(null);
          setIsAuthenticated(false);
          console.log('Nenhum token encontrado, usuário não autenticado');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação inicial:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []); // Array vazio para executar apenas uma vez

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
            if (userResult.data) {
              await AsyncStorage.setItem('user', JSON.stringify(userResult.data));
            }
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
      setIsLoading(true); // Definir loading durante o login
      const result = await authService.signin(credentials);
      
      if (result.success) {
        // Salvar token e dados do usuário no AsyncStorage
        await AsyncStorage.setItem('token', result.data.token);
        // Só salvar user se ele não for null ou undefined
        if (result.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(result.data.user));
        }
        
        console.log('Login bem-sucedido, atualizando estados no contexto...');
        setIsAuthenticated(true);
        setUser(result.data.user);
        setIsLoading(false); // Importante: definir loading como false
        console.log('Estados do contexto atualizados: isAuthenticated=true, user=', result.data.user);
        return { success: true, data: result.data };
      } else {
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      return { success: false, error: 'Erro inesperado no login' };
    }
  };

  // Fazer logout
  const logout = async () => {
    try {
      // Remover dados de autenticação do AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      console.log('Logout realizado, atualizando estados do contexto...');
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
      // Só salvar no AsyncStorage se userData não for null ou undefined
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Se userData for null/undefined, remover do AsyncStorage
        await AsyncStorage.removeItem('user');
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      return { success: false, error: 'Erro ao atualizar dados do usuário' };
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 