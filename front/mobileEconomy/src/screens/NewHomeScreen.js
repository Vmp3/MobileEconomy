import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LinearGradient,
} from 'react-native';

import { Header, MonthSelector, ProgressBar, LoadingCard, ErrorCard } from '../components';
import { useAuth } from '../hooks/useAuth';
import { despesaService } from '../services/despesaService';
import { limiteService } from '../services/limiteService';
import { getCurrentMonth, getMonthLabel } from '../utils/dateUtils';
import { formatCurrency, formatCurrencyWithPrefix } from '../utils/formatUtils';

const NewHomeScreen = ({ navigation, onNavigateToTab }) => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedMonthLabel, setSelectedMonthLabel] = useState(getMonthLabel(getCurrentMonth()));
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [despesas, setDespesas] = useState([]);
  const [limite, setLimite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função de navegação que funciona com o sistema do MainScreen
  const navigateToScreen = (screenName) => {
    if (onNavigateToTab) {
      onNavigateToTab(screenName);
    } else if (navigation && navigation.navigate) {
      navigation.navigate(screenName);
    }
  };

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
        buttonAction: () => navigateToScreen('Expense'),
        color: "#4CAF50",
        showProgress: false,
        progressText: "",
        valueText: ""
      };
    }
    
    // Caso 2: Tem despesas mas não tem limite - NOVO CASO
    if (despesas && despesas.length > 0 && (!limite || limiteValor === 0)) {
      return {
        emoji: "⚠️",
        message: "Você precisa definir um limite mensal para acompanhar seu progresso",
        buttonText: "CADASTRAR LIMITE",
        buttonAction: () => navigateToScreen('Limit'),
        color: "#fd7e14", // Laranja moderno
        showProgress: false,
        progressText: "",
        valueText: `Total gasto: ${formatCurrencyWithPrefix(totalDespesas)}`
      };
    }
    
    // Caso 3: Despesas excedem o limite
    if (limiteValor > 0 && totalDespesas > limiteValor) {
      const diferenca = totalDespesas - limiteValor;
      return {
        emoji: "😓",
        message: "Objetivo não atingido",
        secondaryMessage: `-${formatCurrency(diferenca)}`,
        color: "#dc3545", // Vermelho moderno
        showProgress: true,
        progressText: "Progresso",
        valueText: `${formatCurrencyWithPrefix(totalDespesas)}/${formatCurrencyWithPrefix(limiteValor)}`
      };
    }
    
    // Caso 4: Despesas abaixo do limite (economizou)
    if (limiteValor > 0) {
      const economia = limiteValor - totalDespesas;
      return {
        emoji: "🤩",
        message: "Parabéns você economizou",
        secondaryMessage: `${formatCurrency(economia)}`,
        color: "#28a745", // Verde moderno
        showProgress: true,
        progressText: "Progresso",
        valueText: `${formatCurrencyWithPrefix(totalDespesas)}/${formatCurrencyWithPrefix(limiteValor)}`
      };
    }
    
    // Caso padrão (não deveria chegar aqui)
    return {
      emoji: "😊",
      message: "Continue assim!",
      color: "#28a745", // Verde moderno
      showProgress: false,
      progressText: "",
      valueText: `Total: ${formatCurrencyWithPrefix(totalDespesas)}`
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={styles.container}>
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
          {/* Overlay sutil para dar profundidade */}
          <View style={styles.statusOverlay} />
          <Text style={styles.statusEmoji}>{statusInfo.emoji}</Text>
          <Text style={styles.statusMessage}>{statusInfo.message}</Text>
          {statusInfo.secondaryMessage && (
            <Text style={styles.statusSecondaryMessage}>{statusInfo.secondaryMessage}</Text>
          )}
          {statusInfo.buttonText && (
            <TouchableOpacity 
              style={[
                styles.actionButton,
                statusInfo.color === '#fd7e14' && styles.actionButtonAlert
              ]}
              onPress={statusInfo.buttonAction}
            >
              <Text style={[
                styles.actionButtonText,
                statusInfo.color === '#fd7e14' && styles.actionButtonTextAlert
              ]}>
                {statusInfo.buttonText}
              </Text>
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

        {/* Mostrar total quando não há progresso mas há valueText (caso de alerta) */}
        {!statusInfo.showProgress && statusInfo.valueText && (
          <View style={styles.totalSection}>
            <View style={styles.totalIconContainer}>
              <Text style={styles.totalIcon}>💰</Text>
            </View>
            <Text style={styles.totalValue}>
              {statusInfo.valueText.replace('Total gasto: ', '')}
            </Text>
            <Text style={styles.totalLabel}>
              Total gasto este mês
            </Text>
          </View>
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
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 30,
    fontWeight: '400',
  },
  monthSelectorButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  monthSelectorText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    fontWeight: '600',
  },
  statusSection: {
    marginBottom: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  statusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  statusEmoji: {
    fontSize: 56,
    marginBottom: 16,
    textAlign: 'center',
    zIndex: 1,
  },
  statusMessage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 1,
  },
  statusSecondaryMessage: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    zIndex: 1,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 1,
  },
  actionButtonText: {
    color: '#28a745',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  actionButtonAlert: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: 'rgba(255,152,0,0.3)',
  },
  actionButtonTextAlert: {
    color: '#ff6b00',
    fontWeight: '800',
  },
  progressLabel: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 12,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '600',
  },
  totalSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  totalIconContainer: {
    backgroundColor: '#fd7e14',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#fd7e14',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  totalIcon: {
    fontSize: 20,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  // Gradientes para diferentes estados
  statusGradientSuccess: {
    backgroundColor: '#28a745',
  },
  statusGradientWarning: {
    backgroundColor: '#fd7e14',
  },
  statusGradientDanger: {
    backgroundColor: '#dc3545',
  },
  statusGradientInfo: {
    backgroundColor: '#17a2b8',
  },
});

export default NewHomeScreen; 