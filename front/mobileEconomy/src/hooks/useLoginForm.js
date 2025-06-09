import { useState } from 'react';
import { serviceContainer } from '../services/ServiceContainer';
import { parseApiError, logError } from '../utils/errorHandler';

export const useLoginForm = (onSuccess) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Injeção de dependência - obter serviço do container
  const authService = serviceContainer.get('authService');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Usar o formato exato do README: POST /api/auth/signin
      // Request: { email: string, senha: string }
      // Response: { token: string, user: object }
      const response = await authService.login(formData.email, formData.senha);
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      logError('LOGIN', error);
      setErrors({
        general: parseApiError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      email: '',
      senha: '',
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    loading,
    updateField,
    handleSubmit,
    clearForm,
  };
}; 