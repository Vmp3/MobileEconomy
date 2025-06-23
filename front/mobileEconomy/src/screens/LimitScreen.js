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
import { limiteService } from '../services/limiteService';
import { getCurrentMonth, getMonthLabel } from '../utils/dateUtils';
import { formatCurrency, formatCurrencyWithPrefix, parseCurrency, isValidCurrency } from '../utils/formatUtils';

const LimitScreen = ({ navigation }) => {
  const currentMonth = getCurrentMonth();
  const [valor, setValor] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedMonthLabel, setSelectedMonthLabel] = useState(getMonthLabel(currentMonth));
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showConsultaSelector, setShowConsultaSelector] = useState(false);
  const [consultaMonth, setConsultaMonth] = useState(currentMonth);
  const [consultaMonthLabel, setConsultaMonthLabel] = useState(getMonthLabel(currentMonth));
  const [limites, setLimites] = useState([]);
  const [currentLimit, setCurrentLimit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
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
    loadCurrentLimit();
    loadAllLimites();
  }, [consultaMonth]);

  const loadCurrentLimit = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      const result = await limiteService.getLimiteByMonth(consultaMonth);
      if (result.success) {
        // Verificar se o limite tem ID
        if (result.data && !result.data.id) {
          console.error('Limite retornado sem ID:', JSON.stringify(result.data));
          // Tentar buscar todos os limites para encontrar o correto com ID
          const todosLimites = await limiteService.getAllLimites();
          if (todosLimites.success && todosLimites.data) {
            // Procurar o limite com o mesmo mês de referência
            const limiteComId = todosLimites.data.find(
              limite => limite.mesReferencia === consultaMonth && limite.id
            );
            if (limiteComId) {
              console.log('Limite com ID encontrado em getAllLimites:', JSON.stringify(limiteComId));
              setCurrentLimit(limiteComId);
            } else {
              setCurrentLimit(result.data);
            }
          } else {
            setCurrentLimit(result.data);
          }
        } else {
          setCurrentLimit(result.data);
        }
        
        // Log para debug
        if (result.data) {
          console.log('Limite carregado:', JSON.stringify(result.data));
        }
      } else {
        setCurrentLimit(null);
        if (!result.error?.includes('encontrado')) {
          setError(result.error || 'Erro ao carregar limite');
          showToast(result.error || 'Erro ao carregar limite', 'error');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar limite atual:', error);
      setError('Erro de conexão. Verifique sua internet.');
      showToast('Erro de conexão. Verifique sua internet.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const loadAllLimites = async () => {
    try {
      const result = await limiteService.getAllLimites();
      if (result.success) {
        setLimites(result.data || []);
      } else {
        showToast(result.error || 'Erro ao carregar histórico de limites', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar limites:', error);
      showToast('Erro ao carregar histórico de limites', 'error');
    }
  };

  const handleSaveLimite = async () => {
    // Validar valor monetário
    if (!isValidCurrency(valor)) {
      showToast('Valor deve ser um número positivo', 'error');
      return;
    }

    setLoading(true);
    try {
      const valorNumber = parseCurrency(valor);
      
      let result;
      
      if (editMode && editId) {
        // Modo de edição com ID específico
        console.log('Atualizando limite com ID:', editId);
        result = await limiteService.updateLimite(editId, {
          valor: valorNumber,
          mesReferencia: selectedMonth,
        });
      } else {
        // Verificar se já existe um limite para o mês
        const existingResult = await limiteService.getLimiteByMonth(selectedMonth);
        
        if (existingResult.success && existingResult.data) {
          // Atualizar limite existente
          const limiteId = existingResult.data.id;
          console.log('Atualizando limite existente com ID:', limiteId);
          result = await limiteService.updateLimite(limiteId, {
            valor: valorNumber,
            mesReferencia: selectedMonth,
          });
        } else {
          // Criar novo limite
          console.log('Criando novo limite');
          result = await limiteService.createLimite({
            valor: valorNumber,
            mesReferencia: selectedMonth,
          });
        }
      }

      if (result.success) {
        showToast('Limite salvo com sucesso!', 'success');
        setValor('');
        setEditMode(false);
        setEditId(null);
        loadCurrentLimit();
        loadAllLimites();
      } else {
        showToast(result.error || 'Erro ao salvar limite', 'error');
      }
    } catch (error) {
      console.error('Erro completo ao salvar limite:', error);
      showToast('Erro ao salvar limite', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLimite = async () => {
    if (!currentLimit) {
      showToast('Nenhum limite encontrado para excluir', 'error');
      return;
    }

    // Verificar se o ID existe
    if (!currentLimit.id) {
      showToast('ID do limite não encontrado. Tente recarregar a página.', 'error');
      console.error('Limite sem ID:', JSON.stringify(currentLimit));
      return;
    }

    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir o limite de ${formatCurrencyWithPrefix(currentLimit.valor)} do mês ${consultaMonthLabel}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Excluindo limite com ID:', currentLimit.id);
              const result = await limiteService.deleteLimite(currentLimit.id);
              if (result.success) {
                showToast('Limite excluído com sucesso!', 'success');
                setCurrentLimit(null);
                loadAllLimites();
              } else {
                showToast(result.error || 'Erro ao excluir limite', 'error');
              }
            } catch (error) {
              console.error('Erro completo ao excluir limite:', error);
              showToast('Erro ao excluir limite', 'error');
            }
          },
        },
      ]
    );
  };

  const handleEditLimite = () => {
    if (currentLimit) {
      // Verificar se o ID existe
      if (!currentLimit.id) {
        Alert.alert('Erro', 'ID do limite não encontrado. Tente recarregar a página.');
        console.error('Limite sem ID:', JSON.stringify(currentLimit));
        return;
      }

      console.log('Editando limite com ID:', currentLimit.id);
      setEditMode(true);
      setEditId(currentLimit.id);
      setValor(currentLimit.valor?.toString().replace('.', ',') || '');
      setSelectedMonth(currentLimit.mesReferencia || consultaMonth);
      // Encontrar o label correspondente
      const monthLabel = getMonthLabel(currentLimit.mesReferencia);
      setSelectedMonthLabel(monthLabel);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.cardTitle}>Limite</Text>

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
          title={editMode ? "ATUALIZAR" : "SALVAR"}
          onPress={handleSaveLimite}
          loading={loading}
          style={styles.saveButton}
        />

        {editMode && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditMode(false);
              setEditId(null);
              setValor('');
            }}
          >
            <Text style={styles.cancelButtonText}>CANCELAR EDIÇÃO</Text>
          </TouchableOpacity>
        )}

        {/* Seção de consulta */}
        <Text style={styles.consultaTitle}>Consulta</Text>
        
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => setShowConsultaSelector(true)}
        >
          <Text style={styles.monthButtonText}>
            {consultaMonthLabel} ▼
          </Text>
        </TouchableOpacity>

        {loadingData ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando limite...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadCurrentLimit}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : currentLimit ? (
          <View style={styles.limitDisplayContainer}>
            <View style={styles.limitDisplay}>
              <Text style={styles.limitValue}>
                {consultaMonthLabel}    {formatCurrencyWithPrefix(currentLimit.valor || 0)}
              </Text>
            </View>
            
            <View style={styles.limitActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditLimite}
              >
                <Text style={styles.buttonText}>EDITAR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteLimite}
              >
                <Text style={styles.buttonText}>EXCLUIR</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.noLimitText}>
            Nenhum limite definido para este mês
          </Text>
        )}
      </ScrollView>

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

      {/* Modal de seleção de mês para consulta */}
      <MonthSelector
        visible={showConsultaSelector}
        onClose={() => setShowConsultaSelector(false)}
        selectedMonth={consultaMonth}
        onSelectMonth={(value, label) => {
          setConsultaMonth(value);
          setConsultaMonthLabel(label);
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
  consultaTitle: {
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
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#d32f2f',
    fontWeight: '600',
  },
  limitDisplayContainer: {
    marginTop: 20,
  },
  limitDisplay: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  limitValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  limitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.45,
  },
  deleteButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.45,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  noLimitText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
    fontSize: 16,
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
});

export default LimitScreen;