import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Chave para armazenar a URL personalizada no AsyncStorage
const CUSTOM_API_URL_KEY = 'custom_api_url';

/**
 * Obtém a URL base da API, considerando configurações personalizadas
 * @returns {Promise<string>} URL base da API
 */
export const getApiBaseUrl = async () => {
  try {
    // Verificar se existe uma URL personalizada salva
    const customUrl = await AsyncStorage.getItem(CUSTOM_API_URL_KEY);
    
    if (customUrl) {
      return customUrl;
    }
    
    // Caso contrário, usar a URL padrão baseada na plataforma
    if (Platform.OS === 'web') {
      return 'http://localhost:8080/api';
    } else {
      return Platform.OS === 'android' 
        ? 'http://10.0.2.2:8080/api' 
        : 'http://localhost:8080/api';
    }
  } catch (error) {
    console.error('Erro ao obter URL da API:', error);
    
    // Em caso de erro, retornar URL padrão
    if (Platform.OS === 'web') {
      return 'http://localhost:8080/api';
    } else {
      return Platform.OS === 'android' 
        ? 'http://10.0.2.2:8080/api' 
        : 'http://localhost:8080/api';
    }
  }
};

/**
 * Salva uma URL personalizada para a API
 * @param {string} url - URL completa da API (ex: http://192.168.1.100:8080/api)
 * @returns {Promise<boolean>} - true se salvou com sucesso, false caso contrário
 */
export const saveCustomApiUrl = async (url) => {
  try {
    if (!url) {
      // Se a URL for vazia, remover a configuração personalizada
      await AsyncStorage.removeItem(CUSTOM_API_URL_KEY);
    } else {
      // Validar URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('URL deve começar com http:// ou https://');
      }
      
      // Garantir que a URL termina com /api
      const formattedUrl = url.endsWith('/api') ? url : `${url}/api`;
      
      // Salvar URL personalizada
      await AsyncStorage.setItem(CUSTOM_API_URL_KEY, formattedUrl);
    }
    return true;
  } catch (error) {
    console.error('Erro ao salvar URL da API:', error);
    return false;
  }
};

/**
 * Remove a URL personalizada da API
 * @returns {Promise<boolean>} - true se removeu com sucesso, false caso contrário
 */
export const resetApiUrl = async () => {
  try {
    await AsyncStorage.removeItem(CUSTOM_API_URL_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao resetar URL da API:', error);
    return false;
  }
};

/**
 * Verifica se existe uma URL personalizada configurada
 * @returns {Promise<boolean>} - true se existe URL personalizada, false caso contrário
 */
export const hasCustomApiUrl = async () => {
  try {
    const url = await AsyncStorage.getItem(CUSTOM_API_URL_KEY);
    return !!url;
  } catch (error) {
    console.error('Erro ao verificar URL personalizada:', error);
    return false;
  }
}; 