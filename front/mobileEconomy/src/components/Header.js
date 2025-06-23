import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Header = ({ title, showBackButton = false, onBackPress, rightComponent }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.rightSection}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default Header; 