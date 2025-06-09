/**
 * Utilitário para tratamento de erros de API
 */

export const parseApiError = (error) => {
  // Erro de rede ou servidor não disponível
  if (error.message.includes('fetch')) {
    return 'Erro de conexão. Verifique se o backend está rodando na porta 8080.';
  }

  // Erro de HTML retornado em vez de JSON
  if (error.message.includes('HTML/texto em vez de JSON')) {
    return 'Backend não encontrado. Verifique se o servidor está rodando em http://localhost:8080';
  }

  // Erro de parsing JSON
  if (error.message.includes('JSON')) {
    return 'Resposta inválida do servidor. Verifique se o backend está configurado corretamente.';
  }

  // Erro HTTP específico
  if (error.message.includes('HTTP 400')) {
    return 'Dados inválidos enviados para o servidor.';
  }

  if (error.message.includes('HTTP 401')) {
    return 'Credenciais inválidas ou token expirado.';
  }

  if (error.message.includes('HTTP 404')) {
    return 'Endpoint não encontrado. Verifique se o backend está atualizado.';
  }

  if (error.message.includes('HTTP 409')) {
    return 'Email já está em uso.';
  }

  if (error.message.includes('HTTP 500')) {
    return 'Erro interno do servidor. Verifique os logs do backend.';
  }

  // Retornar mensagem original se não for reconhecida
  return error.message || 'Erro desconhecido';
};

export const logError = (context, error) => {
  console.error(`[${context}]`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
}; 