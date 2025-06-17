import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';

const MonthSelector = ({ visible, onClose, selectedMonth, onSelectMonth }) => {
  // Gerar meses dinamicamente (12 meses para trás e 3 meses para frente)
  const months = useMemo(() => {
    const result = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Adicionar meses passados (12 meses para trás)
    for (let i = 12; i >= 0; i--) {
      let targetMonth = currentMonth - i;
      let targetYear = currentYear;
      
      // Ajustar ano se o mês for negativo
      while (targetMonth < 0) {
        targetMonth += 12;
        targetYear -= 1;
      }
      
      const monthValue = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      result.push({
        value: monthValue,
        label: `${monthNames[targetMonth]}/${targetYear}`
      });
    }
    
    // Adicionar meses futuros (3 meses para frente)
    for (let i = 1; i <= 3; i++) {
      let targetMonth = currentMonth + i;
      let targetYear = currentYear;
      
      // Ajustar ano se o mês for maior que 11 (dezembro)
      while (targetMonth > 11) {
        targetMonth -= 12;
        targetYear += 1;
      }
      
      const monthValue = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      result.push({
        value: monthValue,
        label: `${monthNames[targetMonth]}/${targetYear}`
      });
    }
    
    // Ordenar por data (mais recente primeiro)
    result.sort((a, b) => {
      return b.value.localeCompare(a.value);
    });
    
    return result;
  }, []);

  const renderMonth = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.monthItem,
        selectedMonth === item.value && styles.selectedMonth
      ]}
      onPress={() => {
        onSelectMonth(item.value, item.label);
        onClose();
      }}
    >
      <Text
        style={[
          styles.monthText,
          selectedMonth === item.value && styles.selectedMonthText
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecione o Mês</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={months}
            renderItem={renderMonth}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  monthItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedMonth: {
    backgroundColor: '#4CAF50',
  },
  monthText: {
    fontSize: 16,
    color: '#333',
  },
  selectedMonthText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MonthSelector; 