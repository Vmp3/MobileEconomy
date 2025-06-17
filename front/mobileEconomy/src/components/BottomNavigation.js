import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const BottomNavigation = ({ activeScreen, onNavigate }) => {
  const tabs = [
    { id: 'Home', icon: '👤', label: 'Home' },
    { id: 'Profile', icon: '$', label: 'Profile' },
    { id: 'Expense', icon: '+', label: 'Expense' },
    { id: 'Limit', icon: '⚙️', label: 'Limit' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeScreen === tab.id && styles.activeTab
          ]}
          onPress={() => onNavigate(tab.id)}
        >
          <View style={[
            styles.iconContainer,
            activeScreen === tab.id && styles.activeIconContainer
          ]}>
            <Text style={[
              styles.icon,
              activeScreen === tab.id && styles.activeIcon
            ]}>
              {tab.icon}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    // Estilo adicional para tab ativo se necessário
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeIcon: {
    color: '#fff',
  },
});

export default BottomNavigation; 