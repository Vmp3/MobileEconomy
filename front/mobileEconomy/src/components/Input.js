import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import { formatCurrencyInput, parseCurrency, isValidNumber } from '../utils/formatUtils';

const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false, 
  keyboardType = 'default',
  type = 'text', // 'text', 'currency', 'number'
  error,
  style,
  ...props 
}) => {
  
  const handleTextChange = (text) => {
    let formattedText = text;
    
    // Aplicar formatação baseada no tipo
    switch (type) {
      case 'currency':
        // Formatação monetária brasileira em tempo real
        formattedText = formatCurrencyInput(text);
        break;
      
      case 'number':
        // Permitir apenas números e vírgula/ponto decimal
        formattedText = text.replace(/[^\d,\.]/g, '');
        break;
      
      default:
        // Tipo text - sem formatação especial
        formattedText = text;
        break;
    }
    
    onChangeText(formattedText);
  };

  const getKeyboardType = () => {
    switch (type) {
      case 'currency':
      case 'number':
        return 'numeric';
      default:
        return keyboardType;
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (type) {
      case 'currency':
        return '0,00';
      case 'number':
        return '0';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={handleTextChange}
        placeholder={getPlaceholder()}
        secureTextEntry={secureTextEntry}
        keyboardType={getKeyboardType()}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input; 