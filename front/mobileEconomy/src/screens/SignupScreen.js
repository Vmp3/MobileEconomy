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
import { useSignupForm } from '../hooks/useSignupForm';

const SignupScreen = ({ navigation }) => {
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

  const { formData, errors, loading, updateField, handleSubmit } = useSignupForm(
    (response) => {
      showToast('Conta criada com sucesso!', 'success');
      
      // Redirecionar para Login após um pequeno delay para mostrar o toast
      setTimeout(() => {
        if (navigation) {
          navigation.navigate('Login');
        }
      }, 1000);
    },
    (error) => {
      showToast(error.message || 'Erro ao criar conta. Tente novamente.');
    }
  );

  const handleLoginPress = () => {
    if (navigation) {
      navigation.navigate('Login');
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
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>CRIAR</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nome"
              value={formData.nome}
              onChangeText={(value) => updateField('nome', value)}
              placeholder=""
              autoCapitalize="words"
              error={errors.nome}
            />

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
              label="Data de nascimento"
              value={formData.dataNascimento}
              onChangeText={(value) => updateField('dataNascimento', value)}
              placeholder=""
              keyboardType="numeric"
              error={errors.dataNascimento}
            />

            <Input
              label="Senha"
              value={formData.senha}
              onChangeText={(value) => updateField('senha', value)}
              placeholder=""
              secureTextEntry
              error={errors.senha}
            />

            <Input
              label="Confirmar senha"
              value={formData.confirmacaoSenha}
              onChangeText={(value) => updateField('confirmacaoSenha', value)}
              placeholder=""
              secureTextEntry
              error={errors.confirmacaoSenha}
            />

            <Button
              title="Criar"
              onPress={handleSubmit}
              loading={loading}
              style={styles.createButton}
            />

            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={handleLoginPress}
            >
              <Text style={styles.loginLinkText}>Voltar</Text>
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
    paddingVertical: 20,
  },
  formContainer: {
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
  createButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  loginLinkContainer: {
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SignupScreen; 