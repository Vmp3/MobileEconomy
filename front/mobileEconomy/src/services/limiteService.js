import api from '../config/api';

export const limiteService = {
  // Criar novo limite
  async createLimite(limiteData) {
    try {
      console.log('Criando limite com dados:', JSON.stringify(limiteData));
      const response = await api.post('/limite', limiteData);
      console.log('Resposta da criação de limite:', JSON.stringify(response.data));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao criar limite:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar limite'
      };
    }
  },

  // Buscar limite por mês
  async getLimiteByMonth(mesReferencia) {
    try {
      console.log(`Buscando limite para o mês: ${mesReferencia}`);
      const response = await api.get(`/limite/mes/${mesReferencia}`);
      console.log('Limite encontrado:', JSON.stringify(response.data));
      
      // Verificar se o limite tem ID, se não tiver, logar erro
      if (response.data && !response.data.id) {
        console.error('API retornou limite sem ID:', response.data);
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Status 204 significa que não há dados, mas não é erro
      if (error.response?.status === 204) {
        console.log(`Nenhum limite encontrado para o mês ${mesReferencia}`);
        return {
          success: true,
          data: null
        };
      }
      console.error(`Erro ao buscar limite para o mês ${mesReferencia}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar limite'
      };
    }
  },

  // Buscar todos os limites do usuário
  async getAllLimites() {
    try {
      console.log('Buscando todos os limites');
      const response = await api.get('/limites');
      console.log(`${response.data.length} limites encontrados`);
      
      // Verificar se todos os limites têm ID
      if (response.data && response.data.length > 0) {
        const limitesComId = response.data.filter(limite => limite.id);
        if (limitesComId.length !== response.data.length) {
          console.error('API retornou limites sem ID:', response.data.filter(limite => !limite.id));
        }
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Status 204 significa que não há dados, mas não é erro
      if (error.response?.status === 204) {
        console.log('Nenhum limite encontrado');
        return {
          success: true,
          data: []
        };
      }
      console.error('Erro ao buscar todos os limites:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar limites'
      };
    }
  },

  // Atualizar limite
  async updateLimite(id, limiteData) {
    if (!id) {
      console.error('Tentativa de atualizar limite com ID inválido:', id);
      return {
        success: false,
        error: 'ID inválido'
      };
    }

    try {
      console.log(`Atualizando limite ID ${id} com dados:`, JSON.stringify(limiteData));
      const response = await api.put(`/limite/${id}`, limiteData);
      console.log('Resposta da atualização de limite:', JSON.stringify(response.data));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Erro ao atualizar limite ID ${id}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao atualizar limite'
      };
    }
  },

  // Deletar limite
  async deleteLimite(id) {
    if (!id) {
      console.error('Tentativa de deletar limite com ID inválido:', id);
      return {
        success: false,
        error: 'ID inválido'
      };
    }

    try {
      console.log(`Deletando limite ID ${id}`);
      await api.delete(`/limite/${id}`);
      console.log(`Limite ID ${id} deletado com sucesso`);
      return {
        success: true
      };
    } catch (error) {
      console.error(`Erro ao deletar limite ID ${id}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao deletar limite'
      };
    }
  }
};