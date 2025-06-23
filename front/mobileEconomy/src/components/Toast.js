import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';

const Toast = ({ visible, message, type = 'error', duration = 3000, onHide }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onHide) {
          onHide();
        }
      });
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) {
    return null;
  }

  const backgroundColor = type === 'success' ? '#4CAF50' : '#e74c3c';

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor, opacity },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Toast; 