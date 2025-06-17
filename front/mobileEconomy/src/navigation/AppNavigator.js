import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import MainScreen from '../screens/MainScreen';
import { useAuth } from '../hooks/useAuth';
import { hasStoredToken } from '../config/api';

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('Loading');
  const { isAuthenticated, isLoading, logout, checkAuthStatus } = useAuth();

  // Verificar autenticação ao iniciar o app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se há token armazenado
        const hasToken = await hasStoredToken();
        
        if (hasToken) {
          // Se houver token, navegar para a tela principal
          setCurrentScreen('Main');
        } else {
          // Se não houver token, navegar para login
          setCurrentScreen('Login');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação inicial:', error);
        setCurrentScreen('Login');
      }
    };

    checkAuth();
  }, []);

  // Atualizar tela quando o status de autenticação mudar
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setCurrentScreen('Main');
      } else if (currentScreen === 'Main') {
        // Só redirecionar para login se estiver na tela principal
        setCurrentScreen('Login');
      }
    }
  }, [isAuthenticated, isLoading]);

  // Configurar callback global para logout automático
  useEffect(() => {
    global.onUnauthorized = () => {
      console.log('Callback de logout automático acionado');
      logout();
      setCurrentScreen('Login');
    };

    // Cleanup
    return () => {
      delete global.onUnauthorized;
    };
  }, [logout]);

  const navigation = {
    navigate: (screenName) => {
      setCurrentScreen(screenName);
    },
  };

  const renderScreen = () => {
    // Tela de carregamento inicial
    if (currentScreen === 'Loading' || (isLoading && isAuthenticated)) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      );
    }

    switch (currentScreen) {
      case 'Login':
        return <LoginScreen navigation={navigation} />;
      case 'Signup':
        return <SignupScreen navigation={navigation} />;
      case 'Home':
      case 'Main':
        // Mesmo que não esteja autenticado no estado, se tiver um token armazenado,
        // mostrar a tela principal e deixar o useAuth verificar a validade do token
        return <MainScreen navigation={navigation} />;
      default:
        // Default sempre para Login
        return <LoginScreen navigation={navigation} />;
    }
  };

  return renderScreen();
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginTop: 10,
  },
});

export default AppNavigator; 