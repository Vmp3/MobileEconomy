import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import { useAuth } from '../hooks/useAuth';

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      setCurrentScreen(isAuthenticated ? 'Home' : 'Login');
    }
  }, [isAuthenticated, isLoading]);

  const navigation = {
    navigate: (screenName) => {
      setCurrentScreen(screenName);
    },
  };

  const renderScreen = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
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
        return <HomeScreen navigation={navigation} />;
      default:
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AppNavigator; 