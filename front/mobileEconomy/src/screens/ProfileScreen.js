import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { Button, LoadingCard, ErrorCard, Toast } from '../components';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const ProfileScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar perfil atualizado do backend
      const result = await authService.getUserProfile();
      
      if (result.success) {
        setUserProfile(result.data);
      } else {
        setError(result.error || 'Erro ao carregar perfil');
        showToast(result.error || 'Erro ao carregar perfil', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Erro de conexão. Verifique sua internet.');
      showToast('Erro de conexão. Verifique sua internet.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              const result = await logout();
              if (result.success) {
                showToast('Logout realizado com sucesso!', 'success');
                // O AuthProvider automaticamente redirecionará para Login
                // quando isAuthenticated mudar para false
              } else {
                showToast('Erro ao fazer logout', 'error');
              }
            } catch (error) {
              console.error('Erro no logout:', error);
              showToast('Erro ao fazer logout', 'error');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return <LoadingCard message="Carregando perfil..." />;
  }

  if (error && !userProfile) {
    return (
      <ErrorCard 
        message={error} 
        onRetry={loadUserProfile}
        retryText="Tentar novamente"
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error && (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>⚠️ {error}</Text>
          </View>
        )}

        <Text style={styles.profileTitle}>Meus Dados</Text>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>
            {userProfile?.nome || ''}
          </Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>
            {userProfile?.email || ''}
          </Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Data de nascimento</Text>
          <Text style={styles.value}>
            {formatDate(userProfile?.dataNascimento) || ''}
          </Text>
        </View>

        <Button
          title="SAIR"
          onPress={handleLogout}
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
    backgroundColor: '#fff',
  },
  warningCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  dataRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
  },
});

export default ProfileScreen; 