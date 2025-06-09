/**
 * Configurações da API baseadas no README.md
 */

// URL base do backend (conforme README: porta 8080)
export const API_BASE_URL = 'http://localhost:8080';

// Endpoints de autenticação (conforme README)
export const AUTH_ENDPOINTS = {
  SIGNUP: '/api/auth/signup',  // POST - Criar conta
  SIGNIN: '/api/auth/signin',  // POST - Fazer login
};

// Endpoints de limite financeiro (conforme README)
export const LIMITE_ENDPOINTS = {
  CREATE: '/api/limite',                    // POST - Criar limite
  GET_BY_MONTH: '/api/limite/mes',         // GET - Buscar por mês: /api/limite/mes/{mesReferencia}
  LIST_ALL: '/api/limites',                // GET - Listar todos
  UPDATE: '/api/limite',                   // PUT - Editar: /api/limite/{id}
  DELETE: '/api/limite',                   // DELETE - Excluir: /api/limite/{id}
};

// Endpoints de despesa (conforme README)
export const DESPESA_ENDPOINTS = {
  CREATE: '/api/despesa',                  // POST - Criar despesa
  GET_BY_MONTH: '/api/despesa/mes',        // GET - Buscar por mês: /api/despesa/mes/{mesReferencia}
  LIST_ALL: '/api/despesas',               // GET - Listar todas
  UPDATE: '/api/despesa',                  // PUT - Editar: /api/despesa/{id}
  DELETE: '/api/despesa',                  // DELETE - Excluir: /api/despesa/{id}
};

// Headers padrão
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Timeout padrão para requisições
export const REQUEST_TIMEOUT = 10000; 