import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Input, Button, Toast } from '../components';
import { useLoginForm } from '../hooks/useLoginForm';

const LoginScreen = ({ navigation }) => {
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

  const { formData, errors, loading, updateField, handleSubmit } = useLoginForm(
    (response) => {
      showToast('Login realizado com sucesso!', 'success');
      
      // Redirecionar para Home após um pequeno delay para mostrar o toast
      setTimeout(() => {
        if (navigation) {
          navigation.navigate('Main');
        }
      }, 1000);
    },
    (error) => {
      showToast(error.message || 'Erro ao fazer login. Tente novamente.');
    }
  );

  const handleSignupPress = () => {
    if (navigation) {
      navigation.navigate('Signup');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>ENTRAR</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Senha"
              value={formData.senha}
              onChangeText={(value) => updateField('senha', value)}
              placeholder=""
              secureTextEntry
              error={errors.senha}
            />

            <Button
              title="Entrar"
              onPress={handleSubmit}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity
              style={styles.signupLinkContainer}
              onPress={handleSignupPress}
            >
              <Text style={styles.signupLinkText}>
                Não possui conta? Crie aqui
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={hideToast}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  signupLinkContainer: {
    alignItems: 'center',
  },
  signupLinkText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen; 