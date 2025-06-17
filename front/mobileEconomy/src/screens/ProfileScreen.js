import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, LoadingCard, ErrorCard } from '../components';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const ProfileScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

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
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Erro de conexão. Verifique sua internet.');
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
              await logout();
              if (navigation) {
                navigation.navigate('Login');
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro ao fazer logout');
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
      <StatusBar style="dark" />
      
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