import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BottomNavigation } from '../components';
import NewHomeScreen from './NewHomeScreen';
import ProfileScreen from './ProfileScreen';
import ExpenseScreen from './ExpenseScreen';
import LimitScreen from './LimitScreen';

const MainScreen = ({ navigation }) => {
  const [activeScreen, setActiveScreen] = useState('Home');

  const handleNavigate = (screenName) => {
    setActiveScreen(screenName);
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <NewHomeScreen navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      case 'Expense':
        return <ExpenseScreen navigation={navigation} />;
      case 'Limit':
        return <LimitScreen navigation={navigation} />;
      default:
        return <NewHomeScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Conteúdo da tela ativa */}
      <View style={styles.content}>
        {renderActiveScreen()}
      </View>

      {/* Navegação inferior */}
      <BottomNavigation
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default MainScreen; 