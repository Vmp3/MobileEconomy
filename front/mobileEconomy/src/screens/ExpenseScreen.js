import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Input, Button, MonthSelector, LoadingCard, ErrorCard, Toast } from '../components';
import { despesaService } from '../services/despesaService';
import { getCurrentMonth, getMonthLabel } from '../utils/dateUtils';
import { formatCurrency, parseCurrency, isValidCurrency } from '../utils/formatUtils';

const ExpenseScreen = ({ navigation }) => {
  const currentMonth = getCurrentMonth();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedMonthLabel, setSelectedMonthLabel] = useState(getMonthLabel(currentMonth));
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showHistorySelector, setShowHistorySelector] = useState(false);
  const [historyMonth, setHistoryMonth] = useState(currentMonth);
  const [historyMonthLabel, setHistoryMonthLabel] = useState(getMonthLabel(currentMonth));
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');

  const showToast = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  useEffect(() => {
    loadDespesas();
  }, [historyMonth]);

  const loadDespesas = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      const result = await despesaService.getDespesasByMonth(historyMonth);
      if (result.success) {
        setDespesas(result.data || []);
      } else {
        setError(result.error || 'Erro ao carregar despesas');
        showToast(result.error || 'Erro ao carregar despesas', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
      setError('Erro de conexão. Verifique sua internet.');
      showToast('Erro de conexão. Verifique sua internet.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveDespesa = async () => {
    // Validar descrição
    if (!descricao.trim()) {
      showToast('Descrição é obrigatória', 'error');
      return;
    }

    // Validar valor monetário
    if (!isValidCurrency(valor)) {
      showToast('Valor deve ser um número positivo', 'error');
      return;
    }

    setLoading(true);
    try {
      const valorNumber = parseCurrency(valor);
      
      const result = await despesaService.createDespesa({
        descricao: descricao.trim(),
        valor: valorNumber,
        mesReferencia: selectedMonth,
      });

      if (result.success) {
        showToast('Despesa salva com sucesso!', 'success');
        setDescricao('');
        setValor('');
        // Recarregar lista se estiver no mesmo mês
        if (selectedMonth === historyMonth) {
          loadDespesas();
        }
      } else {
        showToast(result.error || 'Erro ao salvar despesa', 'error');
      }
    } catch (error) {
      showToast('Erro ao salvar despesa', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDespesa = async (item) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir a despesa "${item.descricao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (item.id) {
                const result = await despesaService.deleteDespesa(item.id);
                if (result.success) {
                  showToast('Despesa excluída com sucesso!', 'success');
                  loadDespesas();
                } else {
                  showToast(result.error || 'Erro ao excluir despesa', 'error');
                }
              } else {
                showToast('ID da despesa não encontrado. O backend precisa retornar IDs nas respostas.', 'error');
              }
            } catch (error) {
              showToast('Erro ao excluir despesa', 'error');
            }
          },
        },
      ]
    );
  };

  const renderDespesaItem = ({ item, index }) => (
    <View style={styles.despesaItem}>
      <View style={styles.despesaInfo}>
        <Text style={styles.despesaTag}>{item.descricao}</Text>
        <Text style={styles.despesaValue}>
          {formatCurrency(item.valor || 0)}
        </Text>
      </View>
      <View style={styles.despesaActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (item.id) {
              // Implementar edição quando o backend retornar IDs
              showToast('Função de editar em desenvolvimento.', 'error');
            } else {
              showToast('ID da despesa não encontrado. O backend precisa retornar IDs nas respostas.', 'error');
            }
          }}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteDespesa(item)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <FlatList
        data={despesas}
        renderItem={renderDespesaItem}
        keyExtractor={(item, index) => `${item.id || item.descricao}-${index}`}
        showsVerticalScrollIndicator={false}
        style={styles.flatListContainer}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            <Text style={styles.cardTitle}>Despesa</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <Input
                value={descricao}
                onChangeText={setDescricao}
                placeholder=""
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Valor</Text>
              <Input
                value={valor}
                onChangeText={setValor}
                placeholder=""
                type="currency"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mês</Text>
              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => setShowMonthSelector(true)}
              >
                <Text style={styles.monthButtonText}>
                  {selectedMonthLabel} ▼
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="SALVAR"
              onPress={handleSaveDespesa}
              loading={loading}
              style={styles.saveButton}
            />

            {/* Seção de histórico */}
            <Text style={styles.historyTitle}>Histórico</Text>
            
            <TouchableOpacity
              style={styles.monthButton}
              onPress={() => setShowHistorySelector(true)}
            >
              <Text style={styles.monthButtonText}>
                {historyMonthLabel} ▼
              </Text>
            </TouchableOpacity>

            {loadingData && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando despesas...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadDespesas}>
                  <Text style={styles.retryButtonText}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !loadingData && !error ? (
            <Text style={styles.emptyText}>Nenhuma despesa encontrada</Text>
          ) : null
        }
      />

      {/* Modal de seleção de mês para cadastro */}
      <MonthSelector
        visible={showMonthSelector}
        onClose={() => setShowMonthSelector(false)}
        selectedMonth={selectedMonth}
        onSelectMonth={(value, label) => {
          setSelectedMonth(value);
          setSelectedMonthLabel(label);
        }}
      />

      {/* Modal de seleção de mês para histórico */}
      <MonthSelector
        visible={showHistorySelector}
        onClose={() => setShowHistorySelector(false)}
        selectedMonth={historyMonth}
        onSelectMonth={(value, label) => {
          setHistoryMonth(value);
          setHistoryMonthLabel(label);
        }}
      />

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={hideToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
  },
  monthButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  monthButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
  },
  despesasList: {
    marginTop: 15,
    maxHeight: 300,
  },
  despesaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  despesaInfo: {
    flex: 1,
  },
  despesaTag: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  despesaValue: {
    fontSize: 14,
    color: '#fff',
  },
  despesaActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  flatListContainer: {
    flex: 1,
  },
});

export default ExpenseScreen; 