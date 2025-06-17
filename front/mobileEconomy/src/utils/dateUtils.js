// Utilitários para manipulação de datas

// Converter data do formato brasileiro (DD/MM/AAAA) para formato ISO (AAAA-MM-DD)
export const formatDateToISO = (brazilianDate) => {
  if (!brazilianDate) return '';
  
  // Remove espaços e caracteres especiais
  const cleanDate = brazilianDate.replace(/[^\d]/g, '');
  
  if (cleanDate.length !== 8) {
    return '';
  }
  
  // Extrai dia, mês e ano
  const day = cleanDate.substring(0, 2);
  const month = cleanDate.substring(2, 4);
  const year = cleanDate.substring(4, 8);
  
  // Valida se é uma data válida
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() != year || date.getMonth() != month - 1 || date.getDate() != day) {
    return '';
  }
  
  return `${year}-${month}-${day}`;
};

// Converter data do formato ISO (AAAA-MM-DD) para formato brasileiro (DD/MM/AAAA)
export const formatDateToBrazilian = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Formatar input de data com máscara DD/MM/AAAA
export const formatDateInput = (value) => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara DD/MM/AAAA
  let formatted = numbers;
  if (numbers.length >= 3) {
    formatted = numbers.substring(0, 2) + '/' + numbers.substring(2);
  }
  if (numbers.length >= 5) {
    formatted = numbers.substring(0, 2) + '/' + numbers.substring(2, 4) + '/' + numbers.substring(4, 8);
  }
  
  return formatted;
};

// Validar se data está no formato correto e é válida
export const validateDate = (brazilianDate) => {
  if (!brazilianDate) return false;
  
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = brazilianDate.match(dateRegex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Verifica se é uma data válida
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
};

// Obter mês/ano atual no formato YYYY-MM
export const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Utilitários para formatar datas compatíveis com o backend Go

/**
 * Converte um valor de mês (YYYY-MM) para o formato esperado pelo backend
 * @param {string} monthValue - Valor no formato "YYYY-MM"
 * @returns {string} - Valor formatado para o backend
 */
export const formatMonthForBackend = (monthValue) => {
  return monthValue; // Backend espera formato YYYY-MM
};

/**
 * Converte resposta do backend para formato do frontend
 * @param {string} backendDate - Data do backend
 * @returns {string} - Data formatada para o frontend
 */
export const formatDateFromBackend = (backendDate) => {
  if (!backendDate) return '';
  
  // Se for uma data completa, extrair apenas YYYY-MM
  if (backendDate.includes('T')) {
    return backendDate.substring(0, 7);
  }
  
  return backendDate;
};

/**
 * Formatar valor monetário para exibição
 * @param {number} value - Valor numérico
 * @returns {string} - Valor formatado como R$ X,XX
 */
export const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'R$ 0,00';
  
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

/**
 * Parse valor monetário do input para número
 * @param {string} input - Valor digitado pelo usuário
 * @returns {number} - Valor numérico
 */
export const parseCurrencyInput = (input) => {
  if (!input) return 0;
  
  // Remove espaços e substitui vírgula por ponto
  const cleaned = input.trim().replace(',', '.');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Obter label do mês no formato "Mês/Ano"
 * @param {string} monthValue - Valor no formato "YYYY-MM"
 * @returns {string} - Label formatado
 */
export const getMonthLabel = (monthValue) => {
  if (!monthValue) return '';
  
  const [year, month] = monthValue.split('-');
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const monthIndex = parseInt(month) - 1;
  return `${monthNames[monthIndex]}/${year}`;
}; 