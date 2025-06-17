import api from '../config/api';

export const despesaService = {
  // Criar nova despesa
  async createDespesa(despesaData) {
    try {
      console.log('Criando despesa com dados:', JSON.stringify(despesaData));
      const response = await api.post('/despesa', despesaData);
      console.log('Resposta da criação de despesa:', JSON.stringify(response.data));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao criar despesa:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar despesa'
      };
    }
  },

  // Buscar despesa por ID
  async getDespesaById(id) {
    if (!id) {
      console.error('Tentativa de buscar despesa com ID inválido:', id);
      return {
        success: false,
        error: 'ID inválido'
      };
    }

    try {
      console.log(`Buscando despesa ID ${id}`);
      const response = await api.get(`/despesa/${id}`);
      console.log('Despesa encontrada:', JSON.stringify(response.data));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Erro ao buscar despesa ID ${id}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar despesa'
      };
    }
  },

  // Buscar despesas por mês
  async getDespesasByMonth(mesReferencia) {
    try {
      console.log(`Buscando despesas para o mês: ${mesReferencia}`);
      const response = await api.get(`/despesa/mes/${mesReferencia}`);
      console.log(`${response.data.length} despesas encontradas para o mês ${mesReferencia}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Status 204 significa que não há dados, mas não é erro
      if (error.response?.status === 204) {
        console.log(`Nenhuma despesa encontrada para o mês ${mesReferencia}`);
        return {
          success: true,
          data: []
        };
      }
      console.error(`Erro ao buscar despesas para o mês ${mesReferencia}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar despesas'
      };
    }
  },

  // Buscar todas as despesas do usuário
  async getAllDespesas() {
    try {
      console.log('Buscando todas as despesas');
      const response = await api.get('/despesas');
      console.log(`${response.data.length} despesas encontradas`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Status 204 significa que não há dados, mas não é erro
      if (error.response?.status === 204) {
        console.log('Nenhuma despesa encontrada');
        return {
          success: true,
          data: []
        };
      }
      console.error('Erro ao buscar todas as despesas:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar despesas'
      };
    }
  },

  // Atualizar despesa
  async updateDespesa(id, despesaData) {
    if (!id) {
      console.error('Tentativa de atualizar despesa com ID inválido:', id);
      return {
        success: false,
        error: 'ID inválido'
      };
    }

    try {
      console.log(`Atualizando despesa ID ${id} com dados:`, JSON.stringify(despesaData));
      const response = await api.put(`/despesa/${id}`, despesaData);
      console.log('Resposta da atualização de despesa:', JSON.stringify(response.data));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Erro ao atualizar despesa ID ${id}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao atualizar despesa'
      };
    }
  },

  // Deletar despesa
  async deleteDespesa(id) {
    if (!id) {
      console.error('Tentativa de deletar despesa com ID inválido:', id);
      return {
        success: false,
        error: 'ID inválido'
      };
    }

    try {
      console.log(`Deletando despesa ID ${id}`);
      await api.delete(`/despesa/${id}`);
      console.log(`Despesa ID ${id} deletada com sucesso`);
      return {
        success: true
      };
    } catch (error) {
      console.error(`Erro ao deletar despesa ID ${id}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao deletar despesa'
      };
    }
  }
}; 