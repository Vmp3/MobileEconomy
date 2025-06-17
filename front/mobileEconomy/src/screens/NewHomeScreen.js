import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header, MonthSelector, ProgressBar, LoadingCard, ErrorCard } from '../components';
import { useAuth } from '../hooks/useAuth';
import { despesaService } from '../services/despesaService';
import { limiteService } from '../services/limiteService';
import { getCurrentMonth, getMonthLabel } from '../utils/dateUtils';

const NewHomeScreen = ({ navigation }) => {
  const currentMonth = getCurrentMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedMonthLabel, setSelectedMonthLabel] = useState(getMonthLabel(currentMonth));
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [despesas, setDespesas] = useState([]);
  const [limite, setLimite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Verificar se os serviços estão definidos
      if (!despesaService || !despesaService.getDespesasByMonth) {
        console.error('Serviço de despesas não está definido corretamente');
        setError('Erro interno do aplicativo. Tente reiniciar.');
        setLoading(false);
        return;
      }

      if (!limiteService || !limiteService.getLimiteByMonth) {
        console.error('Serviço de limites não está definido corretamente');
        setError('Erro interno do aplicativo. Tente reiniciar.');
        setLoading(false);
        return;
      }

      // Carregar dados de despesas
      let despesasResult;
      try {
        despesasResult = await despesaService.getDespesasByMonth(selectedMonth);
      } catch (despesaError) {
        console.error('Erro ao carregar despesas:', despesaError);
        despesasResult = { 
          success: false, 
          error: 'Erro ao carregar despesas. Tente novamente.' 
        };
      }

      // Carregar dados de limites
      let limiteResult;
      try {
        limiteResult = await limiteService.getLimiteByMonth(selectedMonth);
      } catch (limiteError) {
        console.error('Erro ao carregar limite:', limiteError);
        limiteResult = { 
          success: false, 
          error: 'Erro ao carregar limite. Tente novamente.' 
        };
      }

      // Processar resultados de despesas
      if (despesasResult.success) {
        setDespesas(despesasResult.data || []);
      } else {
        console.error('Erro ao carregar despesas:', despesasResult.error);
        setError(despesasResult.error);
      }

      // Processar resultados de limites
      if (limiteResult.success) {
        setLimite(limiteResult.data);
      } else {
        console.error('Erro ao carregar limite:', limiteResult.error);
        // Não definir como erro se for apenas limite não encontrado
        if (!limiteResult.error?.includes('encontrado')) {
          setError(limiteResult.error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro de conexão. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  };

  const totalDespesas = despesas.reduce((total, despesa) => total + (despesa.valor || 0), 0);
  const limiteValor = limite?.valor || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (loading) {
    return <LoadingCard message="Carregando dados..." />;
  }

  if (error) {
    return (
      <ErrorCard 
        message={error} 
        onRetry={loadData}
        retryText="Tentar novamente"
      />
    );
  }

  const firstName = user?.nome ? user.nome.split(' ')[0] : '';

  // Determina o estado da tela baseado nos dados
  const getStatusInfo = () => {
    // Caso 1: Sem registros de despesas ou limite
    if ((!despesas || despesas.length === 0) && !limite) {
      return {
        emoji: "😴",
        message: "Progresso não encontrado",
        buttonText: "COMEÇAR",
        buttonAction: () => navigation.navigate('Expense'),
        color: "#4CAF50",
        showProgress: false,
        progressText: "",
        valueText: ""
      };
    }
    
    // Caso 2: Despesas excedem o limite
    if (limiteValor > 0 && totalDespesas > limiteValor) {
      const diferenca = totalDespesas - limiteValor;
      return {
        emoji: "😓",
        message: "Objetivo não atingido",
        secondaryMessage: `-R$${diferenca.toFixed(0)}`,
        color: "#4CAF50",
        showProgress: true,
        progressText: "Progresso",
        valueText: `R$${totalDespesas.toFixed(0)}/R$${limiteValor.toFixed(0)}`
      };
    }
    
    // Caso 3: Despesas abaixo do limite (economizou)
    if (limiteValor > 0) {
      const economia = limiteValor - totalDespesas;
      return {
        emoji: "🤩",
        message: "Parabéns você economizou",
        secondaryMessage: `R$${economia.toFixed(0)}`,
        color: "#4CAF50",
        showProgress: true,
        progressText: "Progresso",
        valueText: `R$${totalDespesas.toFixed(0)}/R$${limiteValor.toFixed(0)}`
      };
    }
    
    // Caso padrão: Tem despesas mas não tem limite
    return {
      emoji: "😊",
      message: "Continue assim!",
      color: "#4CAF50",
      showProgress: false,
      progressText: "",
      valueText: `Total: R$${totalDespesas.toFixed(0)}`
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greetingText}>
          {getGreeting()} {firstName} {firstName ? '👋' : ''}
        </Text>
        <Text style={styles.greetingSubtext}>
          É bom te ver por aqui!
        </Text>

        {/* Seletor de mês */}
        <TouchableOpacity
          style={styles.monthSelectorButton}
          onPress={() => setShowMonthSelector(true)}
        >
          <Text style={styles.monthSelectorText}>
            {selectedMonthLabel} ▼
          </Text>
        </TouchableOpacity>

        {/* Seção de status */}
        <View style={[styles.statusSection, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusEmoji}>{statusInfo.emoji}</Text>
          <Text style={styles.statusMessage}>{statusInfo.message}</Text>
          {statusInfo.secondaryMessage && (
            <Text style={styles.statusSecondaryMessage}>{statusInfo.secondaryMessage}</Text>
          )}
          {statusInfo.buttonText && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={statusInfo.buttonAction}
            >
              <Text style={styles.actionButtonText}>{statusInfo.buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Barra de progresso (somente se houver limite) */}
        {statusInfo.showProgress && (
          <>
            <Text style={styles.progressLabel}>{statusInfo.progressText}</Text>
            <ProgressBar
              current={totalDespesas}
              total={limiteValor}
              showLabel={false}
            />
            <Text style={styles.progressValue}>
              {statusInfo.valueText}
            </Text>
          </>
        )}
      </ScrollView>

      {/* Modal de seleção de mês */}
      <MonthSelector
        visible={showMonthSelector}
        onClose={() => setShowMonthSelector(false)}
        selectedMonth={selectedMonth}
        onSelectMonth={(value, label) => {
          setSelectedMonth(value);
          setSelectedMonthLabel(label);
        }}
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
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  monthSelectorButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  monthSelectorText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    borderRadius: 12,
  },
  statusEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  statusSecondaryMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  actionButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    marginTop: 4,
  },
});

export default NewHomeScreen; 