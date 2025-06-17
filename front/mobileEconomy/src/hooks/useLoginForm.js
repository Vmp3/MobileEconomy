import { useState } from 'react';
import { authService } from '../services/authService';

export const useLoginForm = (onSuccess, onError) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Atualizar campo do formulário
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Limpar erro geral
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para envio
      const credentials = {
        email: formData.email.trim().toLowerCase(),
        senha: formData.senha
      };

      const result = await authService.signin(credentials);

      if (result.success) {
        // Limpar formulário
        setFormData({
          email: '',
          senha: ''
        });
        setErrors({});
        
        // Chamar callback de sucesso
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        // Exibir erro
        const errorMessage = result.error || 'Erro ao fazer login. Tente novamente.';
        setErrors({
          general: errorMessage
        });
        
        // Chamar callback de erro
        if (onError) {
          onError({ message: errorMessage });
        }
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      const errorMessage = error.message || 'Erro inesperado. Tente novamente.';
      setErrors({
        general: errorMessage
      });
      
      // Chamar callback de erro
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    updateField,
    handleSubmit
  };
}; 