import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ current, total, label }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isOverLimit = percentage > 100;
  
  const getBarColor = () => {
    if (isOverLimit) return '#ff4444';
    if (percentage > 80) return '#ff9800';
    return '#4CAF50';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: getBarColor(),
              }
            ]}
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.currentText}>
          R${current.toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.totalText}>
          /R${total.toFixed(2).replace('.', ',')}
        </Text>
      </View>
      {isOverLimit && (
        <Text style={styles.warningText}>
          Limite excedido em R${(current - total).toFixed(2).replace('.', ',')}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBackground: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalText: {
    fontSize: 14,
    color: '#666',
  },
  warningText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default ProgressBar; 