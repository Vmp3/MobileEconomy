import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Input, Button } from '../components';
import { useSignupForm } from '../hooks/useSignupForm';

const SignupScreen = ({ navigation }) => {
  const { formData, errors, loading, updateField, handleSubmit } = useSignupForm(
    (response) => {
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            if (navigation) {
              navigation.navigate('Login');
            }
          },
        },
      ]);
    }
  );

  const handleLoginPress = () => {
    if (navigation) {
      navigation.navigate('Login');
    } else {
      console.log('Navigate to login');
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
              placeholder="DD/MM/AAAA"
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

            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

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
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 40,
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
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SignupScreen; 