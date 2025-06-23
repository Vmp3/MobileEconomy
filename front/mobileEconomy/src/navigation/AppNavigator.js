import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import MainScreen from '../screens/MainScreen';
import { useAuth } from '../hooks/useAuth';
import { hasStoredToken } from '../config/api';

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('Loading');
  const { isAuthenticated, isLoading, logout } = useAuth();

  // Verificar autenticação ao iniciar o app (apenas uma vez)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se há token armazenado apenas uma vez
        const hasToken = await hasStoredToken();
        
        if (hasToken) {
          setCurrentScreen('Main');
        } else {
          setCurrentScreen('Login');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação inicial:', error);
        setCurrentScreen('Login');
      }
    };

    // Executar apenas uma vez na inicialização
    if (currentScreen === 'Loading') {
      checkAuth();
    }
  }, []); // Array vazio para executar apenas uma vez

  // Atualizar tela quando o status de autenticação mudar
  useEffect(() => {
    console.log(`AppNavigator useEffect: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}, currentScreen=${currentScreen}`);
    
    if (!isLoading) {
      if (isAuthenticated && currentScreen !== 'Main') {
        console.log('Usuário autenticado, navegando para Main');
        setCurrentScreen('Main');
      } else if (!isAuthenticated && currentScreen !== 'Login' && currentScreen !== 'Signup') {
        console.log('Usuário não autenticado, navegando para Login'); 
        setCurrentScreen('Login');
      } else {
        console.log('Nenhuma navegação necessária');
      }
    }
  }, [isAuthenticated, isLoading, currentScreen]);

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
    reset: (resetConfig) => {
      // Para compatibilidade com navigation.reset do React Navigation
      if (resetConfig && resetConfig.routes && resetConfig.routes.length > 0) {
        const targetScreen = resetConfig.routes[resetConfig.index || 0].name;
        setCurrentScreen(targetScreen);
      }
    },
  };

  const renderScreen = () => {
    // Tela de carregamento inicial
    if (currentScreen === 'Loading' || (isLoading && isAuthenticated)) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </SafeAreaView>
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