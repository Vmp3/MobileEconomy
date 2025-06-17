import { useState } from 'react';
import { authService } from '../services/authService';
import { formatDateToISO, formatDateInput, validateDate } from '../utils/dateUtils';

export const useSignupForm = (onSuccess, onError) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    dataNascimento: '',
    senha: '',
    confirmacaoSenha: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Atualizar campo do formulário
  const updateField = (field, value) => {
    // Aplicar máscara na data de nascimento
    if (field === 'dataNascimento') {
      value = formatDateInput(value);
    }

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

    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email inválido';
    }

    // Validar data de nascimento
    if (!formData.dataNascimento.trim()) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else if (!validateDate(formData.dataNascimento)) {
      newErrors.dataNascimento = 'Data de nascimento inválida';
    } else {
      // Verificar se a pessoa tem pelo menos 13 anos
      const isoDate = formatDateToISO(formData.dataNascimento);
      const birthDate = new Date(isoDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      const actualAge = age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);
      
      if (actualAge < 13) {
        newErrors.dataNascimento = 'Você deve ter pelo menos 13 anos';
      }
    }

    // Validar senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validar confirmação de senha
    if (!formData.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'Senhas não conferem';
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
      const userData = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        dataNascimento: formatDateToISO(formData.dataNascimento),
        senha: formData.senha,
        confirmacaoSenha: formData.confirmacaoSenha
      };

      const result = await authService.signup(userData);

      if (result.success) {
        // Limpar formulário
        setFormData({
          nome: '',
          email: '',
          dataNascimento: '',
          senha: '',
          confirmacaoSenha: ''
        });
        setErrors({});
        
        // Chamar callback de sucesso
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        // Exibir erro
        const errorMessage = result.error || 'Erro ao criar conta. Tente novamente.';
        setErrors({
          general: errorMessage
        });
        
        // Chamar callback de erro
        if (onError) {
          onError({ message: errorMessage });
        }
      }
    } catch (error) {
      console.error('Erro inesperado no signup:', error);
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