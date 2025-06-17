import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  const getButtonStyle = () => {
    let baseStyle = [styles.button, styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]];
    
    if (variant === 'secondary') {
      baseStyle.push(styles.buttonSecondary);
    } else if (variant === 'outline') {
      baseStyle.push(styles.buttonOutline);
    } else {
      baseStyle.push(styles.buttonPrimary);
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    let baseStyle = [styles.text];
    
    // Verificar se o style contém backgroundColor branco
    const hasWhiteBackground = style && 
      (style.backgroundColor === '#fff' || 
       style.backgroundColor === '#ffffff' || 
       style.backgroundColor === 'white');
    
    if (variant === 'outline') {
      baseStyle.push(styles.textOutline);
    } else if (hasWhiteBackground) {
      baseStyle.push(styles.textDark);
    } else {
      baseStyle.push(styles.textDefault);
    }
    
    return baseStyle;
  };

  const getLoadingColor = () => {
    // Verificar se o style contém backgroundColor branco
    const hasWhiteBackground = style && 
      (style.backgroundColor === '#fff' || 
       style.backgroundColor === '#ffffff' || 
       style.backgroundColor === 'white');
    
    return hasWhiteBackground ? '#4CAF50' : '#fff';
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} size="small" />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonMedium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonLarge: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
  },
  buttonSecondary: {
    backgroundColor: '#2196F3',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textDefault: {
    color: '#fff',
  },
  textDark: {
    color: '#4CAF50',
  },
  textOutline: {
    color: '#4CAF50',
  },
});

export default Button; 