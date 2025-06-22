/**
 * Formatar valor monetário no padrão brasileiro
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} - Valor formatado (ex: "2.130,00")
 */
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '0,00';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) return '0,00';
  
  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formatar valor monetário com prefixo R$ no padrão brasileiro
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} - Valor formatado (ex: "R$ 2.130,00")
 */
export const formatCurrencyWithPrefix = (value) => {
  return `R$ ${formatCurrency(value)}`;
};

/**
 * Converter valor formatado brasileiro para número
 * @param {string} formattedValue - Valor formatado (ex: "2.130,00" ou "2130,00")
 * @returns {number} - Valor numérico
 */
export const parseCurrency = (formattedValue) => {
  if (!formattedValue) return 0;
  
  // Remove pontos (separadores de milhares) e substitui vírgula por ponto
  const cleanValue = formattedValue
    .replace(/\./g, '')
    .replace(',', '.');
  
  const numericValue = parseFloat(cleanValue);
  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Formatar input monetário enquanto o usuário digita
 * @param {string} value - Valor atual do input
 * @returns {string} - Valor formatado para exibição
 */
export const formatCurrencyInput = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbersOnly = value.replace(/[^\d]/g, '');
  
  // Se não há números, retorna vazio
  if (!numbersOnly) return '';
  
  // Converte para centavos (divide por 100 para ter 2 casas decimais)
  const cents = parseInt(numbersOnly, 10);
  const reais = cents / 100;
  
  // Formatar no padrão brasileiro
  return formatCurrency(reais);
};

/**
 * Validar se o valor é um número válido
 * @param {string} value - Valor a ser validado
 * @returns {boolean} - true se é um número válido
 */
export const isValidNumber = (value) => {
  if (!value || value.trim() === '') return false;
  
  // Remove formatação brasileira e converte para número
  const numericValue = parseCurrency(value);
  return !isNaN(numericValue) && numericValue >= 0;
};

/**
 * Validar se o valor monetário é válido e maior que zero
 * @param {string} value - Valor a ser validado
 * @returns {boolean} - true se é um valor monetário válido
 */
export const isValidCurrency = (value) => {
  if (!isValidNumber(value)) return false;
  
  const numericValue = parseCurrency(value);
  return numericValue > 0;
}; 