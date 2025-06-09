import { useState } from 'react';
import { serviceContainer } from '../services/ServiceContainer';
import { parseApiError, logError } from '../utils/errorHandler';

export const useSignupForm = (onSuccess) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    dataNascimento: '',
    senha: '',
    confirmacaoSenha: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Injeção de dependência - obter serviço do container
  const authService = serviceContainer.get('authService');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDate = (dateString) => {
    // Validar formato DD/MM/AAAA
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) {
      return false;
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Validar se a data é válida
    const date = new Date(year, month - 1, day);
    const today = new Date();
    
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year &&
      date < today
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else if (!validateDate(formData.dataNascimento)) {
      newErrors.dataNascimento = 'Data inválida. Use o formato DD/MM/AAAA';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (value) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara DD/MM/AAAA
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const updateField = (field, value) => {
    let formattedValue = value;
    
    // Aplicar formatação especial para data de nascimento
    if (field === 'dataNascimento') {
      formattedValue = formatDate(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue,
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
      // Converter data de DD/MM/AAAA para AAAA-MM-DD (formato esperado pelo backend)
      const convertDateFormat = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      };

      // Usar o formato exato do README: POST /api/auth/signup
      // Request: { nome, email, dataNascimento, senha, confirmacaoSenha }
      // Response: { message: string }
      const signupData = {
        nome: formData.nome.trim(),
        email: formData.email.toLowerCase().trim(),
        dataNascimento: convertDateFormat(formData.dataNascimento),
        senha: formData.senha,
        confirmacaoSenha: formData.confirmacaoSenha,
      };

      const response = await authService.signup(signupData);
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      logError('SIGNUP', error);
      setErrors({
        general: parseApiError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      nome: '',
      email: '',
      dataNascimento: '',
      senha: '',
      confirmacaoSenha: '',
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