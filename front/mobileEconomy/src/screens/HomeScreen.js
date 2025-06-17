import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Toast } from '../components';
import { useAuth } from '../hooks/useAuth';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');

  const showToast = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              showToast('Logout realizado com sucesso!', 'success');
              setTimeout(() => {
                if (navigation) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                }
              }, 1000);
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              showToast('Erro ao fazer logout', 'error');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleNavigateToLimites = () => {
    navigation.navigate('Limit');
  };

  const handleNavigateToDespesas = () => {
    navigation.navigate('Expense');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💰 Mobile Economy</Text>
          <Text style={styles.subtitle}>Controle Financeiro Pessoal</Text>
        </View>

        {/* Informações do Usuário */}
        <View style={styles.userCard}>
          <Text style={styles.welcomeText}>
            Bem-vindo, {user?.nome || 'Usuário'}!
          </Text>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>

        {/* Menu Principal */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNavigateToLimites}
          >
            <Text style={styles.menuIcon}>🎯</Text>
            <Text style={styles.menuTitle}>Limites Mensais</Text>
            <Text style={styles.menuDescription}>
              Defina seus limites de gastos mensais
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNavigateToDespesas}
          >
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuTitle}>Despesas</Text>
            <Text style={styles.menuDescription}>
              Registre e acompanhe suas despesas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Resumo Rápido */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo do Mês</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Limite Definido:</Text>
            <Text style={styles.summaryValue}>R$ 0,00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Gastos Atuais:</Text>
            <Text style={styles.summaryValue}>R$ 0,00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Disponível:</Text>
            <Text style={[styles.summaryValue, styles.summaryAvailable]}>
              R$ 0,00
            </Text>
          </View>
        </View>

        {/* Botão de Logout */}
        <Button
          title="Sair"
          onPress={handleLogout}
          loading={loading}
          variant="outline"
          style={styles.logoutButton}
        />
      </ScrollView>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={hideToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summaryAvailable: {
    color: '#4CAF50',
  },
  logoutButton: {
    marginTop: 10,
    borderColor: '#d32f2f',
  },
});

export default HomeScreen; 