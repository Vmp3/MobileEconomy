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
import { useLoginForm } from '../hooks/useLoginForm';

const LoginScreen = ({ navigation }) => {
  const { formData, errors, loading, updateField, handleSubmit } = useLoginForm(
    (response) => {
      Alert.alert('Sucesso', 'Login realizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            if (navigation) {
              navigation.navigate('Home');
            } else {
              console.log('Login successful:', response);
            }
          },
        },
      ]);
    }
  );

  const handleSignupPress = () => {
    if (navigation) {
      navigation.navigate('Signup');
    } else {
      console.log('Navigate to signup');
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

            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

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

export default LoginScreen; 